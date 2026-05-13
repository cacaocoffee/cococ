// ──────────────────────────────────────────────────────────
// 매거진 API 라우트
// ──────────────────────────────────────────────────────────
// 아카이브 라우트와 구조가 거의 동일합니다.
// CRUD(Create, Read, Update, Delete)를 동일한 패턴으로 구현합니다.
//
//   GET    /api/magazines      → 전체 목록
//   GET    /api/magazines/:id  → 1개 조회
//   POST   /api/magazines      → 생성
//   PUT    /api/magazines/:id  → 수정
//   DELETE /api/magazines/:id  → 삭제
// ──────────────────────────────────────────────────────────

import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { requireAdmin } from '../middleware/require-admin.js';
import { validate } from '../lib/validate.js';

export const magazineRouter = Router();

const magazineFields = z.object({
  title: z.string().max(300),
  author: z.string().max(100),
  date: z.string().max(40),
  readTime: z.string().max(40),
  excerpt: z.string().max(2000),
  img: z.string().max(2000),
  magazineType: z.string().max(40),
  tags: z.array(z.string()),
  instagramUrls: z.array(z.string()),
  content: z.array(z.unknown()),
});

const magazineCreateSchema = magazineFields.partial().strict();
const magazineUpdateSchema = magazineFields.partial().strict();

function toResponse(item: any) {
  return {
    ...item,
    tags: JSON.parse(item.tags),
    instagramUrls: JSON.parse(item.instagramUrls),
    content: JSON.parse(item.content),
  };
}

// 전체 목록
magazineRouter.get('/', async (_req, res, next) => {
  try {
    const items = await prisma.magazine.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(items.map(toResponse));
  } catch (err) {
    next(err);
  }
});

// 1개 조회
magazineRouter.get('/:id', async (req, res, next) => {
  try {
    const item = await prisma.magazine.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!item) {
      res.status(404).json({ error: '매거진을 찾을 수 없습니다' });
      return;
    }
    res.json(toResponse(item));
  } catch (err) {
    next(err);
  }
});

// 생성
magazineRouter.post('/', requireAdmin, validate(magazineCreateSchema), async (req, res, next) => {
  try {
    const body = req.body;
    const item = await prisma.magazine.create({
      data: {
        title: body.title ?? '',
        author: body.author ?? '',
        date: body.date ?? '',
        readTime: body.readTime ?? '',
        excerpt: body.excerpt ?? '',
        img: body.img ?? '',
        tags: JSON.stringify(body.tags ?? []),
        magazineType: body.magazineType ?? '',
        instagramUrls: JSON.stringify(body.instagramUrls ?? []),
        content: JSON.stringify(body.content ?? []),
      },
    });
    res.status(201).json(toResponse(item));
  } catch (err) {
    next(err);
  }
});

// 수정
magazineRouter.put('/:id', requireAdmin, validate(magazineUpdateSchema), async (req, res, next) => {
  try {
    const body = req.body;
    const data: any = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.author !== undefined) data.author = body.author;
    if (body.date !== undefined) data.date = body.date;
    if (body.readTime !== undefined) data.readTime = body.readTime;
    if (body.excerpt !== undefined) data.excerpt = body.excerpt;
    if (body.img !== undefined) data.img = body.img;
    if (body.tags !== undefined) data.tags = JSON.stringify(body.tags);
    if (body.magazineType !== undefined) data.magazineType = body.magazineType;
    if (body.instagramUrls !== undefined) data.instagramUrls = JSON.stringify(body.instagramUrls);
    if (body.content !== undefined) data.content = JSON.stringify(body.content);

    const item = await prisma.magazine.update({
      where: { id: Number(req.params.id) },
      data,
    });
    res.json(toResponse(item));
  } catch (err) {
    next(err);
  }
});

// 삭제
magazineRouter.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    await prisma.magazine.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
