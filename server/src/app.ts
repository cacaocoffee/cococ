// Express 앱 정의.
// Vercel serverless에서 사용되며, /api/* 요청을 처리한다.
// 정적 파일 호스팅과 SPA fallback은 Vercel 플랫폼이 담당하므로 여기서는 생략한다.

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

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

// trailing slash 같은 흔한 입력 실수에 견디게 정규화 — 비교는 항상 정규화된 값끼리.
const normalizeOrigin = (s: string): string => s.trim().replace(/\/+$/, '');

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173')
  .split(',')
  .map(normalizeOrigin)
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

// 콜드스타트마다 한 번 — 어느 origin/패턴이 실제로 로드됐는지 가시화.
console.log('[cors] loaded', {
  allowedOrigins,
  patternCount: allowedOriginPatterns.length,
  patternSources: allowedOriginPatterns.map((r) => r.source),
  envAllowedOriginsSet: !!process.env.ALLOWED_ORIGINS,
  envAllowedOriginPatternsSet: !!process.env.ALLOWED_ORIGIN_PATTERNS,
});

// 같은 오리진(헤더 없음), 명시 허용 도메인, 로컬 dev만 허용.
// *.vercel.app 광범위 허용은 보안상 제거 — 필요한 프리뷰는 ALLOWED_ORIGIN_PATTERNS로.
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const normalized = normalizeOrigin(origin);
      if (allowedOrigins.includes(normalized)) return cb(null, true);
      try {
        const host = new URL(normalized).hostname;
        if (host === 'localhost' || host === '127.0.0.1') return cb(null, true);
      } catch {
        /* ignore */
      }
      if (allowedOriginPatterns.some((re) => re.test(normalized))) return cb(null, true);
      console.warn('[cors] reject', {
        origin,
        normalized,
        allowedOrigins,
        patternSources: allowedOriginPatterns.map((r) => r.source),
      });
      cb(new Error(`CORS: origin not allowed (${origin})`));
    },
    // 어드민 세션 쿠키 동봉 필요 (cross-origin dev/preview 시나리오).
    credentials: true,
  }),
);

app.use(cookieParser());
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
