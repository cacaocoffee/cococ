# COCOC 백엔드 완전 초보자 가이드

> 백엔드를 처음 접하는 분을 위한 A to Z 설명서입니다.
> 모르는 용어가 나오면 바로 아래에 설명이 있으니 천천히 읽어주세요!

---

## 목차

1. [백엔드가 뭔가요?](#1-백엔드가-뭔가요)
2. [우리 프로젝트의 구조](#2-우리-프로젝트의-구조)
3. [사용하는 기술 스택 설명](#3-사용하는-기술-스택-설명)
4. [처음 시작하기 (설치 & 실행)](#4-처음-시작하기-설치--실행)
5. [폴더 구조 상세 설명](#5-폴더-구조-상세-설명)
6. [데이터베이스 이해하기](#6-데이터베이스-이해하기)
7. [API 라우트 이해하기](#7-api-라우트-이해하기)
8. [프론트엔드 ↔ 백엔드 연결 흐름](#8-프론트엔드--백엔드-연결-흐름)
9. [자주 쓰는 명령어 모음](#9-자주-쓰는-명령어-모음)
10. [배포하기](#10-배포하기)
11. [문제 해결 (FAQ)](#11-문제-해결-faq)
12. [용어 사전](#12-용어-사전)

---

## 1. 백엔드가 뭔가요?

### 프론트엔드 vs 백엔드

웹사이트는 크게 두 부분으로 나뉩니다:

**프론트엔드 (Front-end)** = "눈에 보이는 부분"
- 브라우저에서 보이는 화면, 버튼, 애니메이션
- HTML, CSS, JavaScript(React)로 만듦
- 사용자의 컴퓨터(브라우저)에서 실행됨

**백엔드 (Back-end)** = "눈에 안 보이는 뒷단"
- 데이터 저장, 처리, 보안
- 서버 컴퓨터에서 실행됨
- 프론트엔드가 "데이터 주세요" 하면 "여기요~" 하고 전달하는 역할

### 왜 백엔드가 필요한가요?

지금까지 COCOC은 `localStorage`라는 것을 사용했습니다. 이건 브라우저에 데이터를 저장하는 방식인데, 큰 문제가 있습니다:

| 문제 | localStorage | 백엔드 서버 |
|------|-------------|-----------|
| 다른 사람이 볼 수 있나? | ❌ 내 브라우저에만 존재 | ✅ 모든 사용자가 같은 데이터를 봄 |
| 브라우저 데이터 삭제하면? | ❌ 데이터 전부 사라짐 | ✅ 서버에 안전하게 보관됨 |
| 다른 기기에서 접속하면? | ❌ 데이터 없음 | ✅ 어디서든 같은 데이터 |
| 보안은? | ❌ 누구나 수정 가능 | ✅ 서버에서 검증 가능 |

---

## 2. 우리 프로젝트의 구조

```
cococ/
├── src/                    ← 프론트엔드 (React)
│   ├── pages/              ← 페이지 컴포넌트
│   ├── domain/             ← 서비스 레이어 (API 호출)
│   └── lib/api.ts          ← API 통신 함수 모음
│
├── server/                 ← 🆕 백엔드 (Express)
│   ├── src/                ← 서버 소스 코드
│   │   ├── index.ts        ← 서버 시작점
│   │   ├── app.ts          ← Express 앱 설정
│   │   ├── prisma.ts       ← DB 연결
│   │   ├── seed.ts         ← 초기 데이터 삽입
│   │   ├── routes/         ← API 엔드포인트들
│   │   └── middleware/     ← 미들웨어
│   ├── prisma/
│   │   ├── schema.prisma   ← DB 테이블 설계도
│   │   └── dev.db          ← SQLite 데이터 파일 (자동생성)
│   ├── uploads/            ← 업로드된 이미지 저장소
│   └── package.json        ← 서버 의존성 목록
│
├── vite.config.ts          ← 프록시 설정 추가됨
└── package.json            ← 프론트 의존성 목록
```

### 데이터 흐름 한눈에 보기

```
[사용자 브라우저]
       │
       │ "아카이브 목록 보여줘" (GET /api/archives)
       ▼
[프론트엔드 - React]
       │
       │ fetch('/api/archives')  ← src/lib/api.ts
       ▼
[Vite 프록시] (개발 시)
       │
       │ localhost:5173/api → localhost:4000/api 로 전달
       ▼
[백엔드 - Express 서버]
       │
       │ archiveRouter.get('/')  ← server/src/routes/archive.ts
       ▼
[Prisma ORM]
       │
       │ prisma.archive.findMany()
       ▼
[SQLite 데이터베이스]
       │
       │ SELECT * FROM Archive
       ▼
[데이터 반환] → Express → Vite → React → 화면에 표시!
```

---

## 3. 사용하는 기술 스택 설명

### Express.js
Node.js로 만드는 웹 서버 프레임워크. "프레임워크"란 복잡한 것을 쉽게 만들 수 있게 도와주는 도구 세트입니다. 전 세계에서 가장 많이 쓰이는 Node.js 웹 서버 도구입니다.

### TypeScript
JavaScript에 "타입"을 추가한 언어. 예를 들어 `name: string`이라고 적으면 name에는 문자열만 들어갈 수 있습니다. 실수로 숫자를 넣으면 빨간 줄이 뜹니다. 프론트엔드와 같은 언어라서 새로 배울 필요가 없습니다!

### SQLite
파일 하나로 동작하는 가벼운 데이터베이스. MySQL이나 PostgreSQL처럼 별도 설치 없이, `dev.db`라는 파일 하나에 모든 데이터가 저장됩니다. 소규모 프로젝트에 최적입니다.

### Prisma ORM
데이터베이스를 쉽게 다루는 도구. SQL을 직접 쓰지 않고, `prisma.archive.findMany()`처럼 JavaScript 코드로 DB를 조작합니다. 자동으로 TypeScript 타입도 만들어줍니다.

### multer
파일 업로드를 처리하는 라이브러리. 이미지를 서버에 저장할 때 사용합니다.

---

## 4. 처음 시작하기 (설치 & 실행)

### 사전 준비

Node.js가 설치되어 있어야 합니다. 터미널에서 확인:
```bash
node --version   # v18 이상 필요
npm --version    # 함께 설치됨
```

### Step 1: 서버 패키지 설치

```bash
# cococ 프로젝트 루트에서
cd server
npm install
```

> `npm install`은 package.json에 적힌 라이브러리들을 다운로드하는 명령입니다.
> 실행하면 `node_modules` 폴더가 생깁니다 (용량이 크지만 정상입니다).

### Step 2: 데이터베이스 초기화

```bash
# server 폴더 안에서 실행
npx prisma migrate dev --name init
```

> 이 명령이 하는 일:
> 1. `schema.prisma`를 읽어서 SQL 명령으로 변환
> 2. `prisma/dev.db` 파일을 생성 (이게 데이터베이스!)
> 3. 테이블들을 만들어줌 (Archive, Magazine, Application 등)
> 4. Prisma Client를 자동 생성 (타입 포함)

### Step 3: 초기 데이터 넣기

```bash
npm run db:seed
```

> 기존 프론트엔드에 하드코딩되어 있던 아카이브, 스케줄, 매거진 데이터를
> 데이터베이스에 넣어주는 스크립트입니다.

### Step 4: 서버 실행

```bash
npm run dev
```

> 성공하면 이렇게 보입니다:
> ```
> ✅ COCOC 서버가 http://localhost:4000 에서 실행 중입니다
> 📋 API 문서: http://localhost:4000/api
> ```

### Step 5: 프론트엔드 실행 (다른 터미널에서)

```bash
# cococ 루트 폴더로 돌아가서
cd ..
npm run dev
```

> 이제 두 개의 터미널이 필요합니다:
> - 터미널 1: `server/` 에서 백엔드 실행 (포트 4000)
> - 터미널 2: 루트에서 프론트엔드 실행 (포트 5173)

### 브라우저에서 확인

- 프론트엔드: http://localhost:5173
- 백엔드 API 테스트: http://localhost:4000/api
- 아카이브 목록 API: http://localhost:4000/api/archives

---

## 5. 폴더 구조 상세 설명

### `server/src/index.ts` - 시작점

서버의 "main 함수"입니다. Express 앱을 가져와서 포트 4000에서 듣기(listen) 시작합니다. 맨 처음 실행되는 파일입니다.

### `server/src/app.ts` - 앱 설정

Express 앱을 만들고, 미들웨어와 라우트를 연결하는 파일입니다.

**미들웨어(Middleware)란?**
요청이 처리되기 전에 거치는 "중간 처리기"입니다.
비유하면: 식당의 "접수 → 대기 → 주문 → 조리 → 서빙" 중에서 접수~주문까지가 미들웨어입니다.

- `cors()`: 다른 도메인의 접근을 허용 (프론트 ↔ 백엔드 통신에 필요)
- `express.json()`: 클라이언트가 보낸 JSON 데이터를 자동으로 파싱
- `express.static()`: 이미지 파일 등을 직접 제공

### `server/src/routes/` - API 엔드포인트

각 기능별 API를 정의하는 폴더입니다.

- `archive.ts` - 아카이브 CRUD
- `magazine.ts` - 매거진 CRUD
- `apply.ts` - 지원서 + 면접설정 + 지원기간
- `schedule.ts` - 일정 CRUD
- `upload.ts` - 이미지 업로드

### `server/prisma/schema.prisma` - DB 설계도

데이터베이스의 테이블 구조를 정의하는 파일입니다.
이 파일을 수정하면 → `prisma migrate dev` 명령으로 DB에 반영합니다.

### `server/src/seed.ts` - 초기 데이터

빈 DB에 기본 데이터를 넣어주는 스크립트입니다.
`npm run db:seed`로 실행합니다.

---

## 6. 데이터베이스 이해하기

### 테이블이란?

데이터베이스는 여러 개의 "테이블"로 구성됩니다. 테이블은 엑셀 시트와 비슷합니다:

```
Archive 테이블:
┌────┬──────┬──────────────────────┬────────────┐
│ id │ year │ title                │ base       │
├────┼──────┼──────────────────────┼────────────┤
│ 1  │ 2024 │ 클래식 칵테일 마스터리  │ Gin        │
│ 2  │ 2024 │ 성수 팝업 게스트 바텐딩 │ Whiskey    │
│ 3  │ 2023 │ COCOC 연말 네트워킹    │ Various    │
└────┴──────┴──────────────────────┴────────────┘
```

### 우리 DB의 테이블들

| 테이블 | 설명 | 대응되는 기능 |
|--------|------|-------------|
| Archive | 과거 행사/클래스 | 아카이브 페이지 |
| Magazine | 매거진/카드뉴스 | 매거진 페이지 |
| Application | 가입 신청서 | 지원 페이지 & 어드민 |
| Schedule | 일정 | 스케줄 페이지 |
| InterviewSetting | 면접 설정 | 어드민 |
| ApplyPeriod | 지원 기간 | 어드민 |

### Prisma로 DB 다루기 (코드 예시)

```typescript
// 전체 조회
const archives = await prisma.archive.findMany();

// 1개 조회 (id로)
const one = await prisma.archive.findUnique({ where: { id: 1 } });

// 생성
await prisma.archive.create({
  data: { title: '새 클래스', year: '2026', ... }
});

// 수정
await prisma.archive.update({
  where: { id: 1 },
  data: { title: '수정된 제목' }
});

// 삭제
await prisma.archive.delete({ where: { id: 1 } });
```

### JSON 필드에 대해

SQLite는 배열(Array) 타입을 직접 지원하지 않습니다.
그래서 `tags`, `gallery`, `recipes` 같은 배열 데이터는 문자열로 변환해서 저장합니다:

```
저장 시: ["Gin", "Classic"] → '["Gin","Classic"]'  (JSON.stringify)
읽을 때: '["Gin","Classic"]' → ["Gin", "Classic"]  (JSON.parse)
```

이 변환은 API 라우트 파일의 `toResponse()` 함수에서 자동 처리됩니다.

---

## 7. API 라우트 이해하기

### REST API 기본 개념

API는 프론트엔드와 백엔드가 "대화"하는 약속된 규칙입니다.

**HTTP 메서드** (어떤 동작을 할지):
| 메서드 | 의미 | 비유 |
|--------|------|------|
| GET | 데이터 조회 | "이 데이터 보여줘" |
| POST | 데이터 생성 | "새 데이터 만들어줘" |
| PUT | 데이터 전체 수정 | "이 데이터 바꿔줘" |
| PATCH | 데이터 일부 수정 | "이 필드만 바꿔줘" |
| DELETE | 데이터 삭제 | "이 데이터 지워줘" |

**HTTP 상태 코드** (결과가 어땠는지):
| 코드 | 의미 | 비유 |
|------|------|------|
| 200 | 성공 | "잘 됐어!" |
| 201 | 생성 성공 | "새로 만들었어!" |
| 204 | 성공 (내용 없음) | "삭제 완료!" |
| 400 | 잘못된 요청 | "보내준 데이터가 이상해" |
| 404 | 없음 | "그런 데이터 없어" |
| 500 | 서버 에러 | "서버에 문제 생겼어" |

### 우리 프로젝트의 API 목록

**아카이브** (`/api/archives`):
```
GET    /api/archives      → 전체 목록
GET    /api/archives/3    → id=3인 아카이브 1개
POST   /api/archives      → 새 아카이브 생성
PUT    /api/archives/3    → id=3 수정
DELETE /api/archives/3    → id=3 삭제
```

**매거진** (`/api/magazines`): 아카이브와 동일한 패턴

**지원서** (`/api/apply`):
```
GET    /api/apply/applications      → 전체 지원서
POST   /api/apply/applications      → 새 지원서 제출
PATCH  /api/apply/applications/5    → id=5 상태 변경
DELETE /api/apply/applications/5    → id=5 삭제
GET    /api/apply/interview-settings → 면접 설정 조회
PUT    /api/apply/interview-settings → 면접 설정 저장
GET    /api/apply/period            → 지원 기간 조회
PUT    /api/apply/period            → 지원 기간 설정
GET    /api/apply/is-open           → 지원 가능 여부
```

**스케줄** (`/api/schedules`): 아카이브와 동일한 패턴

**업로드** (`/api/upload`):
```
POST   /api/upload   → 이미지 파일 업로드
```

### API 테스트하기

브라우저에서 GET 요청은 주소창에 입력하면 됩니다:
- http://localhost:4000/api/archives

POST/PUT/DELETE는 브라우저 주소창으로는 안 됩니다.
대신 이런 도구를 사용하세요:
- **Postman** (무료 앱) - 추천!
- **VS Code REST Client** 확장 프로그램
- 브라우저 개발자 도구의 콘솔에서 `fetch()` 사용

---

## 8. 프론트엔드 ↔ 백엔드 연결 흐름

### 변경 전 (localStorage 방식)

```
[React 컴포넌트]
     ↓
[archiveService.fetchList()]
     ↓
[createLocalStorageAPI.getAll()]
     ↓
[localStorage.getItem('cococ_archive')]
     ↓
[브라우저 메모리에서 데이터 읽기]
```

### 변경 후 (API 방식)

```
[React 컴포넌트]
     ↓
[archiveService.fetchList()]        ← 함수 이름은 동일!
     ↓
[apiGet('/api/archives')]           ← fetch()로 서버에 요청
     ↓
[Express 서버가 요청 수신]
     ↓
[prisma.archive.findMany()]         ← DB에서 데이터 조회
     ↓
[JSON으로 응답]                     ← 데이터를 프론트로 전송
```

서비스 레이어의 함수 이름(`fetchList`, `fetchById` 등)이 동일하므로
React 컴포넌트 코드는 전혀 수정하지 않아도 됩니다!

### 프록시란?

개발 중에 프론트(5173)와 백엔드(4000) 포트가 다릅니다.
`vite.config.ts`에 프록시 설정을 해두면:

```
브라우저: "나는 localhost:5173/api/archives 에 요청을 보낼거야"
Vite:     "아, /api로 시작하네? localhost:4000/api/archives 로 대신 전달해줄게"
Express:  "요청 받았어! 데이터 여기 있어~"
```

이렇게 하면 프론트엔드에서는 서버 주소를 신경 쓸 필요가 없습니다.

---

## 9. 자주 쓰는 명령어 모음

모두 `server/` 폴더 안에서 실행합니다.

```bash
# ── 서버 실행 ──
npm run dev                    # 개발 서버 시작 (파일 수정 시 자동 재시작)

# ── 데이터베이스 ──
npx prisma migrate dev         # schema.prisma 변경사항을 DB에 반영
npx prisma migrate dev --name 설명  # 마이그레이션에 이름 붙이기
npm run db:seed                # 초기 데이터 삽입
npm run db:reset               # ⚠️ DB 완전 초기화 (모든 데이터 삭제 후 재생성)
npx prisma studio              # 브라우저에서 DB 내용을 눈으로 확인! (추천)

# ── Prisma ──
npx prisma generate            # Prisma Client 재생성 (스키마 변경 후)
npx prisma db push             # 마이그레이션 없이 스키마 변경 바로 적용 (개발용)

# ── 빌드 ──
npm run build                  # TypeScript → JavaScript 변환 (배포용)
npm start                      # 빌드된 파일로 서버 실행 (배포용)
```

### 특별 추천: Prisma Studio

```bash
npx prisma studio
```

이 명령을 실행하면 브라우저에서 DB 내용을 엑셀처럼 볼 수 있습니다!
데이터 추가, 수정, 삭제도 클릭만으로 가능합니다.
백엔드 초보자에게 강력 추천합니다.

---

## 10. 배포하기

### 단일 포트 프로덕션 빌드 (단일 서버 + SQLite 가정)

Vite로 빌드한 프론트(`/dist`)와 Express 백엔드를 같은 프로세스에서 서비스하면 포트 하나만으로 풀스택 운영이 가능합니다. 절차는 다음과 같습니다:

1. **빌드**
   ```bash
   npm run build:all
   # → 프론트는 레포 루트 `/dist`, 서버는 `server/dist`에 컴파일됩니다.
   ```

2. **실행**
   ```bash
   NODE_ENV=production \
   ADMIN_PASSWORD=비밀번호 \
   ALLOWED_ORIGINS=https://your-domain.com \
   PORT=4000 \
   npm run start
   ```

3. **동작 방식**
   - `NODE_ENV=production`일 때 Express가 레포 루트 `/dist`를 정적 호스팅하고, `/api/*`·`/uploads/*`로 매칭되지 않는 모든 GET 요청을 `index.html`로 떨어뜨려 SPA 라우팅이 동작합니다.
   - 모든 트래픽이 동일 오리진을 사용하므로 `ALLOWED_ORIGINS`는 운영 도메인 한 개만 지정해도 충분합니다(CORS 우회 위험 감소).
   - 외부에 노출되는 포트는 4000번 하나뿐 — 리버스 프록시(nginx/Caddy)나 PaaS 라우터에서 80/443 → 4000으로 연결하면 됩니다.

### Railway 배포 (추천)

Railway는 GitHub 저장소를 연결하면 자동으로 배포해주는 서비스입니다.

1. **GitHub에 코드 올리기**
   ```bash
   git add .
   git commit -m "백엔드 추가"
   git push
   ```

2. **Railway 가입**: https://railway.app

3. **새 프로젝트 생성** → GitHub 저장소 연결

4. **환경 변수 설정**:
   - `PORT` → Railway가 자동 지정
   - `DATABASE_URL` → `file:./dev.db` (SQLite 사용 시)

5. **빌드 명령 설정**:
   ```
   Root Directory: server
   Build Command: npm install && npx prisma migrate deploy && npm run build
   Start Command: npm start
   ```

### 배포 시 프론트엔드 설정

프론트엔드에서 백엔드 서버 주소를 알려줘야 합니다:

```bash
# .env.production 파일 생성 (cococ 루트에)
VITE_API_URL=https://your-server.railway.app
```

---

## 11. 문제 해결 (FAQ)

### "서버가 안 켜져요"

```bash
# 1. server 폴더에 있는지 확인
pwd  # /path/to/cococ/server 여야 합니다

# 2. node_modules가 있는지 확인
ls node_modules  # 없으면 npm install 실행

# 3. DB가 초기화되었는지 확인
ls prisma/dev.db  # 없으면 npx prisma migrate dev 실행
```

### "데이터가 안 보여요"

```bash
# 시드 데이터가 있는지 확인
npx prisma studio  # 브라우저에서 확인

# 시드 실행
npm run db:seed
```

### "프론트에서 API 호출이 실패해요"

1. 백엔드 서버가 켜져 있는지 확인 (터미널에 로그가 보이는지)
2. http://localhost:4000/api 에 접속되는지 확인
3. 브라우저 개발자 도구 → Network 탭에서 요청 상태 확인

### "DB를 처음부터 다시 하고 싶어요"

```bash
npm run db:reset
```

이 명령은 DB를 완전히 삭제하고 다시 만든 후 시드 데이터까지 넣어줍니다.

### "schema.prisma를 수정했는데 반영이 안 돼요"

```bash
npx prisma migrate dev --name 변경_내용_설명
```

이 명령으로 변경사항을 DB에 반영해야 합니다.

---

## 12. 용어 사전

| 용어 | 뜻 | 비유 |
|------|-----|------|
| **서버** | 요청을 받아 처리하는 프로그램 | 식당의 주방 |
| **클라이언트** | 서버에 요청을 보내는 프로그램 | 식당의 손님 |
| **API** | 프론트와 백이 소통하는 규칙 | 메뉴판 |
| **엔드포인트** | 특정 API의 URL 주소 | 메뉴판의 각 메뉴 |
| **라우트** | URL과 처리 함수를 연결하는 것 | "이 메뉴를 주문하면 이 요리를 만든다" |
| **미들웨어** | 요청 처리 전에 거치는 중간 단계 | 식당의 접수/대기 과정 |
| **CORS** | 다른 도메인 간 통신 허용 설정 | "다른 가게 손님도 받겠습니다" |
| **프록시** | 대신 전달해주는 중개자 | 배달 대행 |
| **ORM** | 코드로 DB를 다루는 도구 | 통역사 (JS ↔ SQL) |
| **마이그레이션** | DB 구조 변경을 기록하는 것 | 설계도 변경 이력 |
| **시드** | DB에 초기 데이터를 넣는 것 | 새 가게 오픈 시 진열 |
| **CRUD** | Create/Read/Update/Delete | 만들기/읽기/수정/삭제 |
| **JSON** | 데이터 교환 형식 `{ key: value }` | 택배 박스 포장 규격 |
| **포트** | 서버가 듣는 통신 채널 번호 | 건물의 문 번호 |
| **환경변수** | 코드 밖에서 설정하는 값 | 건물 관리실에 보관하는 열쇠 |
| **fetch()** | 브라우저에서 서버로 요청 보내는 함수 | "주문하겠습니다!" |
| **async/await** | 비동기 처리 문법 | "기다렸다가 결과 받기" |
| **Promise** | 미래에 완료될 작업의 약속 | "잠시만요, 곧 가져다 드릴게요" |

---

## 추가 학습 자료

- **Express.js 공식 문서**: https://expressjs.com/ko/
- **Prisma 공식 문서**: https://www.prisma.io/docs
- **HTTP 상태 코드**: https://developer.mozilla.org/ko/docs/Web/HTTP/Status
- **REST API 개념**: https://ko.wikipedia.org/wiki/REST

---

*이 문서는 COCOC 프로젝트의 백엔드를 이해하기 위해 작성되었습니다.*
*궁금한 점이 있으면 코드의 주석을 참고하세요 - 모든 파일에 한국어 설명이 있습니다!*
