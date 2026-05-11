// 어드민 토큰 저장소 (Postgres / Prisma).
// 서버리스 환경에서는 인스턴스 간 메모리가 공유되지 않으므로 DB에 영속화한다.
// TTL 12시간. 만료된 토큰은 검증 시점에 정리한다.

import { prisma } from '../prisma.js';

const TTL_MS = 12 * 60 * 60 * 1000;

export async function issue(token: string): Promise<number> {
  const expiresAt = new Date(Date.now() + TTL_MS);
  await prisma.adminToken.create({ data: { token, expiresAt } });
  return expiresAt.getTime();
}

export async function revoke(token: string): Promise<void> {
  await prisma.adminToken.deleteMany({ where: { token } });
}

export async function isValid(token: string): Promise<boolean> {
  const row = await prisma.adminToken.findUnique({ where: { token } });
  if (!row) return false;
  if (row.expiresAt.getTime() <= Date.now()) {
    await prisma.adminToken.deleteMany({ where: { token } });
    return false;
  }
  return true;
}
