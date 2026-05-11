// ──────────────────────────────────────────────────────────
// Zod 기반 요청 본문 검증 미들웨어
// ──────────────────────────────────────────────────────────
// validate(schema)는 Express 미들웨어를 반환합니다. 들어온 req.body를
// 주어진 Zod 스키마로 파싱·검증한 뒤, 통과하면 req.body를 파싱된
// 값(기본값 적용·타입 강제 후)으로 교체하고 다음 핸들러로 넘깁니다.
// 실패 시 400 { error: 'Invalid input', details } 형식으로 응답합니다.
// ──────────────────────────────────────────────────────────

import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';

export function validate<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'Invalid input',
        details: result.error.flatten(),
      });
      return;
    }
    req.body = result.data;
    next();
  };
}
