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

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// 같은 오리진(헤더 없음), 명시 허용 도메인, 그리고 *.vercel.app 미리보기 도메인을 모두 허용.
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      try {
        const host = new URL(origin).hostname;
        if (host === 'localhost' || host.endsWith('.vercel.app')) return cb(null, true);
      } catch {
        /* ignore */
      }
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
