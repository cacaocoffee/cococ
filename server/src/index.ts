// ──────────────────────────────────────────────────────────
// 서버 진입점 (Entry Point)
// ──────────────────────────────────────────────────────────
// 이 파일이 백엔드 서버의 "시작점"입니다.
// `npm run dev`를 실행하면 이 파일이 가장 먼저 실행됩니다.
//
// 역할: Express 앱을 가져와서 특정 포트에서 실행(listen)합니다.
// ──────────────────────────────────────────────────────────

import 'dotenv/config';
import { app } from './app.js';

// PORT: 서버가 듣는 "문 번호"입니다.
// 브라우저에서 http://localhost:4000 으로 접속하면 이 서버에 연결됩니다.
// process.env.PORT는 배포 환경(Railway 등)에서 자동 지정해주는 값입니다.
const PORT = process.env.PORT ?? 4000;

app.listen(PORT, () => {
  console.log(`✅ COCOC 서버가 http://localhost:${PORT} 에서 실행 중입니다`);
  console.log(`📋 API 문서: http://localhost:${PORT}/api`);
});
