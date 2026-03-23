import { css } from "../../lib/css";
import { colors } from "../../lib/tokens";

// ─── Form ─────────────────────────────────────────────────────
export const inputCss = css({
  backgroundColor: "rgba(0,0,0,0.3)",
  border: `1px solid ${colors.borderInput}`,
  borderRadius: "0.75rem",
  paddingInline: "16px",
  paddingBlock: "12px",
  color: colors.textPrimary,
  fontSize: "14px",
  outline: "none",
  width: "100%",
  transition: "border-color 0.2s",
  _focus: { borderColor: colors.brand },
});

export const inputErrorCss = css({ borderColor: colors.danger });

export const labelCss = css({
  fontSize: "11px",
  fontWeight: "700",
  color: colors.textMuted,
  marginBottom: "6px",
  display: "block",
});

export const formCardCss = css({
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderSubtle}`,
  borderRadius: "1rem",
  padding: "28px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
});

export const formGrid2Css = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "20px",
  "@md": { gridTemplateColumns: "repeat(2,1fr)" },
});

export const formBtnRowCss = css({
  display: "flex",
  gap: "12px",
  justifyContent: "flex-end",
});

export const cancelBtnCss = css({
  paddingInline: "20px",
  paddingBlock: "10px",
  borderRadius: "0.75rem",
  backgroundColor: "rgba(255,255,255,0.05)",
  color: colors.textMuted,
  fontSize: "14px",
  fontWeight: "700",
  border: "none",
  cursor: "pointer",
  _hover: { color: colors.textPrimary },
});

export const saveBtnCss = css({
  paddingInline: "28px",
  paddingBlock: "10px",
  borderRadius: "0.75rem",
  backgroundColor: colors.brand,
  color: colors.bgPage,
  fontWeight: "900",
  fontSize: "14px",
  border: "none",
  cursor: "pointer",
  _hover: { backgroundColor: colors.brandHover },
});

// ─── Tab layout ───────────────────────────────────────────────
export const tabHeaderRowCss = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
  flexWrap: "wrap",
  gap: "12px",
});

export const tabTitleCss = css({
  fontSize: "20px",
  fontWeight: "900",
  color: colors.textPrimary,
});

export const newBtnCss = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  backgroundColor: colors.brand,
  color: colors.bgPage,
  paddingInline: "20px",
  paddingBlock: "10px",
  borderRadius: "0.75rem",
  fontWeight: "900",
  fontSize: "14px",
  border: "none",
  cursor: "pointer",
  _hover: { backgroundColor: colors.brandHover },
});

export const subSectionLabelCss = css({
  fontSize: "11px",
  fontWeight: "900",
  color: colors.brand,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginBottom: "16px",
});

export const listCss = css({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

// ─── Item card (archive / magazine list row) ──────────────────
export const itemCardCss = css({
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderSubtle}`,
  borderRadius: "1rem",
  padding: "16px",
  display: "flex",
  alignItems: "center",
  gap: "16px",
});

export const itemThumbWrapCss = css({
  width: "64px",
  height: "64px",
  borderRadius: "0.75rem",
  overflow: "hidden",
  flexShrink: "0",
  backgroundColor: colors.bgSection,
});

export const itemThumbCss = css({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});
export const itemBodyCss = css({ flex: "1 1 0%", minWidth: "0" });
export const itemCatCss = css({
  color: colors.brand,
  fontSize: "10px",
  fontWeight: "900",
  textTransform: "uppercase",
});
export const itemTitleCss = css({
  color: colors.textPrimary,
  fontWeight: "700",
  fontSize: "14px",
  marginTop: "2px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});
export const itemMetaCss = css({ color: colors.textFaint, fontSize: "12px" });
export const itemActionsCss = css({
  display: "flex",
  gap: "8px",
  flexShrink: "0",
});

export const editBtnCss = css({
  width: "36px",
  height: "36px",
  borderRadius: "0.75rem",
  backgroundColor: "rgba(255,255,255,0.05)",
  color: colors.textMuted,
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  _hover: { color: colors.textPrimary },
});

export const deleteBtnCss = css({
  width: "36px",
  height: "36px",
  borderRadius: "0.75rem",
  backgroundColor: colors.dangerBg,
  color: colors.dangerMuted,
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  _hover: { backgroundColor: "rgba(239,68,68,0.2)" },
});

// ─── Search bar ───────────────────────────────────────────────
export const searchBarWrapCss = css({
  position: "relative",
  marginBottom: "16px",
});

export const searchBarInputCss = css({
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderLight}`,
  color: colors.textPrimary,
  fontSize: "12px",
  paddingBlock: "8px",
  paddingLeft: "36px",
  paddingRight: "16px",
  borderRadius: "0.5rem",
  outline: "none",
  width: "224px",
  transition: "border-color 0.2s",
  _focus: { borderColor: colors.brand },
});

export const searchBarIconCss = css({
  position: "absolute",
  left: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  color: colors.textDimmer,
  pointerEvents: "none",
});

// ─── Empty state ──────────────────────────────────────────────
export const emptyStateCss = css({
  textAlign: "center",
  paddingBlock: "64px",
  color: colors.textDimmer,
});
export const emptyIconCss = css({
  marginInline: "auto",
  marginBottom: "12px",
  opacity: "0.3",
});
export const emptyTextCss = css({ fontWeight: "700", fontSize: "14px" });
