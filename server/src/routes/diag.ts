// 진단용 헬스 체크 라우트.
// env 변수가 설정돼 있는지(값은 응답하지 않음, boolean만), Prisma가 DB에 도달하는지 확인.
// 값은 일부러 응답에 포함하지 않고 setting 여부만 노출한다.

import { Router } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../prisma.js';

export const diagRouter = Router();

const REQUIRED_ENV = [
  'DATABASE_URL',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_BUCKET',
  'ADMIN_PASSWORD',
] as const;

diagRouter.get('/', async (_req, res) => {
  const env: Record<string, boolean> = {};
  for (const key of REQUIRED_ENV) {
    const v = process.env[key];
    env[key] = typeof v === 'string' && v.length > 0;
  }

  let db: 'ok' | { ok: false; code?: string; kind: string };
  try {
    await prisma.$queryRaw`SELECT 1`;
    db = 'ok';
  } catch (e) {
    let code: string | undefined;
    let kind = 'unknown';
    if (e instanceof Prisma.PrismaClientInitializationError) {
      code = e.errorCode ?? 'PRISMA_INIT';
      kind = 'init';
    } else if (e instanceof Prisma.PrismaClientKnownRequestError) {
      code = e.code;
      kind = 'known_request';
    } else if (e instanceof Error) {
      kind = e.name;
    }
    db = { ok: false, code, kind };
  }

  res.json({ env, db, nodeEnv: process.env.NODE_ENV ?? null });
});
