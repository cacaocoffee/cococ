// ──────────────────────────────────────────────────────────
// 회비 계산 (DB를 쓰지 않는 순수 함수)
// ──────────────────────────────────────────────────────────
// 부과액 = 월 회비 × 부과 개월 수 − 면제액
// 미납액 = 부과액 − 그 회원에게 연결된 입금 합계
// 달은 모두 'YYYY-MM' 문자열, 한국 시간 기준이다.
// ──────────────────────────────────────────────────────────

export interface DuesMember {
  id: number;
  name: string;
  status: string;
  joinedMonth: string;
  stoppedMonth: string;
  monthlyFee: number | null;
  waivedAmount: number;
  depositNames: string[];
}

export interface DuesRules {
  monthlyFee: number;
  dueDay: number;
}

export interface Today {
  /** YYYY-MM-DD */
  date: string;
  /** YYYY-MM */
  month: string;
  day: number;
}

export interface Balance {
  fee: number;
  chargedMonths: number;
  charged: number;
  paid: number;
  /** 지금까지 부과된 것 중 안 낸 금액 */
  due: number;
  /** 마감일이 지난 미납액. 이번 달 마감 전이면 이번 달 회비는 빼고 센다. */
  overdue: number;
  /** 부과액보다 더 낸 금액 */
  credit: number;
  /** 미납액이 몇 달 치인지 (올림) */
  unpaidMonths: number;
}

export type MonthState = 'paid' | 'partial' | 'unpaid';

const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

export function isMonth(value: string): boolean {
  return MONTH_RE.test(value);
}

/** 한국 시간 기준 오늘 */
export function todayInSeoul(now: Date = new Date()): Today {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now); // YYYY-MM-DD
  return { date: parts, month: parts.slice(0, 7), day: Number(parts.slice(8, 10)) };
}

/** 한국 시간 기준으로 그 시각이 속한 달 */
export function monthOf(date: Date): string {
  return todayInSeoul(date).month;
}

function monthIndex(month: string): number {
  return Number(month.slice(0, 4)) * 12 + (Number(month.slice(5, 7)) - 1);
}

function monthFromIndex(index: number): string {
  const year = Math.floor(index / 12);
  const month = (index % 12) + 1;
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function addMonths(month: string, delta: number): string {
  return monthFromIndex(monthIndex(month) + delta);
}

/** from부터 to까지 양쪽 달을 포함해 몇 달인지. from이 더 늦으면 0. */
export function monthsInclusive(from: string, to: string): number {
  return Math.max(0, monthIndex(to) - monthIndex(from) + 1);
}

/** 이 회원에게 회비가 부과되는 달의 목록 (오래된 달부터) */
export function chargedMonthList(member: DuesMember, currentMonth: string): string[] {
  if (!isMonth(member.joinedMonth)) return [];
  // stoppedMonth가 있으면 그 전달까지만 부과한다
  const last =
    isMonth(member.stoppedMonth) && monthIndex(member.stoppedMonth) <= monthIndex(currentMonth)
      ? addMonths(member.stoppedMonth, -1)
      : currentMonth;
  const count = monthsInclusive(member.joinedMonth, last);
  return Array.from({ length: count }, (_, i) => addMonths(member.joinedMonth, i));
}

export function feeOf(member: DuesMember, rules: DuesRules): number {
  return member.monthlyFee ?? rules.monthlyFee;
}

export function computeBalance(
  member: DuesMember,
  paid: number,
  rules: DuesRules,
  today: Today,
): Balance {
  const fee = feeOf(member, rules);
  const months = chargedMonthList(member, today.month);
  const charged = Math.max(0, fee * months.length - member.waivedAmount);
  const due = Math.max(0, charged - paid);
  const credit = Math.max(0, paid - charged);

  // 이번 달 회비가 부과됐고 아직 마감일 전이면, 그만큼은 연체로 보지 않는다
  const currentCharged = months.length > 0 && months[months.length - 1] === today.month;
  const notYetLate = currentCharged && today.day <= rules.dueDay ? fee : 0;
  const overdue = Math.max(0, due - notYetLate);

  return {
    fee,
    chargedMonths: months.length,
    charged,
    paid,
    due,
    overdue,
    credit,
    unpaidMonths: fee > 0 ? Math.ceil(due / fee) : 0,
  };
}

/**
 * 낸 돈을 오래된 달부터 채워서 달마다 냈는지 본다.
 * 면제액은 가장 오래된 달부터 먼저 채운 것으로 친다.
 */
export function monthBreakdown(
  member: DuesMember,
  paid: number,
  rules: DuesRules,
  currentMonth: string,
): { month: string; state: MonthState }[] {
  const fee = feeOf(member, rules);
  let remaining = paid + member.waivedAmount;
  return chargedMonthList(member, currentMonth).map((month) => {
    if (fee <= 0 || remaining >= fee) {
      remaining -= fee;
      return { month, state: 'paid' as const };
    }
    if (remaining > 0) {
      remaining = 0;
      return { month, state: 'partial' as const };
    }
    return { month, state: 'unpaid' as const };
  });
}

/** 비교용 이름: 띄어쓰기와 기호를 지운다 */
export function normalizeName(name: string): string {
  return name.replace(/[^0-9A-Za-zㄱ-ㆎ가-힣]/g, '').toLowerCase();
}

/**
 * 입금자명으로 회원을 찾는다. 한 명으로 좁혀지지 않으면 null (사람이 직접 연결한다).
 * 1) 이름이나 등록해 둔 입금자명과 똑같은 회원
 * 2) 없으면, 입금자명 안에 이름이 들어 있는 회원 (`홍길동11월`). 가장 긴 이름을 우선한다.
 */
export function matchDepositor(depositorName: string, members: DuesMember[]): number | null {
  const target = normalizeName(depositorName);
  if (!target) return null;

  const exact = new Set<number>();
  for (const m of members) {
    const names = [m.name, ...m.depositNames].map(normalizeName).filter(Boolean);
    if (names.includes(target)) exact.add(m.id);
  }
  if (exact.size === 1) return [...exact][0];
  if (exact.size > 1) return null;

  let bestLength = 0;
  let best = new Set<number>();
  for (const m of members) {
    for (const raw of [m.name, ...m.depositNames]) {
      const name = normalizeName(raw);
      // 한 글자 이름은 우연히 들어 있을 수 있어 포함 비교에서 뺀다
      if (name.length < 2 || !target.includes(name)) continue;
      if (name.length > bestLength) {
        bestLength = name.length;
        best = new Set([m.id]);
      } else if (name.length === bestLength) {
        best.add(m.id);
      }
    }
  }
  return best.size === 1 ? [...best][0] : null;
}

/** 독촉 시점 이름. -3 → `d-3`, 0 → `d0`, 1 → `d+1` */
export function reminderKind(offset: number): string {
  if (offset === 0) return 'd0';
  return offset < 0 ? `d${offset}` : `d+${offset}`;
}
