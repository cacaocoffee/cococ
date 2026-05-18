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

  // Vercel function 한도(30s) 안쪽에서 직접 503으로 변환 — 호출이 매달려도 클라이언트가 의미있는 에러를 받게.
  const STORAGE_TIMEOUT_MS = 15_000;
  const uploadPromise = supabase.storage
    .from(STORAGE_BUCKET)
    .upload(objectKey, req.file.buffer, {
      contentType: detected.mime,
      upsert: false,
    });
  const timeoutPromise = new Promise<{ error: { message: string; __timeout: true } }>((resolve) => {
    setTimeout(
      () => resolve({ error: { message: `Storage upload timed out after ${STORAGE_TIMEOUT_MS}ms`, __timeout: true } }),
      STORAGE_TIMEOUT_MS,
    );
  });
  const result = await Promise.race([uploadPromise, timeoutPromise]);
  const error = (result as { error: unknown }).error as
    | { message?: string; __timeout?: boolean }
    | null;

  if (error) {
    console.error('Supabase upload failed:', {
      bucket: STORAGE_BUCKET,
      objectKey,
      mime: detected.mime,
      size: req.file.size,
      error,
    });
    if (error.__timeout) {
      res.status(503).json({ error: 'Storage upstream timeout', details: { bucket: STORAGE_BUCKET } });
      return;
    }
    res.status(500).json({ error: 'Upload failed', details: { message: error.message ?? 'unknown' } });
    return;
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(objectKey);
  res.json({ url: data.publicUrl });
});
