// 회원·회비 탭이 함께 쓰는 스타일.
// 회색 바탕에 흰 카드, 잉크 버튼, 라임 강조 (디자인 A). 색은 `src/lib/tokens.ts`의 것만 쓴다.
import { css } from "@/lib/css";
import { colors, fonts, radii, shadows } from "@/lib/tokens";

// 입력칸을 눌렀을 때 바깥에 두르는 옅은 띠, 옅은 강조 면
export const BRAND_BG = colors.bgPressed;
export const BRAND_BORDER = colors.borderStrong;

// 두 탭의 가장 바깥에 건다. 한글 문장이 낱말 중간에서 줄바꿈되지 않게 한다.
export const hrRootCss = css({ wordBreak: "keep-all", overflowWrap: "anywhere" });

// 겹쳐 뜨는 창 안의 버튼 줄. 내용이 길어 스크롤해도 창 아래쪽에 붙어 있다.
export const sheetActionsCss = css({
  position: "sticky",
  bottom: "-20px",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "22px",
  marginInline: "-20px",
  marginBottom: "-20px",
  paddingInline: "20px",
  paddingTop: "14px",
  paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
  backgroundColor: colors.bgCard,
  borderTop: `1px solid ${colors.borderSubtle}`,
  "@sm": { bottom: "-24px", marginInline: "-28px", marginBottom: "-24px", paddingInline: "28px", paddingBottom: "18px" },
});

// ─── 글 ───────────────────────────────────────────────────────
export const displayCss = css({
  fontFamily: fonts.display,
  fontWeight: "700",
  letterSpacing: "-0.01em",
});

export const numCss = css({ fontVariantNumeric: "tabular-nums" });

export const sectionTitleCss = css({
  fontFamily: fonts.display,
  fontSize: "22px",
  fontWeight: "700",
  color: colors.textPrimary,
  letterSpacing: "-0.03em",
});

export const sectionDescCss = css({
  fontSize: "13px",
  color: colors.textFaint,
  lineHeight: "1.6",
  marginTop: "4px",
});

export const hintCss = css({
  fontSize: "12px",
  color: colors.textFaint,
  lineHeight: "1.6",
  marginTop: "6px",
});

export const errorTextCss = css({
  fontSize: "12px",
  color: colors.danger,
  lineHeight: "1.6",
  marginTop: "6px",
});

// ─── 면 ───────────────────────────────────────────────────────
export const cardCss = css({
  backgroundColor: colors.bgCard,
  border: "none",
  borderRadius: radii.lg,
});

export const sectionCss = css({
  marginTop: "40px",
});

export const sectionHeadCss = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "16px",
});

// ─── 입력 ─────────────────────────────────────────────────────
export const fieldLabelCss = css({
  display: "block",
  fontSize: "12px",
  fontWeight: "700",
  color: colors.textMuted,
  marginBottom: "6px",
});

export const inputCss = css({
  width: "100%",
  minHeight: "44px",
  backgroundColor: colors.bgSection,
  border: "1px solid transparent",
  borderRadius: radii.md,
  paddingInline: "14px",
  paddingBlock: "10px",
  color: colors.textPrimary,
  // 16px보다 작으면 아이폰 사파리가 입력칸을 누를 때 화면을 확대한다
  fontSize: "16px",
  fontFamily: "inherit",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
  appearance: "none",
  _placeholder: { color: colors.textDimmest },
  _focus: { borderColor: colors.brand, boxShadow: `0 0 0 3px ${BRAND_BG}` },
  "@sm": { fontSize: "14px" },
});

export const inputInvalidCss = css({ borderColor: colors.danger });

export const selectCss = css({
  width: "100%",
  minHeight: "44px",
  backgroundColor: colors.bgSection,
  border: "1px solid transparent",
  borderRadius: radii.md,
  paddingLeft: "14px",
  paddingRight: "34px",
  paddingBlock: "10px",
  color: colors.textPrimary,
  fontSize: "16px",
  fontFamily: "inherit",
  outline: "none",
  cursor: "pointer",
  appearance: "none",
  // 화살표: 잉크색 꺾쇠
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230F1115' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  _focus: { borderColor: colors.brand, boxShadow: `0 0 0 3px ${BRAND_BG}` },
  "@sm": { fontSize: "14px" },
});

export const textareaCss = css({
  width: "100%",
  backgroundColor: colors.bgSection,
  border: "1px solid transparent",
  borderRadius: radii.md,
  paddingInline: "14px",
  paddingBlock: "10px",
  color: colors.textPrimary,
  fontSize: "16px",
  fontFamily: "inherit",
  lineHeight: "1.6",
  outline: "none",
  resize: "vertical",
  _placeholder: { color: colors.textDimmest },
  _focus: { borderColor: colors.brand, boxShadow: `0 0 0 3px ${BRAND_BG}` },
  "@sm": { fontSize: "14px" },
});

export const formGridCss = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "18px",
  "@sm": { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
});

export const spanAllCss = css({ "@sm": { gridColumn: "1 / -1" } });

