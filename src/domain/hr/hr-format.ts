// 회원·회비 화면에서 금액, 달, 시각, 독촉 시점을 사람이 읽는 글로 바꾸는 함수들.

import type { HrMember, MemberStatus } from './hr-dto';

/** 40000 → `40,000원` */
export function formatWon(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

/** '2026-11' → `2026년 11월` */
export function formatMonth(month: string): string {
  if (!/^\d{4}-\d{2}$/.test(month)) return month;
  return `${month.slice(0, 4)}년 ${Number(month.slice(5, 7))}월`;
}

/** '2026-11' → `11월` */
export function formatMonthShort(month: string): string {
  if (!/^\d{4}-\d{2}$/.test(month)) return month;
  return `${Number(month.slice(5, 7))}월`;
}

export function addMonths(month: string, delta: number): string {
  const index = Number(month.slice(0, 4)) * 12 + (Number(month.slice(5, 7)) - 1) + delta;
  return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, '0')}`;
}

const seoulParts = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

function partsInSeoul(iso: string): Record<string, string> | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const out: Record<string, string> = {};
  for (const p of seoulParts.formatToParts(date)) out[p.type] = p.value;
  return out;
}

/** 한국 시간 기준 `11월 8일` */
export function formatDay(iso: string): string {
  const p = partsInSeoul(iso);
  return p ? `${Number(p.month)}월 ${Number(p.day)}일` : '';
}

/** 한국 시간 기준 `11월 8일 17:12` */
export function formatDayTime(iso: string): string {
  const p = partsInSeoul(iso);
  return p ? `${Number(p.month)}월 ${Number(p.day)}일 ${p.hour}:${p.minute}` : '';
}

/** 한국 시간 기준 `2026-11-08 17:12` (CSV에 쓴다) */
export function formatStamp(iso: string): string {
  const p = partsInSeoul(iso);
  return p ? `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}` : '';
}

/** 마감일 기준 일수 → `마감 3일 전` · `마감일` · `마감 다음 날` · `마감 2일 뒤` */
export function offsetLabel(offset: number): string {
  if (offset === 0) return '마감일';
  if (offset === 1) return '마감 다음 날';
  return offset < 0 ? `마감 ${-offset}일 전` : `마감 ${offset}일 뒤`;
}

/** 독촉 기록의 시점 값(`d-3`, `d0`, `d+1`, `manual-…`) → 사람이 읽는 글 */
export function reminderKindLabel(kind: string): string {
  if (kind.startsWith('manual')) return '직접 보냄';
  const matched = /^d([+-]?\d+)$/.exec(kind);
  if (!matched) return kind;
  return offsetLabel(Number(matched[1]));
}

export const STATUS_LABEL: Record<MemberStatus, string> = {
  active: '활동',
  paused: '쉼',
  left: '탈퇴',
};

/** 숫자만 남긴다. 금액 입력칸에 쓴다. */
export function digitsOnly(text: string): string {
  return text.replace(/[^0-9]/g, '');
}

/** 금액 입력칸에 보여 줄 글: '40000' → '40,000' */
export function withCommas(digits: string): string {
  return digits === '' ? '' : Number(digits).toLocaleString('ko-KR');
}

/** 전화번호를 치는 동안 `010-1234-5678` 모양으로 맞춘다 */
export function formatPhoneInput(text: string): string {
  const d = digitsOnly(text).slice(0, 11);
  if (!d.startsWith('01')) return text.replace(/[^0-9-]/g, '').slice(0, 13);
  if (d.length <= 3) return d;
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length <= 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

/** 서버가 받는 전화번호 형식인지 (비어 있어도 된다) */
export function isValidPhone(phone: string): boolean {
  return phone === '' || /^[0-9-]{9,13}$/.test(phone);
}

/** 이름 비교용: 띄어쓰기와 기호를 지우고 소문자로 바꾼다 (서버의 자동 연결과 같은 방식) */
export function normalizeName(name: string): string {
  return name.replace(/[^0-9A-Za-zㄱ-ㆎ가-힣]/g, '').toLowerCase();
}

/** 두 글에 똑같이 들어 있는 가장 긴 부분의 글자 수 */
function longestCommonPart(a: string, b: string): number {
  let best = 0;
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      let k = 0;
      while (i + k < a.length && j + k < b.length && a[i + k] === b[j + k]) k++;
      if (k > best) best = k;
    }
  }
  return best;
}

/**
 * 입금자명과 이름이 두 글자 이상 겹치는 회원 가운데 가장 많이 겹치는 회원을 고른다.
 * `은호맘` → `예시은호`처럼 자동 연결은 못 했지만 사람이 보면 알 만한 경우를 먼저 보여 주려는 것이다.
 * 여럿이면 미납이 많은 회원을 앞에 둔다.
 */
export function suggestMembers(depositorName: string, members: HrMember[], limit = 3): HrMember[] {
  const target = normalizeName(depositorName);
  if (target.length < 2) return [];
  const scored = members
    .filter((m) => m.status !== 'left')
    .map((m) => {
      const score = Math.max(
        ...[m.name, ...m.depositNames].map((n) => longestCommonPart(target, normalizeName(n))),
      );
      return { m, score };
    })
    .filter((x) => x.score >= 2);
  // 가장 많이 겹치는 회원만 남긴다. 덜 겹치는 회원까지 보이면 고를 때 헷갈린다.
  const best = Math.max(0, ...scored.map((x) => x.score));
  return scored
    .filter((x) => x.score === best)
    .sort((a, b) => b.m.due - a.m.due)
    .slice(0, limit)
    .map((x) => x.m);
}

/** 서버가 준 오류 본문(`{"error":"…"}`)에서 사람이 읽을 문장을 꺼낸다 */
export function errorMessage(err: unknown, fallback = '잠시 후 다시 시도해 주세요.'): string {
  if (!(err instanceof Error)) return fallback;
  try {
    const parsed: unknown = JSON.parse(err.message);
    if (parsed && typeof parsed === 'object' && 'error' in parsed) {
      const text = (parsed as { error: unknown }).error;
      if (typeof text === 'string' && text !== 'Invalid input') return text;
      if (text === 'Invalid input') return '입력한 값을 다시 확인해 주세요.';
    }
  } catch {
    // JSON이 아니면 아래에서 처리한다
  }
  if (err.message === 'Failed to fetch') return '서버에 연결하지 못했어요. 인터넷 연결을 확인해 주세요.';
  return fallback;
}
