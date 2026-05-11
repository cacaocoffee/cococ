// Vercel Serverless Function 진입점.
// 모든 /api/* 요청은 vercel.json rewrite로 이 핸들러에 도달하고,
// Express 앱이 내부 라우팅을 담당한다.

import { app } from '../server/src/app.js';

export default app;
