// Express 에러 처리 미들웨어.
// 운영 모드에서도 Prisma 에러 코드(P1xxx, P2xxx 등)는 노출한다.
// 코드 자체는 비밀이 아니고, 진단에 결정적이기 때문이다.
// 단 에러 메시지/스택/DSN은 가린다.

import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error('❌ 서버 에러:', err);

  const isProd = process.env.NODE_ENV === 'production';

  let code: string | undefined;
  if (err instanceof Prisma.PrismaClientInitializationError) {
    code = err.errorCode ?? 'PRISMA_INIT';
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    code = err.code;
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    code = 'PRISMA_RUST_PANIC';
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    code = 'PRISMA_VALIDATION';
  }

  const body: Record<string, unknown> = { error: '서버에서 오류가 발생했습니다' };
  if (code) body.code = code;
  if (!isProd) body.message = err.message;

  res.status(500).json(body);
}
