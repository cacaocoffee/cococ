// ──────────────────────────────────────────────────────────
// 인사(회원·회비) API 라우트
// ──────────────────────────────────────────────────────────
// 어드민 웹의 `회원`·`회비` 탭과 회비 앱(안드로이드)이 함께 쓴다.
// 기기 등록만 빼고 모두 requireHr(어드민 쿠키 또는 기기 토큰)로 보호한다.
//
// 기기:
//   POST   /api/hr/devices                  → 어드민 비밀번호로 앱 기기 등록, 토큰 발급
//   GET    /api/hr/devices                  → 등록된 기기 목록
//   DELETE /api/hr/devices/:id              → 기기 등록 해제 (`me`는 요청한 기기 자신)
//
// 한 번에 내려받기:
//   GET    /api/hr/overview                 → 설정, 회원별 미납 현황, 미연결 입금, 최근 입금, 지원서 건수
//
// 회원:
//   GET    /api/hr/members/:id              → 회원 한 명의 달별 납부, 입금, 독촉 기록
//   POST   /api/hr/members                  → 회원 추가
//   PATCH  /api/hr/members/:id              → 회원 수정
//   DELETE /api/hr/members/:id              → 회원 삭제
//   POST   /api/hr/members/from-applications → 합격한 지원서를 회원으로 등록
//
// 지원서 (앱에서 보는 용도):
//   GET    /api/hr/applications             → 지원서 목록
//   PATCH  /api/hr/applications/:id         → 지원서 상태 변경
//
// 입금:
//   GET    /api/hr/deposits                 → 입금 내역
//   POST   /api/hr/deposits                 → 입금 올리기 (여러 건, 중복은 건너뜀)
//   PATCH  /api/hr/deposits/:id             → 회원 연결 / 연결 해제 / 회비 아님 표시
//   DELETE /api/hr/deposits/:id             → 입금 삭제
//
// 독촉 기록:
//   GET    /api/hr/reminders                → 발송 기록
//   POST   /api/hr/reminders                → 보내기 전에 기록부터 남긴다 (이미 있으면 보내지 않게)
//   DELETE /api/hr/reminders/:id            → 발송에 실패했을 때 기록 취소
//
// 설정:
//   GET    /api/hr/settings
//   PUT    /api/hr/settings
// ──────────────────────────────────────────────────────────

import { Router } from 'express';
import { randomBytes, timingSafeEqual } from 'crypto';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { prisma } from '../prisma.js';
import { validate } from '../lib/validate.js';
import { hashDeviceToken, requireHr } from '../middleware/require-hr.js';
import {
  addMonths,
  computeBalance,
  feeOf,
  isMonth,
  matchDepositor,
  monthBreakdown,
  monthsInclusive,
  todayInSeoul,
  type DuesMember,
  type DuesRules,
  type Today,
} from '../lib/dues.js';

export const hrRouter = Router();

const MEMBER_STATUSES = ['active', 'paused', 'left'] as const;
const APPLICATION_STATUSES = ['pending', 'pass1', 'pass2', 'fail'] as const;

// ── 공통 도우미 ────────────────────────────────────────────

function parseJsonArray<T>(text: string, guard: (v: unknown) => v is T): T[] {
  try {
    const value: unknown = JSON.parse(text);
    return Array.isArray(value) ? value.filter(guard) : [];
  } catch {
    return [];
  }
}

const isString = (v: unknown): v is string => typeof v === 'string';
const isNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

type MemberRow = Awaited<ReturnType<typeof prisma.member.findMany>>[number];
type DepositRow = Awaited<ReturnType<typeof prisma.duesDeposit.findMany>>[number];
type SettingRow = Awaited<ReturnType<typeof loadSettingRow>>;

function toDuesMember(row: MemberRow): DuesMember {
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    joinedMonth: row.joinedMonth,
    stoppedMonth: row.stoppedMonth,
    monthlyFee: row.monthlyFee,
    waivedAmount: row.waivedAmount,
    depositNames: parseJsonArray(row.depositNames, isString),
  };
}

function loadSettingRow() {
  return prisma.hrSetting.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
}

