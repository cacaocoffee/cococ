// ──────────────────────────────────────────────────────────
// Express 앱 설정
// ──────────────────────────────────────────────────────────
// Express는 Node.js에서 가장 많이 쓰이는 웹 서버 프레임워크입니다.
// "프레임워크"란 웹 서버를 쉽게 만들 수 있게 도와주는 도구 모음입니다.
//
// 이 파일에서 하는 일:
// 1. Express 앱을 생성합니다
// 2. 미들웨어를 등록합니다 (요청을 처리하기 전에 거치는 중간 단계들)
// 3. API 라우트를 연결합니다 (어떤 URL에 어떤 기능을 연결할지)
// ──────────────────────────────────────────────────────────

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// 각 기능별 라우트 파일을 가져옵니다
import { archiveRouter } from './routes/archive.js';
import { magazineRouter } from './routes/magazine.js';
import { applyRouter } from './routes/apply.js';
import { scheduleRouter } from './routes/schedule.js';
import { uploadRouter } from './routes/upload.js';
import { adminAuthRouter } from './routes/admin-auth.js';
import { errorHandler } from './middleware/error.js';

// ESM에서 __dirname 사용하기 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ① Express 앱 생성
const app = express();

// ──────────────────────────────────────────────────────────
// ② 미들웨어 등록
// ──────────────────────────────────────────────────────────
// 미들웨어(middleware)란?
// → 요청(request)이 API 함수에 도달하기 전에 거치는 "중간 처리기"입니다.
// → 예: JSON 파싱, 로그 기록, 인증 확인 등

// cors(): 허용할 출처(origin)를 ALLOWED_ORIGINS 환경변수로 제한한다.
// 콤마로 구분해 여러 도메인을 허용할 수 있다. 미설정 시 로컬 프론트만 허용.
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: false }));

// express.json(): 클라이언트가 보낸 JSON 데이터를 자동으로 파싱(해석)합니다.
// 이게 없으면 req.body가 undefined가 됩니다.
app.use(express.json({ limit: '10mb' }));

// 업로드된 파일을 브라우저에서 접근할 수 있게 합니다.
// "/uploads/abc.jpg" URL로 접근하면 서버의 uploads 폴더에서 파일을 제공합니다.
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ──────────────────────────────────────────────────────────
// ③ API 라우트 등록
// ──────────────────────────────────────────────────────────
// 각 라우트는 특정 URL 경로에 연결됩니다:
// /api/archives  → 아카이브 관련 API
// /api/magazines → 매거진 관련 API
// /api/apply     → 지원서 관련 API
// /api/schedules → 일정 관련 API
// /api/upload    → 파일 업로드 API

app.use('/api/admin', adminAuthRouter);
app.use('/api/archives', archiveRouter);
app.use('/api/magazines', magazineRouter);
app.use('/api/apply', applyRouter);
app.use('/api/schedules', scheduleRouter);
app.use('/api/upload', uploadRouter);

// 루트 경로 - API 상태 확인용
app.get('/api', (_req, res) => {
  res.json({
    message: 'COCOC API 서버가 정상 동작 중입니다 🍸',
    version: '1.0.0',
    endpoints: {
      archives: '/api/archives',
      magazines: '/api/magazines',
      apply: '/api/apply',
      schedules: '/api/schedules',
      upload: '/api/upload',
    },
  });
});

// ④ 에러 처리 미들웨어 (가장 마지막에 등록해야 합니다)
app.use(errorHandler);

export { app };
