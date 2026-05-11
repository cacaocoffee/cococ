import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, Users, Archive, BookOpen, CalendarClock, CalendarDays } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { css, cx } from "@/lib/css";
import { colors } from "@/lib/tokens";
import LoginScreen from "./LoginScreen";

interface Tab {
  key: string;
  label: string;
  icon: LucideIcon;
  to: string;
}

const TABS: Tab[] = [
  { key: "applications", label: "지원서",    icon: Users,         to: "/admin/applications" },
  { key: "period",       label: "접수 기간", icon: CalendarClock, to: "/admin/period" },
  { key: "schedule",     label: "일정",      icon: CalendarDays,  to: "/admin/schedule" },
  { key: "archive",      label: "아카이브",  icon: Archive,       to: "/admin/archive" },
  { key: "magazine",     label: "매거진",    icon: BookOpen,      to: "/admin/magazine" },
];

const pageCss = css({
  paddingTop: "112px",
  paddingBottom: "96px",
  paddingInline: "24px",
  maxWidth: "72rem",
  marginInline: "auto",
  "@md": { paddingInline: "48px" },
});
const headerCss = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "32px",
  flexWrap: "wrap",
  gap: "16px",
});
const eyebrowCss = css({
  color: colors.brand,
  fontSize: "11px",
  fontWeight: "900",
  letterSpacing: "3px",
  textTransform: "uppercase",
  marginBottom: "4px",
});
const titleCss = css({
  fontSize: "30px",
  fontWeight: "900",
  color: colors.textPrimary,
});
const logoutBtnCss = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderStrong}`,
  color: colors.textMuted,
  paddingInline: "16px",
  paddingBlock: "10px",
  borderRadius: "0.75rem",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.2s",
  _hover: { color: colors.dangerMuted },
});
const tabBarCss = css({
  display: "flex",
  gap: "4px",
  marginBottom: "32px",
  borderBottom: `1px solid ${colors.borderMedium}`,
  overflowX: "auto",
  scrollbarWidth: "none",
  "::-webkit-scrollbar": { display: "none" },
});
const tabBtnBaseCss = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  paddingInline: "20px",
  paddingBlock: "12px",
  fontSize: "14px",
  fontWeight: "700",
  transition: "all 0.2s",
  marginBottom: "-1px",
  whiteSpace: "nowrap",
  background: "none",
  border: "none",
  borderBottom: "2px solid transparent",
  cursor: "pointer",
});
const tabBtnActiveCss = css({
  color: colors.brand,
  borderBottomColor: colors.brand,
});
const tabBtnInactiveCss = css({
  color: colors.textFaint,
  borderBottomColor: "transparent",
  _hover: { color: colors.textPrimary },
});

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean>(
    () => sessionStorage.getItem("cococ_admin") === "1",
  );
  const navigate = useNavigate();
  const { location } = useRouterState();

  const activeKey = TABS.find((t) => location.pathname.startsWith(t.to))?.key ?? "applications";

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  return (
    <div className={pageCss}>
      <div className={headerCss}>
        <div>
          <p className={eyebrowCss}>Admin Dashboard</p>
          <h1 className={titleCss}>COCOC 관리자</h1>
        </div>
        <motion.button
          onClick={() => {
            sessionStorage.removeItem("cococ_admin");
            setAuthed(false);
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={logoutBtnCss}
        >
          <LogOut size={15} /> 로그아웃
        </motion.button>
      </div>

      <div className={tabBarCss}>
        {TABS.map(({ key, label, icon: Icon, to }) => (
          <button
            key={key}
            onClick={() => navigate({ to })}
            className={cx(
              tabBtnBaseCss,
              activeKey === key ? tabBtnActiveCss : tabBtnInactiveCss,
            )}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeKey}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
