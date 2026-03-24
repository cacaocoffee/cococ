# AGENTS.md

이 파일은 AI 코딩 에이전트가 이 프로젝트에서 작업할 때 참고하는 스킬 매핑입니다.

## 프로젝트 개요

- **프로젝트**: COCOC (칵테일 동아리 웹사이트)
- **주요 스택**: React, TanStack Router, TanStack Query, Vite
- **라우팅**: `src/routeTree.gen.jsx` (수동 관리)
- **데이터**: Mock API (`src/api/`) + localStorage, `src/data/index.js` (시드 데이터)
- **스타일링**: CSS-in-JS (`src/lib/css.js`)
- **어드민**: `/admin` 경로, 비밀번호 인증

<!-- intent-skills:start -->
# Skill mappings - when working in these areas, load the linked skill file into context.
skills:
  - task: "라우트 추가, 페이지 이동, Link/useNavigate 사용, 라우트 파라미터 처리"
    load: "node_modules/@tanstack/router-core/skills/router-core/SKILL.md"

  - task: "라우트 loader 작성, 데이터 프리로딩, pendingComponent, errorComponent 설정"
    load: "node_modules/@tanstack/router-core/skills/router-core/data-loading/SKILL.md"

  - task: "URL 파라미터($id 등) 읽기, useParams, 동적 라우트 설정"
    load: "node_modules/@tanstack/router-core/skills/router-core/path-params/SKILL.md"

  - task: "인증/어드민 접근 제한, beforeLoad로 리다이렉트, 라우트 가드"
    load: "node_modules/@tanstack/router-core/skills/router-core/auth-and-guards/SKILL.md"

  - task: "404 처리, notFoundComponent, errorComponent, CatchBoundary"
    load: "node_modules/@tanstack/router-core/skills/router-core/not-found-and-errors/SKILL.md"
<!-- intent-skills:end -->
