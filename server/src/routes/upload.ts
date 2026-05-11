// 파일 업로드 API (Supabase Storage 백엔드).
// 클라이언트가 multipart/form-data 로 보낸 파일을 메모리 버퍼로 받아
// Supabase Storage 버킷에 업로드하고, 공개 URL을 응답한다.

import { Router } from 'express';
import multer from 'multer';
import { randomBytes } from 'crypto';
import path from 'path';
import { requireAdmin } from '../middleware/require-admin.js';
import { supabase, STORAGE_BUCKET } from '../lib/supabase.js';

export const uploadRouter = Router();

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드할 수 있습니다 (jpg, png, gif, webp)'));
    }
  },
});

uploadRouter.post('/', requireAdmin, upload.single('file'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'Invalid input', details: { file: 'required' } });
    return;
  }
  if (!ALLOWED_MIME.has(req.file.mimetype)) {
    res.status(400).json({ error: 'Invalid input', details: { mimetype: req.file.mimetype } });
    return;
  }

  const ext = path.extname(req.file.originalname).toLowerCase();
  const objectKey = `${Date.now()}-${randomBytes(8).toString('hex')}${ext}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(objectKey, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: false,
    });

  if (error) {
    console.error('Supabase upload failed:', error);
    res.status(500).json({ error: 'Upload failed' });
    return;
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(objectKey);
  res.json({ url: data.publicUrl });
});
