// Express 앱 정의.
// Vercel serverless에서 사용되며, /api/* 요청을 처리한다.
// 정적 파일 호스팅과 SPA fallback은 Vercel 플랫폼이 담당하므로 여기서는 생략한다.

import express from 'express';
import cors from 'cors';

import { archiveRouter } from './routes/archive.js';
import { magazineRouter } from './routes/magazine.js';
import { applyRouter } from './routes/apply.js';
import { scheduleRouter } from './routes/schedule.js';
import { uploadRouter } from './routes/upload.js';
import { adminAuthRouter } from './routes/admin-auth.js';
import { diagRouter } from './routes/diag.js';
import { errorHandler } from './middleware/error.js';

const app = express();

// Vercel 등 리버스 프록시 뒤에서 X-Forwarded-For 신뢰 (rate limit IP 식별용).
app.set('trust proxy', 1);

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// 추가 정규식 패턴 (예: 본인 프로젝트 프리뷰 도메인). 콤마로 구분.
const allowedOriginPatterns = (process.env.ALLOWED_ORIGIN_PATTERNS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
  .map((p) => {
    try {
      return new RegExp(p);
    } catch {
      console.warn(`⚠️ ALLOWED_ORIGIN_PATTERNS 항목이 유효한 정규식이 아님: ${p}`);
      return null;
    }
  })
  .filter((r): r is RegExp => r !== null);

// 같은 오리진(헤더 없음), 명시 허용 도메인, 로컬 dev만 허용.
// *.vercel.app 광범위 허용은 보안상 제거 — 필요한 프리뷰는 ALLOWED_ORIGIN_PATTERNS로.
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      try {
        const host = new URL(origin).hostname;
        if (host === 'localhost' || host === '127.0.0.1') return cb(null, true);
      } catch {
        /* ignore */
      }
      if (allowedOriginPatterns.some((re) => re.test(origin))) return cb(null, true);
      cb(new Error(`CORS: origin not allowed (${origin})`));
    },
    credentials: false,
  }),
);

app.use(express.json({ limit: '10mb' }));

app.use('/api/_diag', diagRouter);
app.use('/api/admin', adminAuthRouter);
app.use('/api/archives', archiveRouter);
app.use('/api/magazines', magazineRouter);
app.use('/api/apply', applyRouter);
app.use('/api/schedules', scheduleRouter);
app.use('/api/upload', uploadRouter);

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

app.use(errorHandler);

export { app };
