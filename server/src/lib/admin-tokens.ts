// 어드민 토큰 인메모리 저장소
// 단일 서버 + SQLite 가정. JWT 미사용. 12시간 TTL의 랜덤 토큰을 발급/검증한다.
// 서버 재시작 시 모든 토큰이 사라지므로 운영자는 다시 로그인해야 한다.

const TTL_MS = 12 * 60 * 60 * 1000;

const store = new Map<string, number>();

export function issue(token: string): number {
  const expiresAt = Date.now() + TTL_MS;
  store.set(token, expiresAt);
  return expiresAt;
}

export function revoke(token: string): void {
  store.delete(token);
}

export function isValid(token: string): boolean {
  const expiresAt = store.get(token);
  if (expiresAt === undefined) return false;
  if (expiresAt <= Date.now()) {
    store.delete(token);
    return false;
  }
  return true;
}
