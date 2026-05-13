import type { Request, Response, NextFunction } from 'express';
import { isValid } from '../lib/admin-tokens.js';

const COOKIE_NAME = 'cococ_admin_session';

export async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  // 토큰은 HttpOnly 쿠키로만 전달된다. Authorization 헤더 폴백은 의도적으로 제거(XSS 토큰 탈취 차단).
  const token = req.cookies?.[COOKIE_NAME];
  if (typeof token !== 'string' || !token || !(await isValid(token))) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}
