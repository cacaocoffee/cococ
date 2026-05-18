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

function supabaseHost(): string | null {
  try {
    return process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL).hostname : null;
  } catch {
    return null;
  }
}

uploadRouter.post('/', requireAdmin, upload.single('file'), async (req, res) => {
  const t0 = Date.now();
  const reqId = randomBytes(4).toString('hex');
  const log = (step: string, extra: Record<string, unknown> = {}): void => {
    console.log(`[upload ${reqId}] ${step} (+${Date.now() - t0}ms)`, extra);
  };

  log('start', {
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseHost: supabaseHost(),
    resolvedBucket: STORAGE_BUCKET,
    bucketEnvSet: !!process.env.SUPABASE_BUCKET,
  });

  if (!req.file) {
    log('fail: no file');
    res.status(400).json({ error: 'Invalid input', details: { file: 'required', reqId } });
    return;
  }
  log('multer ok', { size: req.file.size, mimetype: req.file.mimetype, originalname: req.file.originalname });

  if (!ALLOWED_MIME.has(req.file.mimetype)) {
    log('fail: bad client mimetype', { mimetype: req.file.mimetype });
    res.status(400).json({ error: 'Invalid input', details: { mimetype: req.file.mimetype, reqId } });
    return;
  }

  let detected;
  try {
    detected = await fileTypeFromBuffer(req.file.buffer);
  } catch (e) {
    log('fail: fileTypeFromBuffer threw', { err: (e as Error).message });
    res.status(500).json({ error: 'Upload failed', details: { reason: 'magic-byte check threw', reqId } });
    return;
  }
  if (!detected || !ALLOWED_MIME.has(detected.mime)) {
    log('fail: magic-byte rejected', { detected: detected?.mime ?? null });
    res.status(400).json({
      error: 'Invalid input',
      details: { reason: 'unsupported image binary', detected: detected?.mime ?? 'unknown', reqId },
    });
    return;
  }
  log('magic-byte ok', { detected: detected.mime });

  const ext = ALLOWED_EXT[detected.mime];
  const objectKey = `${Date.now()}-${randomBytes(8).toString('hex')}${ext}`;

  let supabase;
  try {
    supabase = getSupabase();
    log('supabase client ok');
  } catch (e) {
    log('fail: getSupabase threw (env missing?)', { err: (e as Error).message });
    res.status(500).json({
      error: 'Upload failed',
      details: { reason: 'supabase env not configured', message: (e as Error).message, reqId },
    });
    return;
  }

  log('storage.upload begin', { bucket: STORAGE_BUCKET, objectKey, size: req.file.size });
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

  let result;
  try {
    result = await Promise.race([uploadPromise, timeoutPromise]);
  } catch (e) {
    log('fail: storage.upload threw', { err: (e as Error).message });
    res.status(500).json({
      error: 'Upload failed',
      details: { reason: 'storage call threw', message: (e as Error).message, reqId },
    });
    return;
  }
  const error = (result as { error: unknown }).error as
    | { message?: string; __timeout?: boolean }
    | null;

  if (error) {
    log('fail: storage.upload returned error', {
      bucket: STORAGE_BUCKET,
      objectKey,
      mime: detected.mime,
      size: req.file.size,
      error,
    });
    if (error.__timeout) {
      res.status(503).json({ error: 'Storage upstream timeout', details: { bucket: STORAGE_BUCKET, reqId } });
      return;
    }
    res.status(500).json({ error: 'Upload failed', details: { message: error.message ?? 'unknown', reqId } });
    return;
  }
  log('storage.upload ok');

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(objectKey);
  log('done', { url: data.publicUrl });
  res.json({ url: data.publicUrl });
});