function settingsToResponse(row: SettingRow) {
  return {
    clubName: row.clubName,
    monthlyFee: row.monthlyFee,
    dueDay: row.dueDay,
    reminderOffsets: parseJsonArray(row.reminderOffsets, isNumber),
    sendStartHour: row.sendStartHour,
    sendEndHour: row.sendEndHour,
    accountInfo: row.accountInfo,
    noticeClause: row.noticeClause,
  };
}

function rulesOf(row: SettingRow): DuesRules {
  return { monthlyFee: row.monthlyFee, dueDay: row.dueDay };
}

/** 회원별로 연결된 입금 합계 (회비 아님으로 표시한 입금은 뺀다) */
async function paidByMember(): Promise<Map<number, { paid: number; lastAt: Date | null }>> {
  const groups = await prisma.duesDeposit.groupBy({
    by: ['memberId'],
    where: { memberId: { not: null }, ignored: false },
    _sum: { amount: true },
    _max: { depositedAt: true },
  });
  const map = new Map<number, { paid: number; lastAt: Date | null }>();
  for (const g of groups) {
    if (g.memberId === null) continue;
    map.set(g.memberId, { paid: g._sum.amount ?? 0, lastAt: g._max.depositedAt ?? null });
  }
  return map;
}

function memberToResponse(
  row: MemberRow,
  paid: { paid: number; lastAt: Date | null } | undefined,
  rules: DuesRules,
  today: Today,
  remindedKinds: string[],
) {
  const dues = toDuesMember(row);
  const balance = computeBalance(dues, paid?.paid ?? 0, rules, today);
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    generation: row.generation,
    role: row.role,
    status: row.status,
    joinedMonth: row.joinedMonth,
    stoppedMonth: row.stoppedMonth,
    monthlyFee: row.monthlyFee,
    waivedAmount: row.waivedAmount,
    depositNames: dues.depositNames,
    memo: row.memo,
    applicationId: row.applicationId,
    ...balance,
    lastDepositAt: paid?.lastAt?.toISOString() ?? null,
    // 이번 달 회비에 대해 이미 나간 독촉 시점들
    remindedKinds,
  };
}

function depositToResponse(row: DepositRow, memberName: string | null) {
  return {
    id: row.id,
    depositedAt: row.depositedAt.toISOString(),
    amount: row.amount,
    depositorName: row.depositorName,
    source: row.source,
    rawTitle: row.rawTitle,
    rawBody: row.rawBody,
    memberId: row.memberId,
    memberName,
    matchedBy: row.matchedBy,
    ignored: row.ignored,
  };
}

function idParam(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

/** 입금자명을 맞춰 볼 대상: 탈퇴하지 않은 회원 */
async function matchCandidates(): Promise<DuesMember[]> {
  const rows = await prisma.member.findMany({ where: { status: { not: 'left' } } });
  return rows.map(toDuesMember);
}

// ── 기기 등록 ──────────────────────────────────────────────

// 비밀번호를 받는 라우트라 로그인과 같은 수준으로 시도 횟수를 막는다: IP당 15분에 10회.
const deviceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: '시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.' },
});

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ab.length !== bb.length) {
    timingSafeEqual(ab, ab);
    return false;
  }
  return timingSafeEqual(ab, bb);
}

const deviceCreateSchema = z.object({
  password: z.string().min(1).max(200),
  label: z.string().trim().max(60).optional().default(''),
});

hrRouter.post('/devices', deviceLimiter, validate(deviceCreateSchema), async (req, res, next) => {
  try {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
      console.error('❌ ADMIN_PASSWORD 환경변수가 설정되지 않았습니다');
      res.status(500).json({ error: '서버 설정 오류' });
      return;
    }
    if (!safeEqual(req.body.password, expected)) {
      res.status(401).json({ error: '비밀번호가 올바르지 않습니다' });
      return;
    }
    const token = randomBytes(32).toString('hex');
    const device = await prisma.hrDevice.create({
      data: { label: req.body.label, tokenHash: hashDeviceToken(token), lastUsedAt: new Date() },
    });
    // 토큰은 지금 한 번만 내려간다. DB에는 해시만 남는다.
    res.status(201).json({ id: device.id, token });
  } catch (err) {
    next(err);
  }
});

