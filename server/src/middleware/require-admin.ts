import type { Request, Response, NextFunction } from 'express';
import { isValid } from '../lib/admin-tokens.js';
import { prisma } from '../prisma.js';
import { hashDeviceToken } from './require-hr.js';

const COOKIE_NAME = 'cococ_admin_session';

// 어드민 권한이 필요한 라우트의 인증. 둘 중 하나면 통과한다.
//   1) 어드민 웹: HttpOnly 쿠키 (Authorization 헤더 폴백은 XSS 토큰 탈취를 막으려고 웹에는 두지 않는다)
//   2) 코콕 인사 앱: 어드민 비밀번호로 등록한 기기의 토큰 (Authorization: Bearer).
//      앱에서 접수 기간, 일정 같은 것도 관리하려고 허용한다. 어드민의 회비 탭에서 기기를 지우면 바로 못 쓴다.
export async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (typeof token === 'string' && token && (await isValid(token))) {
      next();
      return;
    }

    const header = req.headers.authorization;
    if (typeof header === 'string' && header.startsWith('Bearer ')) {
      const bearer = header.slice('Bearer '.length).trim();
      if (bearer) {
        const device = await prisma.hrDevice.findUnique({ where: { tokenHash: hashDeviceToken(bearer) } });
        if (device) {
          next();
          return;
        }
      }
    }

    res.status(401).json({ error: 'Unauthorized' });
  } catch (err) {
    next(err);
  }
}
