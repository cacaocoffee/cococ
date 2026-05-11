import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
  Link,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";

// ─── 전역 404 / 에러 컴포넌트 ─────────────────────────────────
const notFoundPageCss = css({
  paddingTop: "160px",
  paddingBottom: "96px",
  textAlign: "center",
  color: colors.textFaint,
});
const notFoundTitleCss = css({
  fontSize: "18px",
  fontWeight: "700",
  marginBottom: "16px",
  color: colors.textMuted,
});
const notFoundLinkCss = css({
  display: "inline-block",
  marginTop: "8px",
  paddingInline: "24px",
  paddingBlock: "10px",
  border: `1.5px solid ${colors.brand}`,
  color: colors.brand,
  borderRadius: "9999px",
  fontSize: "13px",
  fontWeight: "700",
  textDecoration: "none",
  transition: "all 0.2s",
  _hover: { backgroundColor: colors.brand, color: colors.bgPage },
});

function NotFoundPage() {
  return (
    <div className={notFoundPageCss}>
      <p className={notFoundTitleCss}>페이지를 찾을 수 없습니다.</p>
      <Link to="/" className={notFoundLinkCss}>홈으로 돌아가기</Link>
    </div>
  );
}

interface ErrorPageProps {
  error: Error;
}

function ErrorPage({ error }: ErrorPageProps) {
  const router = useRouter();
  return (
    <div className={notFoundPageCss}>
      <p className={notFoundTitleCss}>오류가 발생했습니다.</p>
      <p style={{ fontSize: "13px", color: colors.textDimmer, marginBottom: "24px" }}>
        {error?.message}
      </p>
      <button className={notFoundLinkCss} onClick={() => router.invalidate()}>
        다시 시도
      </button>
    </div>
  );
}

import HomePage from "./pages/home/index";
import ArchivePage from "./pages/archive/index";
import ArchiveDetailPage from "./pages/archive/$id/index";
import MagazinePage from "./pages/magazine/index";
import MagazineDetailPage from "./pages/magazine/$id/index";
import ApplyPage from "./pages/apply/index";
import SchedulePage from "./pages/schedule/index";
import AdminPage from "./pages/admin/index";
import ApplicationsTab from "./pages/admin/applications/index";
import PeriodTab from "./pages/admin/period/index";
import ScheduleTab from "./pages/admin/schedule/index";
import ArchiveTab from "./pages/admin/archive/index";
import MagazineTab from "./pages/admin/magazine/index";

const marqueeStyle = `
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
`;

// ─── Root layout ───
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-amber-500 selection:text-black">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <style dangerouslySetInnerHTML={{ __html: marqueeStyle }} />
    </div>
  ),
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
});

// ─── Routes ───
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const archiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/archive",
  component: ArchivePage,
});
const archiveDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/archive/$id",
  component: ArchiveDetailPage,
});
const magazineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/magazine",
  component: MagazinePage,
});
const magazineDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/magazine/$id",
  component: MagazineDetailPage,
});
const applyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/apply",
  component: ApplyPage,
});
const scheduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/schedule",
  component: SchedulePage,
});

// ─── Admin (layout + children) ───
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});
const adminIndexRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/",
  beforeLoad: () => { throw redirect({ to: "/admin/applications", replace: true }); },
});
const adminApplicationsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/applications",
  component: ApplicationsTab,
});
const adminPeriodRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/period",
  component: PeriodTab,
});
const adminScheduleRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/schedule",
  component: ScheduleTab,
});
const adminArchiveRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/archive",
  component: ArchiveTab,
});
const adminMagazineRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/magazine",
  component: MagazineTab,
});

// ─── Router ───
const routeTree = rootRoute.addChildren([
  indexRoute,
  archiveRoute,
  archiveDetailRoute,
  magazineRoute,
  magazineDetailRoute,
  applyRoute,
  scheduleRoute,
  adminRoute.addChildren([
    adminIndexRoute,
    adminApplicationsRoute,
    adminPeriodRoute,
    adminScheduleRoute,
    adminArchiveRoute,
    adminMagazineRoute,
  ]),
]);

export const router = createRouter({ routeTree, scrollRestoration: true });
