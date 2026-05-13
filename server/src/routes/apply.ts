// ──────────────────────────────────────────────────────────
// 지원서 API 라우트
// ──────────────────────────────────────────────────────────
// 지원서(Application), 면접 설정(InterviewSettings),
// 지원 기간(ApplyPeriod)을 관리하는 API입니다.
//
// 지원서 CRUD:
//   GET    /api/apply/applications          → 전체 지원서 목록
//   POST   /api/apply/applications          → 새 지원서 제출
//   PATCH  /api/apply/applications/:id      → 지원서 상태/필드 수정
//   DELETE /api/apply/applications/:id      → 지원서 삭제
//
// 면접 설정:
//   GET    /api/apply/interview-settings    → 면접 설정 조회
//   PUT    /api/apply/interview-settings    → 면접 설정 저장
//
// 지원 기간:
//   GET    /api/apply/period                → 지원 기간 조회
//   PUT    /api/apply/period                → 지원 기간 설정
//   GET    /api/apply/is-open               → 지원 가능 여부 확인
// ──────────────────────────────────────────────────────────

import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { prisma } from '../prisma.js';
import { requireAdmin } from '../middleware/require-admin.js';
import { validate } from '../lib/validate.js';

export const applyRouter = Router();

// 공개 지원서 제출 스팸/봇 방어: IP당 1시간 5건.
const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' },
});

// 어드민이 수정 가능한 필드만 화이트리스트. 다른 필드는 자동 drop.
const applicationPatchSchema = z
  .object({
    status: z.string().trim().min(1).max(40),
    name: z.string().trim().min(1).max(50),
    gender: z.string().trim().min(1),
    birthdate: z.string().trim().min(1),
    phone: z.string().trim().regex(/^[0-9-]{9,13}$/),
    email: z.string().trim().email(),
    sns: z.string(),
    availableTimes: z.array(z.string()),
    interviewTimes: z.array(z.string()),
  })
  .partial()
  .strict();

const interviewSettingsSchema = z
  .object({
    mtDate: z.string(),
    interviewDates: z.array(z.string()),
    interviewTimes: z.array(z.string()),
  })
  .partial()
  .strict();

const applyPeriodSchema = z
  .object({
    start: z.string(),
    end: z.string(),
    forceClosed: z.boolean(),
    generation: z.coerce.number().int().min(1),
  })
  .partial()
  .strict();

// 새 지원서 제출 시 검증 스키마 (공개 라우트이므로 입력을 신뢰할 수 없다)
const applicationSchema = z.object({
  name: z.string().trim().min(1).max(50),
  gender: z.string().trim().min(1),
  birthdate: z.string().trim().min(1),
  phone: z.string().trim().regex(/^[0-9-]{9,13}$/, 'Invalid phone format'),
  email: z.string().trim().email(),
  sns: z.string().optional().default(''),
  mtAvailable: z.string().optional().default(''),
  mainContact: z.string().optional().default(''),
  availableTimes: z.array(z.string()).optional().default([]),
  interviewTimes: z.array(z.string()).optional().default([]),
  scaleGourmet: z.coerce.number().int().min(1).max(5),
  scalePeople: z.coerce.number().int().min(1).max(5),
  q3_1_style: z.string().optional().default(''),
  q1_intro: z.string().optional().default(''),
  q2_drink: z.string().optional().default(''),
  q3_2_reason: z.string().optional().default(''),
  qEtc: z.string().optional().default(''),
});

// DB 레코드 → 프론트엔드 형식 변환
function appToResponse(item: any) {
  return {
    ...item,
    id: String(item.id), // 프론트엔드에서 id를 string으로 사용
    submittedAt: item.submittedAt.toISOString(),
    availableTimes: JSON.parse(item.availableTimes),
    interviewTimes: JSON.parse(item.interviewTimes),
  };
}

// ── 지원서 CRUD ────────────────────────────────────────────

// 전체 지원서 목록 (최신순) — 어드민 전용 (PII 포함)
applyRouter.get('/applications', requireAdmin, async (_req, res, next) => {
  try {
    const items = await prisma.application.findMany({
      orderBy: { submittedAt: 'desc' },
    });
    res.json(items.map(appToResponse));
  } catch (err) {
    next(err);
  }
});

// 새 지원서 제출 (공개) — IP 레이트리미트 적용
applyRouter.post('/applications', submitLimiter, validate(applicationSchema), async (req, res, next) => {
  try {
    const body = req.body;
    // 현재 모집 중인 기수를 서버가 직접 주입 (클라이언트 위변조 방지)
    const period = await prisma.applyPeriod.findUnique({ where: { id: 1 } });
    const generation = period?.generation ?? 0;
    const item = await prisma.application.create({
      data: {
        generation,
        name: body.name,
        gender: body.gender,
        birthdate: body.birthdate,
        phone: body.phone,
        email: body.email,
        sns: body.sns ?? '',
        mtAvailable: body.mtAvailable ?? '',
        mainContact: body.mainContact ?? '',
        availableTimes: JSON.stringify(body.availableTimes ?? []),
        interviewTimes: JSON.stringify(body.interviewTimes ?? []),
        scaleGourmet: Number(body.scaleGourmet) || 0,
        scalePeople: Number(body.scalePeople) || 0,
        q3_1_style: body.q3_1_style ?? '',
        q1_intro: body.q1_intro ?? '',
        q2_drink: body.q2_drink ?? '',
        q3_2_reason: body.q3_2_reason ?? '',
        qEtc: body.qEtc ?? '',
      },
    });
    res.status(201).json(appToResponse(item));
  } catch (err) {
    next(err);
  }
});

