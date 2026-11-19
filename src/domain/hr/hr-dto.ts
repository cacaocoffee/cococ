// 회원·회비 API(`/api/hr`)가 주고받는 값의 모양.
// 달은 모두 'YYYY-MM' 문자열, 시각은 ISO 문자열이다.

export type MemberStatus = 'active' | 'paused' | 'left';

export interface HrToday {
  /** YYYY-MM-DD */
  date: string;
  /** YYYY-MM */
  month: string;
  day: number;
}

export interface HrSettings {
  clubName: string;
  monthlyFee: number;
  /** 매달 회비 마감일 (1~28) */
  dueDay: number;
  /** 독촉 문자를 보내는 날. 마감일 기준 일수 (-3 = 마감 3일 전, 0 = 마감일, 1 = 마감 다음 날) */
  reminderOffsets: number[];
  sendStartHour: number;
  sendEndHour: number;
  accountInfo: string;
  noticeClause: string;
}

export interface HrMember {
  id: number;
  name: string;
  phone: string;
  generation: number;
  role: string;
  status: MemberStatus;
  joinedMonth: string;
  /** 이 달부터 회비를 부과하지 않는다. 없으면 빈 문자열 */
  stoppedMonth: string;
  /** 이 회원만 따로 정한 월 회비. 기본값을 쓰면 null */
  monthlyFee: number | null;
  waivedAmount: number;
  depositNames: string[];
  memo: string;
  applicationId: number | null;
  /** 이 회원에게 실제로 적용되는 월 회비 */
  fee: number;
  chargedMonths: number;
  charged: number;
  paid: number;
  /** 지금까지 부과된 것 중 안 낸 금액 */
  due: number;
  /** 마감일이 지난 미납액 */
  overdue: number;
  /** 부과액보다 더 낸 금액 */
  credit: number;
  unpaidMonths: number;
  lastDepositAt: string | null;
  /** 이번 달 회비에 대해 이미 나간 독촉 시점 (`d-3`, `d0`, `d+1`, `manual-…`) */
  remindedKinds: string[];
}

export interface HrDeposit {
  id: number;
  depositedAt: string;
  amount: number;
  depositorName: string;
  source: 'notification' | 'manual' | string;
  rawTitle: string;
  rawBody: string;
  memberId: number | null;
  memberName: string | null;
  /** 'auto' = 입금자명으로 자동 연결, 'manual' = 사람이 연결, '' = 연결 안 됨 */
  matchedBy: string;
  /** 회비 아님으로 표시한 입금 */
  ignored: boolean;
}

export interface HrSummary {
  activeCount: number;
  paidUpCount: number;
  expectedThisMonth: number;
  collectedThisMonth: number;
  totalDue: number;
}

export interface HrOverview {
  today: HrToday;
  settings: HrSettings;
  members: HrMember[];
  unmatched: HrDeposit[];
  recentDeposits: HrDeposit[];
  summary: HrSummary;
  applications: { pending: number; pass1: number; pass2Unregistered: number };
}

export type MonthState = 'paid' | 'partial' | 'unpaid';

export interface HrReminder {
  id: number;
  month: string;
  kind: string;
  body: string;
  testMode: boolean;
  sentAt: string;
}

export interface HrMemberDetail {
  member: HrMember;
  months: { month: string; state: MonthState }[];
  deposits: HrDeposit[];
  reminders: HrReminder[];
}

export interface HrApplication {
  id: number;
  name: string;
  phone: string;
  generation: number;
  status: 'pending' | 'pass1' | 'pass2' | 'fail' | string;
  submittedAt: string;
  /** 이미 회원으로 등록했으면 그 회원의 id */
  memberId: number | null;
}

export interface HrDevice {
  id: number;
  label: string;
  createdAt: string;
  lastUsedAt: string | null;
  current: boolean;
}

export interface MemberCreatePayload {
  name: string;
  phone: string;
  generation: number;
  role: string;
  joinedMonth: string;
  monthlyFee: number | null;
  waivedAmount: number;
  depositNames: string[];
  memo: string;
}

export type MemberPatchPayload = Partial<
  MemberCreatePayload & { status: MemberStatus; stoppedMonth: string }
>;

export interface DepositCreateItem {
  depositedAt: string;
  amount: number;
  depositorName: string;
  source: 'manual';
  dedupeKey: string;
  memberId?: number | null;
}

export interface DepositPatchPayload {
  memberId?: number | null;
  rememberName?: boolean;
  ignored?: boolean;
}
