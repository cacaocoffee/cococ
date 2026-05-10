// ──────────────────────────────────────────────────────────
// 에러 처리 미들웨어
// ──────────────────────────────────────────────────────────
// API에서 에러가 발생하면 이 미들웨어가 잡아서
// 클라이언트에게 깔끔한 에러 응답을 보내줍니다.
//
// Express에서 에러 미들웨어는 매개변수가 반드시 4개여야 합니다:
// (err, req, res, next) → 이 4개를 써야 Express가 에러 핸들러로 인식합니다.
// ──────────────────────────────────────────────────────────

import type { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // 에러 내용을 서버 콘솔에 출력 (디버깅용)
  console.error('❌ 서버 에러:', err.message);

  // 운영 환경에서는 내부 메시지를 응답 본문에 노출하지 않는다.
  const isProd = process.env.NODE_ENV === 'production';
  res.status(500).json(
    isProd
      ? { error: '서버에서 오류가 발생했습니다' }
      : { error: '서버에서 오류가 발생했습니다', message: err.message },
  );
}