// 지원서 수정 (상태 변경 등)
// PATCH는 "일부 필드만 수정"할 때 사용하는 HTTP 메서드입니다.
applyRouter.patch('/applications/:id', requireAdmin, validate(applicationPatchSchema), async (req, res, next) => {
  try {
    const body = req.body;
    const data: any = {};

    // 보내진 필드만 업데이트
    if (body.status !== undefined) data.status = body.status;
    if (body.name !== undefined) data.name = body.name;
    if (body.gender !== undefined) data.gender = body.gender;
    if (body.birthdate !== undefined) data.birthdate = body.birthdate;
    if (body.phone !== undefined) data.phone = body.phone;
    if (body.email !== undefined) data.email = body.email;
    if (body.sns !== undefined) data.sns = body.sns;
    if (body.availableTimes !== undefined) data.availableTimes = JSON.stringify(body.availableTimes);
    if (body.interviewTimes !== undefined) data.interviewTimes = JSON.stringify(body.interviewTimes);

    const item = await prisma.application.update({
      where: { id: Number(req.params.id) },
      data,
    });
    res.json(appToResponse(item));
  } catch (err) {
    next(err);
  }
});

// 지원서 삭제
applyRouter.delete('/applications/:id', requireAdmin, async (req, res, next) => {
  try {
    await prisma.application.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// ── 면접 설정 ──────────────────────────────────────────────

// 면접 설정 조회
applyRouter.get('/interview-settings', async (_req, res, next) => {
  try {
    // upsert: 있으면 가져오고, 없으면 기본값으로 생성합니다.
    const settings = await prisma.interviewSetting.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        mtDate: '추후 공지 예정',
        interviewDates: JSON.stringify(['3/22(토)', '3/23(일)']),
        interviewTimes: JSON.stringify([
          '10:00-10:30', '10:30-11:00', '11:00-11:30', '11:30-12:00',
          '13:00-13:30', '13:30-14:00', '14:00-14:30', '14:30-15:00',
        ]),
      },
    });

    res.json({
      mtDate: settings.mtDate,
      interviewDates: JSON.parse(settings.interviewDates),
      interviewTimes: JSON.parse(settings.interviewTimes),
    });
  } catch (err) {
    next(err);
  }
});

// 면접 설정 저장
applyRouter.put('/interview-settings', requireAdmin, validate(interviewSettingsSchema), async (req, res, next) => {
  try {
    const body = req.body;
    const settings = await prisma.interviewSetting.upsert({
      where: { id: 1 },
      update: {
        mtDate: body.mtDate ?? '',
        interviewDates: JSON.stringify(body.interviewDates ?? []),
        interviewTimes: JSON.stringify(body.interviewTimes ?? []),
      },
      create: {
        id: 1,
        mtDate: body.mtDate ?? '',
        interviewDates: JSON.stringify(body.interviewDates ?? []),
        interviewTimes: JSON.stringify(body.interviewTimes ?? []),
      },
    });

    res.json({
      mtDate: settings.mtDate,
      interviewDates: JSON.parse(settings.interviewDates),
      interviewTimes: JSON.parse(settings.interviewTimes),
    });
  } catch (err) {
    next(err);
  }
});

// ── 지원 기간 설정 ────────────────────────────────────────

// 지원 기간 조회
applyRouter.get('/period', async (_req, res, next) => {
  try {
    const period = await prisma.applyPeriod.findUnique({ where: { id: 1 } });
    if (!period) {
      res.json(null);
      return;
    }
    res.json({
      start: period.start,
      end: period.end,
      forceClosed: period.forceClosed,
      generation: period.generation,
    });
  } catch (err) {
    next(err);
  }
});

// 지원 기간 저장
applyRouter.put('/period', requireAdmin, validate(applyPeriodSchema), async (req, res, next) => {
  try {
    const body = req.body;
    const generation = Math.max(1, Math.floor(Number(body.generation) || 1));
    const period = await prisma.applyPeriod.upsert({
      where: { id: 1 },
      update: {
        start: body.start ?? '',
        end: body.end ?? '',
        forceClosed: body.forceClosed ?? false,
        generation,
      },
      create: {
        id: 1,
        start: body.start ?? '',
        end: body.end ?? '',
        forceClosed: body.forceClosed ?? false,
        generation,
      },
    });
    res.json({
      start: period.start,
      end: period.end,
      forceClosed: period.forceClosed,
      generation: period.generation,
    });
  } catch (err) {
    next(err);
  }
});

// 지원 가능 여부 확인
applyRouter.get('/is-open', async (_req, res, next) => {
  try {
    const period = await prisma.applyPeriod.findUnique({ where: { id: 1 } });
    if (!period || !period.start || !period.end) {
      res.json({ open: true });
      return;
    }
    if (period.forceClosed) {
      res.json({ open: false });
      return;
    }
    const now = new Date();
    const open = now >= new Date(period.start) && now <= new Date(period.end);
    res.json({ open });
  } catch (err) {
    next(err);
  }
});
