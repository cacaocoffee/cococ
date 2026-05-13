// 진단용 헬스 체크 라우트.
// env 변수가 설정돼 있는지(값은 응답하지 않음, boolean만), Prisma가 DB에 도달하는지 확인.
// 값은 일부러 응답에 포함하지 않고 setting 여부만 노출한다.

import { Router } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../prisma.js';
import { requireAdmin } from '../middleware/require-admin.js';

export const diagRouter = Router();

// 진단 라우트는 인프라 메타데이터를 노출하므로 어드민 전용.
diagRouter.use(requireAdmin);

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

  let db: 'ok' | { ok: false; code?: string; kind: string; message?: string };
  try {
    await prisma.$queryRaw`SELECT 1`;
    db = 'ok';
  } catch (e) {
    let code: string | undefined;
    let kind = 'unknown';
    let message: string | undefined;
    if (e instanceof Prisma.PrismaClientInitializationError) {
      code = e.errorCode ?? 'PRISMA_INIT';
      kind = 'init';
      message = e.message;
    } else if (e instanceof Prisma.PrismaClientKnownRequestError) {
      code = e.code;
      kind = 'known_request';
      message = e.message;
    } else if (e instanceof Error) {
      kind = e.name;
      message = e.message;
    }
    // DATABASE_URL이 메시지에 끼었을 가능성 차단: postgresql:// 라인은 마스킹
    if (message) {
      message = message
        .replace(/postgres(?:ql)?:\/\/[^\s"']+/gi, 'postgres://***')
        .slice(0, 600);
    }
    db = { ok: false, code, kind, message };
  }

  // 디버깅용: DATABASE_URL의 모양만 (값 노출 X)
  const dbUrl = process.env.DATABASE_URL;
  const dbUrlShape = dbUrl
    ? {
        scheme: dbUrl.split('://')[0] ?? null,
        host: (() => {
          try {
            return new URL(dbUrl).hostname;
          } catch {
            return 'unparseable';
          }
        })(),
        port: (() => {
          try {
            return new URL(dbUrl).port || null;
          } catch {
            return null;
          }
        })(),
        hasPgbouncerParam: /pgbouncer=true/i.test(dbUrl),
        length: dbUrl.length,
      }
    : null;

  res.json({ env, db, dbUrlShape, nodeEnv: process.env.NODE_ENV ?? null });
});