// ─── 버튼 ─────────────────────────────────────────────────────
const btnBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  minHeight: "44px",
  paddingInline: "18px",
  borderRadius: radii.btn,
  fontSize: "14px",
  fontWeight: "700",
  fontFamily: "inherit",
  whiteSpace: "nowrap",
  cursor: "pointer",
  transition: "background-color 0.15s, border-color 0.15s, color 0.15s",
  ":disabled": { opacity: "0.45", cursor: "not-allowed" },
};

export const primaryBtnCss = css({
  ...btnBase,
  backgroundColor: colors.brand,
  color: colors.onInk,
  border: `1px solid ${colors.brand}`,
  _hover: { backgroundColor: colors.brandHover, borderColor: colors.brandHover },
});

export const ghostBtnCss = css({
  ...btnBase,
  backgroundColor: "transparent",
  color: colors.textSecondary,
  border: `1px solid ${colors.borderStrong}`,
  _hover: { backgroundColor: colors.bgSection },
});

export const quietBtnCss = css({
  ...btnBase,
  backgroundColor: "transparent",
  color: colors.textMuted,
  border: "1px solid transparent",
  paddingInline: "10px",
  _hover: { backgroundColor: colors.bgSection, color: colors.textPrimary },
});

export const dangerGhostBtnCss = css({
  ...btnBase,
  backgroundColor: "transparent",
  color: colors.danger,
  border: `1px solid ${colors.dangerShadow}`,
  _hover: { backgroundColor: colors.dangerBg },
});

export const smallBtnCss = css({
  minHeight: "34px",
  paddingInline: "12px",
  fontSize: "13px",
});

export const iconBtnCss = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "36px",
  height: "36px",
  borderRadius: radii.md,
  backgroundColor: "transparent",
  color: colors.textFaint,
  border: "none",
  cursor: "pointer",
  flexShrink: "0",
  transition: "background-color 0.15s, color 0.15s",
  _hover: { backgroundColor: colors.bgSection, color: colors.textPrimary },
  ":disabled": { opacity: "0.35", cursor: "not-allowed" },
});

// ─── 알약 모양 표시 ───────────────────────────────────────────
const pillBase = {
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  paddingInline: "10px",
  paddingBlock: "4px",
  borderRadius: radii.pill,
  fontSize: "12px",
  fontWeight: "700",
  lineHeight: "1.4",
  whiteSpace: "nowrap",
  fontVariantNumeric: "tabular-nums",
};

export const pillCss = {
  neutral: css({ ...pillBase, backgroundColor: colors.bgSection, color: colors.textMuted }),
  success: css({ ...pillBase, backgroundColor: colors.successBg, color: colors.success }),
  warning: css({ ...pillBase, backgroundColor: colors.warningBg, color: colors.warning }),
  danger: css({ ...pillBase, backgroundColor: colors.dangerBg, color: colors.danger }),
  // 강조 알약: 라임 바탕에 잉크 글자
  brand: css({ ...pillBase, backgroundColor: colors.lime, color: colors.textPrimary }),
  outline: css({
    ...pillBase,
    backgroundColor: "transparent",
    color: colors.textMuted,
    boxShadow: `inset 0 0 0 1px ${colors.borderStrong}`,
  }),
};

// ─── 고르는 버튼 묶음 ─────────────────────────────────────────
export const segWrapCss = css({
  display: "inline-flex",
  padding: "3px",
  gap: "2px",
  backgroundColor: colors.bgCard,
  borderRadius: radii.pill,
  maxWidth: "100%",
  overflowX: "auto",
  scrollbarWidth: "none",
  "::-webkit-scrollbar": { display: "none" },
});

export const segBtnCss = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  minHeight: "36px",
  paddingInline: "14px",
  borderRadius: radii.pill,
  border: "none",
  background: "none",
  fontSize: "13px",
  fontWeight: "700",
  fontFamily: "inherit",
  color: colors.textMuted,
  whiteSpace: "nowrap",
  cursor: "pointer",
  transition: "color 0.15s, background-color 0.15s",
  _hover: { color: colors.textPrimary },
});

// 고른 것: 잉크로 채운다
export const segBtnOnCss = css({
  backgroundColor: colors.bgInk,
  color: colors.onInk,
  _hover: { color: colors.onInk },
});

export const segCountCss = css({
  fontSize: "12px",
  fontWeight: "700",
  color: "inherit",
  opacity: "0.7",
  fontVariantNumeric: "tabular-nums",
});

// ─── 그 밖 ────────────────────────────────────────────────────
export const avatarCss = css({
  width: "40px",
  height: "40px",
  borderRadius: radii.md,
  backgroundColor: colors.bgSection,
  color: colors.textPrimary,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "13px",
  fontWeight: "700",
  letterSpacing: "-0.02em",
  flexShrink: "0",
});

export const checkRowCss = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "13px",
  color: colors.textSecondary,
  cursor: "pointer",
  userSelect: "none",
  minHeight: "32px",
});

export const checkboxCss = css({
  width: "18px",
  height: "18px",
  accentColor: colors.brand,
  cursor: "pointer",
  flexShrink: "0",
});

export const dividerCss = css({
  border: "none",
  borderTop: `1px solid ${colors.borderSubtle}`,
  margin: "0",
});

export const popoverCss = css({
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderStrong}`,
  borderRadius: radii.md,
  boxShadow: shadows.card,
});
