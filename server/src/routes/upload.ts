// 파일 업로드 API (Supabase Storage 백엔드).
// 클라이언트가 multipart/form-data 로 보낸 파일을 메모리 버퍼로 받아
// Supabase Storage 버킷에 업로드하고, 공개 URL을 응답한다.

import { Router } from 'express';
import multer from 'multer';
import { randomBytes } from 'crypto';
import { fileTypeFromBuffer } from 'file-type';
import { requireAdmin } from '../middleware/require-admin.js';
import { getSupabase, STORAGE_BUCKET } from '../lib/supabase.js';

export const uploadRouter = Router();

// MIME 화이트리스트는 클라이언트 위변조 가능 — 매직바이트로 한 번 더 검증.
// SVG는 안에 <script>를 품을 수 있어 명시적으로 차단한다.
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
const ALLOWED_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
};

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

  // 매직바이트 검증 — 실제 파일이 허용된 이미지 타입인지 확인.
  const detected = await fileTypeFromBuffer(req.file.buffer);
  if (!detected || !ALLOWED_MIME.has(detected.mime)) {
    res.status(400).json({
      error: 'Invalid input',
      details: { reason: 'unsupported image binary', detected: detected?.mime ?? 'unknown' },
    });
    return;
  }

  // 확장자는 검증된 실제 타입에서 도출 (사용자 제공 originalname 신뢰 안 함).
  const ext = ALLOWED_EXT[detected.mime];
  const objectKey = `${Date.now()}-${randomBytes(8).toString('hex')}${ext}`;

  const supabase = getSupabase();
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(objectKey, req.file.buffer, {
      contentType: detected.mime,
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
