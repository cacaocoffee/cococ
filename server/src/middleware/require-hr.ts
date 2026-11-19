// 인사(회원·회비) API의 인증.
// 두 가지 중 하나면 통과한다.
//   1) 어드민 웹: 로그인할 때 받은 HttpOnly 쿠키 (다른 어드민 라우트와 같다)
//   2) 회비 앱: 기기를 등록할 때 받은 토큰 (Authorization: Bearer)
// 앱은 며칠씩 켜 둔 채로 입금을 올려야 해서 12시간짜리 쿠키를 쓸 수 없다.
// 브라우저에는 이 토큰을 내려보내지 않으므로, 쿠키만 쓰게 한 기존 결정(XSS로 토큰이 새는 것 방지)은 그대로다.

import type { Request, Response, NextFunction } from 'express';
import { createHash } from 'crypto';
import { prisma } from '../prisma.js';
import { isValid } from '../lib/admin-tokens.js';

const COOKIE_NAME = 'cococ_admin_session';
const LAST_USED_INTERVAL_MS = 60 * 60 * 1000;

export function hashDeviceToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

function bearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (typeof header !== 'string' || !header.startsWith('Bearer ')) return null;
  const token = header.slice('Bearer '.length).trim();
  return token || null;
}

export async function requireHr(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = bearerToken(req);
    if (token) {
      const device = await prisma.hrDevice.findUnique({ where: { tokenHash: hashDeviceToken(token) } });
      if (device) {
        // 요청마다 쓰지 않고, 한 시간에 한 번만 마지막 사용 시각을 고친다
        const last = device.lastUsedAt?.getTime() ?? 0;
        if (Date.now() - last > LAST_USED_INTERVAL_MS) {
          await prisma.hrDevice.update({ where: { id: device.id }, data: { lastUsedAt: new Date() } });
        }
        res.locals.hrDeviceId = device.id;
        next();
        return;
      }
    }

    const cookie = req.cookies?.[COOKIE_NAME];
    if (typeof cookie === 'string' && cookie && (await isValid(cookie))) {
      next();
      return;
    }

    res.status(401).json({ error: 'Unauthorized' });
  } catch (err) {
    next(err);
  }
}
