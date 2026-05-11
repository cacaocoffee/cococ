import { Router } from 'express';
import { randomBytes } from 'crypto';
import { issue, revoke } from '../lib/admin-tokens.js';
import { requireAdmin } from '../middleware/require-admin.js';

export const adminAuthRouter = Router();

// 토큰 유효성 검증용 가벼운 핑 — 프론트가 admin shell 렌더 전에 호출.
adminAuthRouter.get('/ping', requireAdmin, (_req, res) => {
  res.json({ ok: true });
});

adminAuthRouter.post('/login', async (req, res) => {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    console.error('❌ ADMIN_PASSWORD 환경변수가 설정되지 않았습니다');
    res.status(500).json({ error: '서버 설정 오류' });
    return;
  }

  const password = req.body?.password;
  if (typeof password !== 'string' || password !== expected) {
    res.status(401).json({ error: '비밀번호가 올바르지 않습니다' });
    return;
  }

  const token = randomBytes(32).toString('hex');
  const expiresAt = await issue(token);
  res.json({ token, expiresAt });
});

adminAuthRouter.post('/logout', async (req, res) => {
  const header = req.headers.authorization ?? '';
  const match = /^Bearer\s+(.+)$/.exec(header);
  if (match) await revoke(match[1]);
  res.status(200).json({ ok: true });
});
