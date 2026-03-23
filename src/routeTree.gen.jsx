import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomePage from "./pages/home/index";
import ArchivePage from "./pages/archive/index";
import ArchiveDetailPage from "./pages/archive/$id/index";
import MagazinePage from "./pages/magazine/index";
import MagazineDetailPage from "./pages/magazine/$id/index";
import ApplyPage from "./pages/apply/index";
import AdminPage from "./pages/admin/index";
import { ARCHIVE_DATA, MAGAZINE_DATA } from "@/data";

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
  loader: ({ params }) => {
    const item = ARCHIVE_DATA.find((d) => String(d.id) === params.id);
    if (!item) throw new Error("Not found");
    return { item };
  },
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
  loader: ({ params }) => {
    const item = MAGAZINE_DATA.find((m) => String(m.id) === params.id);
    if (!item) throw new Error("Not found");
    return { item };
  },
  component: MagazineDetailPage,
});
const applyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/apply",
  component: ApplyPage,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

// ─── Router ───
const routeTree = rootRoute.addChildren([
  indexRoute,
  archiveRoute,
  archiveDetailRoute,
  magazineRoute,
  magazineDetailRoute,
  applyRoute,
  adminRoute,
]);

export const router = createRouter({ routeTree, scrollRestoration: true });
