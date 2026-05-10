// ──────────────────────────────────────────────────────────
// 아카이브 API 라우트
// ──────────────────────────────────────────────────────────
// REST API란?
//   웹에서 데이터를 주고받는 표준 방식입니다.
//   HTTP 메서드(GET, POST, PUT, DELETE)로 "무엇을 할지" 표현합니다:
//     GET    = 데이터 조회 (읽기)
//     POST   = 데이터 생성 (쓰기)
//     PUT    = 데이터 수정 (업데이트)
//     DELETE = 데이터 삭제
//
// 이 파일의 API 목록:
//   GET    /api/archives      → 전체 아카이브 목록 조회
//   GET    /api/archives/:id  → 특정 아카이브 1개 조회
//   POST   /api/archives      → 새 아카이브 생성
//   PUT    /api/archives/:id  → 아카이브 수정
//   DELETE /api/archives/:id  → 아카이브 삭제
// ──────────────────────────────────────────────────────────

import { Router } from 'express';
import { prisma } from '../prisma.js';
import { requireAdmin } from '../middleware/require-admin.js';

// Router()로 라우터 객체를 만듭니다.
// 라우터는 "이 URL에 이 함수를 연결해줘"라는 설정 모음입니다.
export const archiveRouter = Router();

// ──────────────────────────────────────────────────────────
// 헬퍼 함수: DB 레코드 → 프론트엔드용 JSON 변환
// ──────────────────────────────────────────────────────────
// DB에는 tags, gallery 등이 문자열("[]")로 저장되어 있습니다.
// 프론트엔드에서는 배열([])로 사용해야 하므로 변환이 필요합니다.
// JSON.parse()는 문자열을 JavaScript 객체로 변환하는 함수입니다.

function toResponse(item: any) {
  return {
    ...item,
    tags: JSON.parse(item.tags),
    gallery: JSON.parse(item.gallery),
    recipes: JSON.parse(item.recipes),
    content: JSON.parse(item.content),
  };
}

// ──────────────────────────────────────────────────────────
// GET /api/archives - 전체 목록 조회
// ──────────────────────────────────────────────────────────
// 브라우저가 GET /api/archives 요청을 보내면 이 함수가 실행됩니다.
// async/await: 비동기 처리. DB 조회는 시간이 걸리므로 "기다려야(await)" 합니다.

archiveRouter.get('/', async (_req, res, next) => {
  try {
    // prisma.archive.findMany() = Archive 테이블의 모든 행(row)을 가져옵니다.
    // orderBy: { createdAt: 'desc' } = 최신순으로 정렬합니다.
    const items = await prisma.archive.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // 각 항목의 JSON 문자열 필드를 배열로 변환하여 응답합니다.
    res.json(items.map(toResponse));
  } catch (err) {
    // 에러가 발생하면 next()로 에러 미들웨어에 전달합니다.
    next(err);
  }
});

// ──────────────────────────────────────────────────────────
// GET /api/archives/:id - 특정 아카이브 1개 조회
// ──────────────────────────────────────────────────────────
// :id 는 URL 매개변수입니다. /api/archives/3 이면 id=3 입니다.
// req.params.id 로 접근합니다.

archiveRouter.get('/:id', async (req, res, next) => {
  try {
    const item = await prisma.archive.findUnique({
      where: { id: Number(req.params.id) }, // id가 숫자이므로 Number()로 변환
    });

    if (!item) {
      // 404 = "Not Found" (해당 자원을 찾을 수 없음)
      res.status(404).json({ error: '아카이브를 찾을 수 없습니다' });
      return;
    }

    res.json(toResponse(item));
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────
// POST /api/archives - 새 아카이브 생성
// ──────────────────────────────────────────────────────────
// 클라이언트가 body에 JSON 데이터를 담아 보냅니다.
// req.body에서 데이터를 꺼내 DB에 저장합니다.

archiveRouter.post('/', requireAdmin, async (req, res, next) => {
  try {
    const body = req.body;

    // prisma.archive.create() = 새 행(row)을 DB에 추가합니다.
    // data: {...} = 저장할 데이터를 지정합니다.
    // JSON.stringify()는 배열/객체를 문자열로 변환합니다 (DB 저장용).
    const item = await prisma.archive.create({
      data: {
        year: body.year ?? '',
        semester: body.semester ?? '',
        category: body.category ?? '',
        title: body.title ?? '',
        date: body.date ?? '',
        base: body.base ?? '',
        img: body.img ?? '',
        participants: Number(body.participants) || 0,
        location: body.location ?? '',
        description: body.description ?? '',
        tags: JSON.stringify(body.tags ?? []),
        gallery: JSON.stringify(body.gallery ?? []),
        recipes: JSON.stringify(body.recipes ?? []),
        content: JSON.stringify(body.content ?? []),
      },
    });

    // 201 = "Created" (새 자원이 성공적으로 생성됨)
    res.status(201).json(toResponse(item));
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────
// PUT /api/archives/:id - 아카이브 수정
// ──────────────────────────────────────────────────────────

archiveRouter.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const body = req.body;

    // 업데이트할 데이터를 준비합니다.
    // 프론트에서 보내지 않은 필드는 건너뜁니다 (undefined 체크).
    const data: any = {};
    if (body.year !== undefined) data.year = body.year;
    if (body.semester !== undefined) data.semester = body.semester;
    if (body.category !== undefined) data.category = body.category;
    if (body.title !== undefined) data.title = body.title;
    if (body.date !== undefined) data.date = body.date;
    if (body.base !== undefined) data.base = body.base;
    if (body.img !== undefined) data.img = body.img;
    if (body.participants !== undefined) data.participants = Number(body.participants);
    if (body.location !== undefined) data.location = body.location;
    if (body.description !== undefined) data.description = body.description;
    if (body.tags !== undefined) data.tags = JSON.stringify(body.tags);
    if (body.gallery !== undefined) data.gallery = JSON.stringify(body.gallery);
    if (body.recipes !== undefined) data.recipes = JSON.stringify(body.recipes);
    if (body.content !== undefined) data.content = JSON.stringify(body.content);

    const item = await prisma.archive.update({
      where: { id: Number(req.params.id) },
      data,
    });

    res.json(toResponse(item));
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────────────────
// DELETE /api/archives/:id - 아카이브 삭제
// ──────────────────────────────────────────────────────────

archiveRouter.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    await prisma.archive.delete({
      where: { id: Number(req.params.id) },
    });

    // 204 = "No Content" (성공했지만 돌려줄 데이터 없음)
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
