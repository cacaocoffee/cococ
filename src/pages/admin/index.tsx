import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, LogOut, Users, Archive, BookOpen, CalendarClock, CalendarDays, Contact, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { css, cx } from "@/lib/css";
import { colors } from "@/lib/tokens";
import { apiFetch, clearAdminToken, getAdminToken, ADMIN_UNAUTHORIZED_EVENT } from "@/lib/api";
import { AlertModal, useAlert } from "@/components/ui/Modal";
import LoginScreen from "./LoginScreen";
import AdminBootSpinner from "./components/AdminBootSpinner";

interface Tab {
  key: string;
  label: string;
  icon: LucideIcon;
  to: string;
}

const TABS: Tab[] = [
  { key: "applications", label: "지원서",    icon: Users,         to: "/admin/applications" },
  { key: "members",      label: "회원",      icon: Contact,       to: "/admin/members" },
  { key: "dues",         label: "회비",      icon: Wallet,        to: "/admin/dues" },
  { key: "period",       label: "접수 기간", icon: CalendarClock, to: "/admin/period" },
  { key: "schedule",     label: "일정",      icon: CalendarDays,  to: "/admin/schedule" },
  { key: "archive",      label: "아카이브",  icon: Archive,       to: "/admin/archive" },
  { key: "magazine",     label: "매거진",    icon: BookOpen,      to: "/admin/magazine" },
];

const pageCss = css({
  paddingTop: "40px",
  paddingBottom: "64px",
  paddingInline: "16px",
  maxWidth: "72rem",
  marginInline: "auto",
  "@md": { paddingInline: "48px" },
});

const publicLinkCss = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "11px",
  fontWeight: "700",
  color: colors.textDimmer,
  textDecoration: "none",
  marginBottom: "10px",
  transition: "color 0.2s",
  _hover: { color: colors.textPrimary },
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
  color: colors.textMuted,
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0",
  marginBottom: "4px",
});
const titleCss = css({
  fontSize: "32px",
  fontWeight: "700",
  letterSpacing: "-0.035em",
  color: colors.textPrimary,
});
const logoutBtnCss = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  backgroundColor: colors.bgCard,
  border: "none",
  color: colors.textPrimary,
  paddingInline: "16px",
  minHeight: "44px",
  borderRadius: "16px",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.2s",
  _hover: { backgroundColor: colors.bgPressed },
});
// 탭: 알약 모양 버튼 줄. 지금 탭은 잉크로 채운다. 좁은 화면에서는 옆으로 밀어 넘긴다
const tabBarCss = css({
  display: "flex",
  gap: "6px",
  marginBottom: "32px",
  marginInline: "-16px",
  paddingInline: "16px",
  overflowX: "auto",
  scrollbarWidth: "none",
  "::-webkit-scrollbar": { display: "none" },
});
const tabBtnBaseCss = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  paddingInline: "16px",
  minHeight: "40px",
  fontSize: "14px",
  fontWeight: "700",
  transition: "all 0.2s",
  whiteSpace: "nowrap",
  border: "none",
  borderRadius: "9999px",
  cursor: "pointer",
  flexShrink: "0",
});
const tabBtnActiveCss = css({
  color: colors.onInk,
  backgroundColor: colors.bgInk,
});
const tabBtnInactiveCss = css({
  color: colors.textMuted,
  backgroundColor: colors.bgCard,
  _hover: { color: colors.textPrimary },
});

// 'unknown': 토큰이 있지만 백엔드가 유효성 확인 전 — admin shell 잠시 노출 방지
// 'yes': 핑 200 OK
// 'no': 토큰 없음 또는 핑 실패
type AuthState = "unknown" | "yes" | "no";

export default function AdminPage() {
  const [auth, setAuth] = useState<AuthState>(() =>
    getAdminToken() ? "unknown" : "no",
  );
  const navigate = useNavigate();
  const { location } = useRouterState();
  const { alertProps, openAlert } = useAlert();

  // 마운트 / 토큰 변화 시 가벼운 핑으로 진짜 유효한지 검증.
  // 200 → 'yes', 401 → handle401 가 자동으로 토큰 비우고 이벤트 발사 → 'no' 전환.
  useEffect(() => {
    if (auth !== "unknown") return;
    let cancelled = false;
    void apiFetch<{ ok: boolean }>("/api/admin/ping")
      .then(() => { if (!cancelled) setAuth("yes"); })
      .catch(() => { if (!cancelled) setAuth("no"); });
    return () => { cancelled = true; };
  }, [auth]);

  // 401 응답을 받으면 토큰만 비워지고 이 이벤트가 발사된다.
  // 강제 리로드 대신 팝업을 띄우고 로그인 화면으로 자연 전환.
  useEffect(() => {
    const onUnauthorized = () => {
      setAuth("no");
      openAlert({
        title: "세션이 만료됐어요",
        description: "다시 로그인해주세요.",
        type: "error",
      });
    };
    window.addEventListener(ADMIN_UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(ADMIN_UNAUTHORIZED_EVENT, onUnauthorized);
  }, [openAlert]);

  const activeKey = TABS.find((t) => location.pathname.startsWith(t.to))?.key ?? "applications";

  if (auth === "unknown") {
    return <AdminBootSpinner />;
  }

  if (auth === "no") {
    return (
      <>
        <LoginScreen onLogin={() => setAuth("yes")} />
        <AlertModal {...alertProps} />
      </>
    );
  }

  return (
    <div className={pageCss}>
      <div className={headerCss}>
        <div>
          <Link to="/" target="_blank" rel="noreferrer" className={publicLinkCss}>
            공개 사이트 열기 <ArrowUpRight size={11} />
          </Link>
          <p className={eyebrowCss}>Admin Dashboard</p>
          <h1 className={titleCss}>COCOC 관리자</h1>
        </div>
        <motion.button
          onClick={async () => {
            try {
              await apiFetch("/api/admin/logout", { method: "POST" });
            } catch {
              // 네트워크 실패해도 클라 토큰은 제거
            }
            clearAdminToken();
            setAuth("no");
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
      <AlertModal {...alertProps} />
    </div>
  );
}
