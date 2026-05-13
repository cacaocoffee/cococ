// ──────────────────────────────────────────────────────────
// 스케줄 API 라우트
// ──────────────────────────────────────────────────────────
//   GET    /api/schedules      → 전체 일정 조회
//   POST   /api/schedules      → 일정 추가
//   PUT    /api/schedules/:id  → 일정 수정
//   DELETE /api/schedules/:id  → 일정 삭제
// ──────────────────────────────────────────────────────────

import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { requireAdmin } from '../middleware/require-admin.js';
import { validate } from '../lib/validate.js';

export const scheduleRouter = Router();

// strict 대신 default(strip) — 모르는 필드는 조용히 drop해서 기존 동작 유지.
const scheduleCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  date: z.string().trim().min(1),
  endDate: z.string().optional().default(''),
  type: z.string().trim().min(1).max(40),
  archiveId: z.coerce.number().int().nullable().optional(),
});

const scheduleUpdateSchema = scheduleCreateSchema.partial();

// 전체 일정 조회 (날짜순)
scheduleRouter.get('/', async (_req, res, next) => {
  try {
    const items = await prisma.schedule.findMany({
      orderBy: { date: 'asc' },
    });
    // archiveId가 null이면 null로, 아니면 숫자로 변환
    res.json(items.map((item: any) => ({
      ...item,
      archiveId: item.archiveId ?? null,
      endDate: item.endDate || undefined,
    })));
  } catch (err) {
    next(err);
  }
});

// 일정 추가
scheduleRouter.post('/', requireAdmin, validate(scheduleCreateSchema), async (req, res, next) => {
  try {
    const body = req.body;
    const item = await prisma.schedule.create({
      data: {
        title: body.title,
        date: body.date,
        endDate: body.endDate ?? '',
        type: body.type,
        archiveId: body.archiveId ?? null,
      },
    });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

// 일정 수정
scheduleRouter.put('/:id', requireAdmin, validate(scheduleUpdateSchema), async (req, res, next) => {
  try {
    const body = req.body;
    const data: any = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.date !== undefined) data.date = body.date;
    if (body.endDate !== undefined) data.endDate = body.endDate;
    if (body.type !== undefined) data.type = body.type;
    if (body.archiveId !== undefined) data.archiveId = body.archiveId;

    const item = await prisma.schedule.update({
      where: { id: Number(req.params.id) },
      data,
    });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// 일정 삭제
scheduleRouter.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    await prisma.schedule.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
