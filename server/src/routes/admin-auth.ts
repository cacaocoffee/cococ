import { Router } from 'express';
import { randomBytes, timingSafeEqual } from 'crypto';
import rateLimit from 'express-rate-limit';
import { issue, revoke } from '../lib/admin-tokens.js';
import { requireAdmin } from '../middleware/require-admin.js';

export const adminAuthRouter = Router();

const COOKIE_NAME = 'cococ_admin_session';
const COOKIE_MAX_AGE_MS = 12 * 60 * 60 * 1000;

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/api',
    maxAge: COOKIE_MAX_AGE_MS,
  };
}

// 토큰 유효성 검증용 가벼운 핑 — 프론트가 admin shell 렌더 전에 호출.
adminAuthRouter.get('/ping', requireAdmin, (_req, res) => {
  res.json({ ok: true });
});

// 로그인 brute-force 방어: IP당 15분에 10회까지.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.' },
});

// 상수시간 비교 — 길이/내용 차이로 인한 타이밍 누출 차단.
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ab.length !== bb.length) {
    // 길이가 달라도 항상 비교는 수행해서 타이밍 균등화.
    timingSafeEqual(ab, ab);
    return false;
  }
  return timingSafeEqual(ab, bb);
}

adminAuthRouter.post('/login', loginLimiter, async (req, res) => {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    console.error('❌ ADMIN_PASSWORD 환경변수가 설정되지 않았습니다');
    res.status(500).json({ error: '서버 설정 오류' });
    return;
  }

  const password = req.body?.password;
  if (typeof password !== 'string' || !safeEqual(password, expected)) {
    res.status(401).json({ error: '비밀번호가 올바르지 않습니다' });
    return;
  }

  const token = randomBytes(32).toString('hex');
  const expiresAt = await issue(token);
  // 토큰은 HttpOnly 쿠키로만 전달 — JS 측에서 접근 불가 → XSS로 탈취 차단.
  res.cookie(COOKIE_NAME, token, cookieOptions());
  res.json({ ok: true, expiresAt });
});

adminAuthRouter.post('/logout', async (req, res) => {
  const cookieToken = req.cookies?.[COOKIE_NAME];
  if (typeof cookieToken === 'string' && cookieToken) {
    await revoke(cookieToken);
  }
  res.clearCookie(COOKIE_NAME, { ...cookieOptions(), maxAge: undefined });
  res.status(200).json({ ok: true });
});
