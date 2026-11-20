# 인사(회원·회비) 기능

어드민의 `회원`·`회비` 탭과 안드로이드 앱 `코콕 인사`가 함께 쓰는 기능이다.
지원서가 최종 합격하면 회원으로 등록하고, 회원마다 회비를 얼마나 냈는지 본다.

## 추가된 것

| 위치 | 내용 |
| --- | --- |
| `prisma/schema.prisma` | `Member`(회원), `DuesDeposit`(입금), `DuesReminder`(독촉 문자 기록), `HrSetting`(회비 규칙), `HrDevice`(앱을 설치한 기기) |
| `prisma/migrations/20261117090000_add_hr_members_dues` | 위 표를 만든다 |
| `prisma/migrations/20261117091000_application_current_form_fields` | 지금 지원 양식이 보내는 항목을 `Application`에 더한다 (아래 `지원 양식` 참고) |
| `server/src/lib/dues.ts` | 회비 계산과 입금자명 맞추기. DB를 쓰지 않는 함수라 `dues.test.ts`로 따로 확인한다 |
| `server/src/routes/hr.ts` | `/api/hr/*` 라우트 |
| `server/src/middleware/require-hr.ts` | 어드민 쿠키 또는 앱의 기기 토큰으로 인증 |
| `src/domain/hr`, `src/pages/admin/members`, `src/pages/admin/dues` | 어드민의 두 탭 |

## 회비 계산

```
부과액 = 월 회비 × 부과 개월 수 − 면제액
미납액 = 부과액 − 그 회원에게 연결된 입금 합계
```

- 부과 개월 수는 `joinedMonth`부터 이번 달까지다. 쉬거나 탈퇴한 회원은 `stoppedMonth`의 전달까지만 센다.
- 달은 모두 한국 시간 기준 `YYYY-MM`이다.
- 이번 달 회비는 마감일(`dueDay`)이 지나기 전까지 `미납`에는 들어가지만 `마감이 지난 미납`(overdue)에는 들어가지 않는다.
- 쉬던 회원을 다시 활동으로 바꾸면, 쉰 달의 회비는 면제액으로 넘어가고 이번 달부터 다시 부과된다.

## 입금이 회원에게 연결되는 순서

1. 앱이 카카오뱅크 입금 알림에서 금액과 입금자명을 읽어 `POST /api/hr/deposits`로 올린다. 같은 입금은 `dedupeKey`로 한 번만 저장된다.
2. 서버가 입금자명으로 회원을 찾는다. 이름이나 기억해 둔 입금자명과 같으면 연결하고, 없으면 입금자명 안에 이름이 들어 있는 회원(`홍길동11월`)을 찾는다.
3. 한 명으로 좁혀지지 않으면 연결하지 않는다. 앱의 회비 탭이나 어드민의 `회비` 탭에서 사람이 회원을 골라 준다.
4. 고를 때 `입금자명 기억하기`를 켜면 그 이름이 회원의 `depositNames`에 들어가서 다음부터는 자동으로 연결된다.

## 인증

- 어드민 웹: 다른 어드민 라우트와 같은 HttpOnly 쿠키.
- 앱: `POST /api/hr/devices`에 어드민 비밀번호를 보내 기기를 등록하고 토큰을 받는다. 그 뒤로는 `Authorization: Bearer <토큰>`.
  앱은 며칠씩 켜 둔 채로 입금을 올려야 해서 12시간짜리 쿠키를 쓸 수 없다.
  DB에는 토큰의 SHA-256 해시만 남는다. 어드민의 `회비` 탭에서 기기를 지우면 그 토큰은 바로 못 쓰게 된다.
- 기기 등록은 로그인과 같이 IP당 15분에 10번까지만 시도할 수 있다.

## 지원 양식

`main`의 지원 양식(`src/pages/apply`)은 `howKnow`, `scaleDesignTool`, `q2_motivation` 같은 항목을 보내는데,
서버와 DB에는 예전 양식의 항목(`scaleGourmet`, `q2_drink` 등)만 있었다. 그래서 서버가 `scaleGourmet`이 없다며 제출을 400으로 거절했다.

- `Application`에 지금 양식의 항목과 `interviewSchedule`(확정한 면접 시간) 컬럼을 더했다.
- 예전 항목은 없어도 받도록 바꿨다. 예전 지원서의 값은 그대로 남는다.

## 배포할 때 볼 것

- `vercel.json`의 빌드 명령에 `prisma migrate deploy`가 들어 있다. **이 변경을 배포하면 위 두 마이그레이션이 운영 DB에 바로 적용된다.**
  두 마이그레이션 모두 표와 컬럼을 더하기만 하고, 기존 표의 자료는 고치지 않는다.
- `ALLOWED_ORIGINS`는 고칠 필요가 없다. 앱의 요청에는 Origin 헤더가 없다.
- 배포한 뒤 앱의 연결 화면에 운영 주소와 어드민 비밀번호를 넣으면 된다.

## 로컬에서 돌려 보기

운영 DB 주소가 들어 있는 `.env`를 쓰지 않도록 `DATABASE_URL`을 명령에 직접 준다.

```bash
docker run -d --name cococ-hr-pg -e POSTGRES_PASSWORD=local -e POSTGRES_DB=cococ -p 127.0.0.1:55432:5432 postgres:16-alpine
export DATABASE_URL='postgresql://postgres:local@127.0.0.1:55432/cococ'
npx prisma migrate deploy
ADMIN_PASSWORD=localtest PORT=4010 npx tsx server/src/index.ts     # API
VITE_API_URL=http://localhost:4010 npx vite --port 5183            # 어드민 웹

npx tsx --test server/src/lib/dues.test.ts                         # 회비 계산 테스트
```
