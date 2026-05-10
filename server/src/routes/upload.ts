// ──────────────────────────────────────────────────────────
// 파일 업로드 API
// ──────────────────────────────────────────────────────────
// multer: Node.js에서 파일 업로드를 처리하는 라이브러리입니다.
// 브라우저에서 파일을 보내면 multer가 받아서 서버 폴더에 저장합니다.
//
// 흐름:
//   1. 사용자가 이미지 선택 → 브라우저가 FormData로 파일 전송
//   2. multer가 파일을 받아서 uploads/ 폴더에 저장
//   3. 서버가 파일의 URL을 응답으로 돌려줌
//   4. 프론트엔드가 이 URL을 <img src="..."> 에 사용
//
//   POST /api/upload → 파일 업로드 (1개)
// ──────────────────────────────────────────────────────────

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAdmin } from '../middleware/require-admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadRouter = Router();

// ──────────────────────────────────────────────────────────
// multer 설정
// ──────────────────────────────────────────────────────────
// storage: 파일을 어디에, 어떤 이름으로 저장할지 설정합니다.
const storage = multer.diskStorage({
  // destination: 파일이 저장될 폴더
  destination: path.join(__dirname, '..', '..', 'uploads'),

  // filename: 파일명 중복을 방지하기 위해 타임스탬프를 붙입니다.
  // 예: 1713248000000-photo.jpg
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// multer 인스턴스 생성
// limits.fileSize: 최대 파일 크기 (10MB)
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    // 이미지 파일만 허용
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드할 수 있습니다 (jpg, png, gif, webp)'));
    }
  },
});

// POST /api/upload
// upload.single('file') → 'file'이라는 이름의 파일 1개를 받습니다.
// 프론트엔드에서 FormData에 append('file', ...) 로 보내야 합니다.
uploadRouter.post('/', requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: '파일이 없습니다' });
    return;
  }

  // 업로드된 파일의 접근 URL을 만들어 응답합니다.
  // 예: /uploads/1713248000000-photo.jpg
  const url = `/uploads/${req.file.filename}`;

  res.json({ url });
});