hrRouter.get('/devices', requireHr, async (_req, res, next) => {
  try {
    const rows = await prisma.hrDevice.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(
      rows.map((d) => ({
        id: d.id,
        label: d.label,
        createdAt: d.createdAt.toISOString(),
        lastUsedAt: d.lastUsedAt?.toISOString() ?? null,
        current: d.id === res.locals.hrDeviceId,
      })),
    );
  } catch (err) {
    next(err);
  }
});

hrRouter.delete('/devices/:id', requireHr, async (req, res, next) => {
  try {
    const id = req.params.id === 'me' ? (res.locals.hrDeviceId as number | undefined) : idParam(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'Invalid id' });
      return;
    }
    await prisma.hrDevice.deleteMany({ where: { id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// ── 한 번에 내려받기 ───────────────────────────────────────

hrRouter.get('/overview', requireHr, async (_req, res, next) => {
  try {
    const today = todayInSeoul();
    const [settingRow, memberRows, paidMap, unmatchedRows, recentRows, reminderRows, appGroups, registered] =
      await Promise.all([
        loadSettingRow(),
        prisma.member.findMany({ orderBy: [{ generation: 'desc' }, { name: 'asc' }] }),
        paidByMember(),
        prisma.duesDeposit.findMany({
          where: { memberId: null, ignored: false },
          orderBy: { depositedAt: 'desc' },
          take: 100,
        }),
        prisma.duesDeposit.findMany({ orderBy: { depositedAt: 'desc' }, take: 30 }),
        prisma.duesReminder.findMany({ where: { month: today.month } }),
        prisma.application.groupBy({ by: ['status'], _count: { _all: true } }),
        prisma.member.findMany({ where: { applicationId: { not: null } }, select: { applicationId: true } }),
      ]);

    const rules = rulesOf(settingRow);
    const kindsByMember = new Map<number, string[]>();
    for (const r of reminderRows) {
      // 테스트 모드 기록은 실제 발송이 아니므로 `이미 보냄`에 넣지 않는다
      if (r.testMode) continue;
      kindsByMember.set(r.memberId, [...(kindsByMember.get(r.memberId) ?? []), r.kind]);
    }

    const members = memberRows.map((row) =>
      memberToResponse(row, paidMap.get(row.id), rules, today, kindsByMember.get(row.id) ?? []),
    );
    const nameById = new Map(memberRows.map((m) => [m.id, m.name]));

    // 이번 달에 들어온 회비 (한국 시간 기준 이번 달 1일 0시부터)
    const monthStart = new Date(`${today.month}-01T00:00:00+09:00`);
    const collected = await prisma.duesDeposit.aggregate({
      where: { depositedAt: { gte: monthStart }, memberId: { not: null }, ignored: false },
      _sum: { amount: true },
    });

    const active = members.filter((m) => m.status === 'active');
    const registeredIds = registered.map((r) => r.applicationId).filter((id): id is number => id !== null);
    const pass2Unregistered = await prisma.application.count({
      where: { status: 'pass2', id: { notIn: registeredIds } },
    });
    const countOf = (status: string) => appGroups.find((g) => g.status === status)?._count._all ?? 0;

    res.json({
      today,
      settings: settingsToResponse(settingRow),
      members,
      unmatched: unmatchedRows.map((d) => depositToResponse(d, null)),
      recentDeposits: recentRows.map((d) =>
        depositToResponse(d, d.memberId ? nameById.get(d.memberId) ?? null : null),
      ),
      summary: {
        activeCount: active.length,
        // 지금까지 부과된 회비를 다 낸 사람 수
        paidUpCount: active.filter((m) => m.due === 0).length,
        // 활동 중인 회원의 이번 달 회비 합계
        expectedThisMonth: active.reduce((sum, m) => sum + m.fee, 0),
        collectedThisMonth: collected._sum.amount ?? 0,
        totalDue: members.reduce((sum, m) => sum + m.due, 0),
      },
      applications: {
        pending: countOf('pending'),
        pass1: countOf('pass1'),
        // 최종 합격했는데 아직 회원으로 등록하지 않은 지원서 수
        pass2Unregistered,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── 회원 ───────────────────────────────────────────────────

const phoneSchema = z
  .string()
  .trim()
  .regex(/^[0-9-]{9,13}$/, 'Invalid phone format')
  .or(z.literal(''));
const monthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'YYYY-MM');

const memberCreateSchema = z.object({
  name: z.string().trim().min(1).max(50),
  phone: phoneSchema.optional().default(''),
  generation: z.coerce.number().int().min(0).max(999).optional().default(0),
  role: z.string().trim().max(30).optional().default(''),
  joinedMonth: monthSchema,
  monthlyFee: z.coerce.number().int().min(0).max(10_000_000).nullable().optional(),
  waivedAmount: z.coerce.number().int().min(0).max(100_000_000).optional().default(0),
  depositNames: z.array(z.string().trim().min(1).max(50)).max(10).optional().default([]),
  memo: z.string().max(500).optional().default(''),
});

const memberPatchSchema = z
  .object({
    name: z.string().trim().min(1).max(50),
    phone: phoneSchema,
    generation: z.coerce.number().int().min(0).max(999),
    role: z.string().trim().max(30),
    status: z.enum(MEMBER_STATUSES),
    joinedMonth: monthSchema,
    // 쉬거나 탈퇴할 때 어느 달부터 부과를 멈출지. 안 보내면 서버가 정한다.
    stoppedMonth: monthSchema.or(z.literal('')),
    monthlyFee: z.coerce.number().int().min(0).max(10_000_000).nullable(),
    waivedAmount: z.coerce.number().int().min(0).max(100_000_000),
    depositNames: z.array(z.string().trim().min(1).max(50)).max(10),
    memo: z.string().max(500),
  })
  .partial();

hrRouter.get('/members/:id', requireHr, async (req, res, next) => {
  try {
    const id = idParam(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'Invalid id' });
      return;
    }
    const row = await prisma.member.findUnique({ where: { id } });
    if (!row) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    const today = todayInSeoul();
    const [settingRow, deposits, reminders] = await Promise.all([
      loadSettingRow(),
      prisma.duesDeposit.findMany({ where: { memberId: id }, orderBy: { depositedAt: 'desc' } }),
      prisma.duesReminder.findMany({ where: { memberId: id }, orderBy: { sentAt: 'desc' }, take: 50 }),
    ]);
    const rules = rulesOf(settingRow);
    const counted = deposits.filter((d) => !d.ignored);
    const paid = counted.reduce((sum, d) => sum + d.amount, 0);
    const lastAt = counted[0]?.depositedAt ?? null;
    const kinds = reminders.filter((r) => r.month === today.month && !r.testMode).map((r) => r.kind);

    res.json({
      member: memberToResponse(row, { paid, lastAt }, rules, today, kinds),
      months: monthBreakdown(toDuesMember(row), paid, rules, today.month),
      deposits: deposits.map((d) => depositToResponse(d, row.name)),
      reminders: reminders.map((r) => ({
        id: r.id,
        month: r.month,
        kind: r.kind,
        body: r.body,
        testMode: r.testMode,
        sentAt: r.sentAt.toISOString(),
      })),
    });
  } catch (err) {
    next(err);
  }
});

/** 새 회원이 생기거나 이름이 바뀌면, 연결 안 된 입금 중 이름이 맞는 것을 다시 연결해 본다 */
async function relinkUnmatched(): Promise<number> {
  const [candidates, unmatched] = await Promise.all([
    matchCandidates(),
    prisma.duesDeposit.findMany({ where: { memberId: null, ignored: false } }),
  ]);
  let linked = 0;
  for (const deposit of unmatched) {
    const memberId = matchDepositor(deposit.depositorName, candidates);
    if (memberId === null) continue;
    await prisma.duesDeposit.update({ where: { id: deposit.id }, data: { memberId, matchedBy: 'auto' } });
    linked += 1;
  }
  return linked;
}

hrRouter.post('/members', requireHr, validate(memberCreateSchema), async (req, res, next) => {
  try {
    const body = req.body;
    const row = await prisma.member.create({
      data: {
        name: body.name,
        phone: body.phone,
        generation: body.generation,
        role: body.role,
        joinedMonth: body.joinedMonth,
        monthlyFee: body.monthlyFee ?? null,
        waivedAmount: body.waivedAmount,
        depositNames: JSON.stringify(body.depositNames),
        memo: body.memo,
      },
    });
    const relinked = await relinkUnmatched();
    res.status(201).json({ id: row.id, relinked });
  } catch (err) {
    next(err);
  }
});

hrRouter.patch('/members/:id', requireHr, validate(memberPatchSchema), async (req, res, next) => {
  try {
    const id = idParam(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'Invalid id' });
      return;
    }
    const before = await prisma.member.findUnique({ where: { id } });
    if (!before) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    const body = req.body;
    const today = todayInSeoul();
    const data: Record<string, unknown> = {};

    for (const key of ['name', 'phone', 'generation', 'role', 'joinedMonth', 'waivedAmount', 'memo'] as const) {
      if (body[key] !== undefined) data[key] = body[key];
    }
    if (body.monthlyFee !== undefined) data.monthlyFee = body.monthlyFee;
    if (body.depositNames !== undefined) data.depositNames = JSON.stringify(body.depositNames);
    if (body.stoppedMonth !== undefined) data.stoppedMonth = body.stoppedMonth;

    if (body.status !== undefined && body.status !== before.status) {
      data.status = body.status;
      const wasActive = before.status === 'active';
      const becomesActive = body.status === 'active';

      if (wasActive && !becomesActive && body.stoppedMonth === undefined) {
        // 쉬거나 탈퇴: 따로 정하지 않으면 다음 달부터 부과를 멈춘다 (이번 달 회비는 그대로 둔다)
        data.stoppedMonth = addMonths(today.month, 1);
      }
      if (!wasActive && becomesActive) {
        // 다시 활동: 쉰 달의 회비는 면제액으로 넘기고, 이번 달부터 다시 부과한다
        if (isMonth(before.stoppedMonth)) {
          const settingRow = await loadSettingRow();
          const skipped = monthsInclusive(before.stoppedMonth, addMonths(today.month, -1));
          const fee = feeOf(toDuesMember(before), rulesOf(settingRow));
          if (skipped > 0) {
            const base = typeof data.waivedAmount === 'number' ? data.waivedAmount : before.waivedAmount;
            data.waivedAmount = base + fee * skipped;
            const note = `${before.stoppedMonth}~${addMonths(today.month, -1)} 쉼 (${skipped}개월 회비 면제)`;
            const memo = typeof data.memo === 'string' ? data.memo : before.memo;
            data.memo = memo ? `${memo}\n${note}` : note;
          }
        }
        data.stoppedMonth = '';
      }
    }

    await prisma.member.update({ where: { id }, data });
    // 이름이나 입금자명이 바뀌었으면 연결 안 된 입금을 다시 맞춰 본다
    const relinked = body.name !== undefined || body.depositNames !== undefined || body.status !== undefined
      ? await relinkUnmatched()
      : 0;
    res.json({ id, relinked });
  } catch (err) {
    next(err);
  }
});

hrRouter.delete('/members/:id', requireHr, async (req, res, next) => {
  try {
    const id = idParam(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'Invalid id' });
      return;
    }
    // 연결돼 있던 입금은 지워지지 않고 `연결 안 됨`으로 돌아간다 (스키마의 onDelete: SetNull)
    await prisma.$transaction([
      prisma.duesDeposit.updateMany({ where: { memberId: id }, data: { matchedBy: '' } }),
      prisma.member.deleteMany({ where: { id } }),
    ]);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

const fromApplicationsSchema = z.object({
  applicationIds: z.array(z.coerce.number().int().positive()).min(1).max(200),
  joinedMonth: monthSchema,
});

hrRouter.post('/members/from-applications', requireHr, validate(fromApplicationsSchema), async (req, res, next) => {
  try {
    const { applicationIds, joinedMonth } = req.body as z.infer<typeof fromApplicationsSchema>;
    const [apps, existing] = await Promise.all([
      prisma.application.findMany({ where: { id: { in: applicationIds } } }),
      prisma.member.findMany({ where: { applicationId: { in: applicationIds } }, select: { applicationId: true } }),
    ]);
    const already = new Set(existing.map((m) => m.applicationId));
    const created: number[] = [];
    const skipped: number[] = [];
    for (const app of apps) {
      if (already.has(app.id)) {
        skipped.push(app.id);
        continue;
      }
      const row = await prisma.member.create({
        data: {
          name: app.name,
          phone: app.phone,
          generation: app.generation,
          joinedMonth,
          applicationId: app.id,
        },
      });
      created.push(row.id);
    }
    const relinked = created.length > 0 ? await relinkUnmatched() : 0;
    res.status(201).json({ created: created.length, skipped: skipped.length, relinked });
  } catch (err) {
    next(err);
  }
});

// ── 지원서 (앱에서 보는 용도) ──────────────────────────────

hrRouter.get('/applications', requireHr, async (_req, res, next) => {
  try {
    const [items, members] = await Promise.all([
      prisma.application.findMany({ orderBy: { submittedAt: 'desc' } }),
      prisma.member.findMany({ where: { applicationId: { not: null } }, select: { id: true, applicationId: true } }),
    ]);
    const memberByApp = new Map(members.map((m) => [m.applicationId, m.id]));
    res.json(
      items.map((item) => ({
        ...item,
        submittedAt: item.submittedAt.toISOString(),
        availableTimes: parseJsonArray(item.availableTimes, isString),
        interviewTimes: parseJsonArray(item.interviewTimes, isString),
        // 이미 회원으로 등록했으면 그 회원의 id
        memberId: memberByApp.get(item.id) ?? null,
      })),
    );
  } catch (err) {
    next(err);
  }
});

const applicationStatusSchema = z.object({ status: z.enum(APPLICATION_STATUSES) });

hrRouter.patch('/applications/:id', requireHr, validate(applicationStatusSchema), async (req, res, next) => {
  try {
    const id = idParam(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'Invalid id' });
      return;
    }
    const result = await prisma.application.updateMany({ where: { id }, data: { status: req.body.status } });
    if (result.count === 0) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json({ id, status: req.body.status });
  } catch (err) {
    next(err);
  }
});

// ── 입금 ───────────────────────────────────────────────────

const depositItemSchema = z.object({
  depositedAt: z.coerce.date(),
  amount: z.coerce.number().int().positive().max(100_000_000),
  depositorName: z.string().trim().max(60),
  source: z.enum(['notification', 'manual']).optional().default('notification'),
  rawTitle: z.string().max(500).optional().default(''),
  rawBody: z.string().max(2000).optional().default(''),
  dedupeKey: z.string().trim().min(1).max(200),
  // 직접 입력할 때 회원을 바로 정해 줄 수 있다
  memberId: z.coerce.number().int().positive().nullable().optional(),
});

const depositsCreateSchema = z.object({ items: z.array(depositItemSchema).min(1).max(100) });

hrRouter.post('/deposits', requireHr, validate(depositsCreateSchema), async (req, res, next) => {
  try {
    const { items } = req.body as z.infer<typeof depositsCreateSchema>;
    const candidates = await matchCandidates();
    const names = new Map(candidates.map((m) => [m.id, m.name]));
    const results: unknown[] = [];

    for (const item of items) {
      const existing = await prisma.duesDeposit.findUnique({ where: { dedupeKey: item.dedupeKey } });
      if (existing) {
        results.push({
          dedupeKey: item.dedupeKey,
          id: existing.id,
          duplicate: true,
          memberId: existing.memberId,
          memberName: existing.memberId ? names.get(existing.memberId) ?? null : null,
        });
        continue;
      }
      const chosen = item.memberId ?? null;
      const memberId = chosen ?? matchDepositor(item.depositorName, candidates);
      const row = await prisma.duesDeposit.create({
        data: {
          depositedAt: item.depositedAt,
          amount: item.amount,
          depositorName: item.depositorName,
          source: item.source,
          rawTitle: item.rawTitle,
          rawBody: item.rawBody,
          dedupeKey: item.dedupeKey,
          memberId,
          matchedBy: memberId === null ? '' : chosen ? 'manual' : 'auto',
        },
      });
      results.push({
        dedupeKey: item.dedupeKey,
        id: row.id,
        duplicate: false,
        memberId,
        memberName: memberId ? names.get(memberId) ?? null : null,
      });
    }
    res.status(201).json({ results });
  } catch (err) {
    next(err);
  }
});

hrRouter.get('/deposits', requireHr, async (req, res, next) => {
  try {
    const limit = Math.min(500, Math.max(1, Number(req.query.limit) || 200));
    const month = typeof req.query.month === 'string' && isMonth(req.query.month) ? req.query.month : null;
    const where = month
      ? {
          depositedAt: {
            gte: new Date(`${month}-01T00:00:00+09:00`),
            lt: new Date(`${addMonths(month, 1)}-01T00:00:00+09:00`),
          },
        }
      : {};
    const [rows, members] = await Promise.all([
      prisma.duesDeposit.findMany({ where, orderBy: { depositedAt: 'desc' }, take: limit }),
      prisma.member.findMany({ select: { id: true, name: true } }),
    ]);
    const nameById = new Map(members.map((m) => [m.id, m.name]));
    res.json(rows.map((d) => depositToResponse(d, d.memberId ? nameById.get(d.memberId) ?? null : null)));
  } catch (err) {
    next(err);
  }
});

const depositPatchSchema = z
  .object({
    memberId: z.coerce.number().int().positive().nullable(),
    // 연결하면서 이 입금자명을 회원에게 기억시켜, 다음부터 자동으로 연결되게 한다
    rememberName: z.boolean(),
    ignored: z.boolean(),
  })
  .partial();

hrRouter.patch('/deposits/:id', requireHr, validate(depositPatchSchema), async (req, res, next) => {
  try {
    const id = idParam(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'Invalid id' });
      return;
    }
    const deposit = await prisma.duesDeposit.findUnique({ where: { id } });
    if (!deposit) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    const body = req.body as z.infer<typeof depositPatchSchema>;
    const data: Record<string, unknown> = {};
    let relinked = 0;

    if (body.ignored !== undefined) data.ignored = body.ignored;

    if (body.memberId !== undefined) {
      if (body.memberId === null) {
        data.memberId = null;
        data.matchedBy = '';
      } else {
        const member = await prisma.member.findUnique({ where: { id: body.memberId } });
        if (!member) {
          res.status(400).json({ error: '없는 회원입니다' });
          return;
        }
        data.memberId = member.id;
        data.matchedBy = 'manual';
        data.ignored = false;

        if (body.rememberName && deposit.depositorName.trim()) {
          const names = parseJsonArray(member.depositNames, isString);
          if (!names.includes(deposit.depositorName) && names.length < 10) {
            await prisma.member.update({
              where: { id: member.id },
              data: { depositNames: JSON.stringify([...names, deposit.depositorName]) },
            });
          }
        }
      }
    }

    await prisma.duesDeposit.update({ where: { id }, data });
    // 입금자명을 기억시켰으면, 같은 이름으로 들어온 다른 미연결 입금도 함께 연결한다
    if (body.rememberName && body.memberId) relinked = await relinkUnmatched();
    res.json({ id, relinked });
  } catch (err) {
    next(err);
  }
});

hrRouter.delete('/deposits/:id', requireHr, async (req, res, next) => {
  try {
    const id = idParam(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'Invalid id' });
      return;
    }
    await prisma.duesDeposit.deleteMany({ where: { id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// ── 독촉 기록 ──────────────────────────────────────────────

const reminderItemSchema = z.object({
  memberId: z.coerce.number().int().positive(),
  month: monthSchema,
  kind: z.string().trim().min(1).max(40),
  body: z.string().max(1000).optional().default(''),
  testMode: z.boolean().optional().default(false),
});

const remindersCreateSchema = z.object({ items: z.array(reminderItemSchema).min(1).max(200) });

// 앱은 문자를 보내기 전에 여기에 기록부터 남긴다.
// accepted: true 인 것만 실제로 보낸다. 이미 기록이 있으면 false가 와서 같은 독촉이 두 번 나가지 않는다.
hrRouter.post('/reminders', requireHr, validate(remindersCreateSchema), async (req, res, next) => {
  try {
    const { items } = req.body as z.infer<typeof remindersCreateSchema>;
    const results: unknown[] = [];
    for (const item of items) {
      const key = { memberId: item.memberId, month: item.month, kind: item.kind };
      const existing = await prisma.duesReminder.findUnique({ where: { memberId_month_kind: key } });
      if (!existing) {
        const member = await prisma.member.findUnique({ where: { id: item.memberId }, select: { id: true } });
        if (!member) {
          results.push({ ...key, accepted: false, reason: 'no-member' });
          continue;
        }
        const row = await prisma.duesReminder.create({
          data: { ...key, body: item.body, testMode: item.testMode },
        });
        results.push({ ...key, id: row.id, accepted: true });
        continue;
      }
      // 테스트 모드로 남긴 기록은 실제 발송을 막지 않는다
      if (existing.testMode && !item.testMode) {
        await prisma.duesReminder.update({
          where: { id: existing.id },
          data: { testMode: false, body: item.body, sentAt: new Date() },
        });
        results.push({ ...key, id: existing.id, accepted: true });
        continue;
      }
      results.push({ ...key, id: existing.id, accepted: false, reason: 'already-sent' });
    }
    res.status(201).json({ results });
  } catch (err) {
    next(err);
  }
});

hrRouter.get('/reminders', requireHr, async (req, res, next) => {
  try {
    const month = typeof req.query.month === 'string' && isMonth(req.query.month) ? req.query.month : null;
    const rows = await prisma.duesReminder.findMany({
      where: month ? { month } : {},
      orderBy: { sentAt: 'desc' },
      take: 300,
      include: { member: { select: { name: true } } },
    });
    res.json(
      rows.map((r) => ({
        id: r.id,
        memberId: r.memberId,
        memberName: r.member.name,
        month: r.month,
        kind: r.kind,
        body: r.body,
        testMode: r.testMode,
        sentAt: r.sentAt.toISOString(),
      })),
    );
  } catch (err) {
    next(err);
  }
});

hrRouter.delete('/reminders/:id', requireHr, async (req, res, next) => {
  try {
    const id = idParam(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'Invalid id' });
      return;
    }
    await prisma.duesReminder.deleteMany({ where: { id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// ── 설정 ───────────────────────────────────────────────────

const settingsSchema = z
  .object({
    clubName: z.string().trim().min(1).max(40),
    monthlyFee: z.coerce.number().int().min(0).max(10_000_000),
    dueDay: z.coerce.number().int().min(1).max(28),
    reminderOffsets: z.array(z.coerce.number().int().min(-14).max(14)).max(6),
    sendStartHour: z.coerce.number().int().min(0).max(23),
    sendEndHour: z.coerce.number().int().min(1).max(24),
    accountInfo: z.string().max(200),
    noticeClause: z.string().max(1000),
  })
  .partial();

hrRouter.get('/settings', requireHr, async (_req, res, next) => {
  try {
    res.json(settingsToResponse(await loadSettingRow()));
  } catch (err) {
    next(err);
  }
});

hrRouter.put('/settings', requireHr, validate(settingsSchema), async (req, res, next) => {
  try {
    const body = req.body as z.infer<typeof settingsSchema>;
    const current = await loadSettingRow();
    const start = body.sendStartHour ?? current.sendStartHour;
    const end = body.sendEndHour ?? current.sendEndHour;
    if (start >= end) {
      res.status(400).json({ error: '발송 시작 시각이 종료 시각보다 빨라야 합니다' });
      return;
    }
    const data: Record<string, unknown> = {};
    for (const key of ['clubName', 'monthlyFee', 'dueDay', 'sendStartHour', 'sendEndHour', 'accountInfo', 'noticeClause'] as const) {
      if (body[key] !== undefined) data[key] = body[key];
    }
    if (body.reminderOffsets !== undefined) {
      const unique = [...new Set(body.reminderOffsets)].sort((a, b) => a - b);
      data.reminderOffsets = JSON.stringify(unique);
    }
    const row = await prisma.hrSetting.update({ where: { id: 1 }, data });
    res.json(settingsToResponse(row));
  } catch (err) {
    next(err);
  }
});
