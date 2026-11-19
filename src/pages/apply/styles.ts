import { css } from "@/lib/css";
import { colors, fonts } from "@/lib/tokens";

export const inputCss = css({
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderInput}`,
  borderRadius: "10px",
  paddingInline: "16px",
  paddingBlock: "13px",
  color: colors.textPrimary,
  fontSize: "15px",
  outline: "none",
  width: "100%",
  transition: "border-color 0.2s, box-shadow 0.2s",
  _focus: {
    borderColor: colors.brand,
    boxShadow: `0 0 0 3px rgba(194,96,63,0.18)`,
  },
  _placeholder: { color: colors.textDimmer },
});

export const inputErrorCss = css({
  borderColor: colors.danger,
  _focus: { borderColor: colors.danger, boxShadow: `0 0 0 3px rgba(181,57,42,0.18)` },
});

export const errorTextCss = css({
  fontFamily: fonts.mono,
  fontSize: "11px",
  color: colors.danger,
  fontWeight: "700",
  letterSpacing: "0.08em",
  marginTop: "6px",
  display: "flex",
  alignItems: "center",
  gap: "5px",
});

export const labelCss = css({
  fontFamily: fonts.mono,
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: colors.textMuted,
  marginBottom: "10px",
  display: "block",
});

export const sublabelCss = css({
  fontSize: "12px",
  color: colors.textFaint,
  marginBottom: "12px",
  display: "block",
  lineHeight: "1.6",
});

export const radioBaseCss = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "14px 16px",
  borderRadius: "10px",
  border: `1px solid ${colors.borderMedium}`,
  cursor: "pointer",
  transition: "all 0.18s",
  fontSize: "14px",
  color: colors.textSecondary,
  backgroundColor: colors.bgCard,
  _hover: { borderColor: "rgba(194,96,63,0.45)" },
});

export const radioActiveCss = css({
  borderColor: colors.brand,
  backgroundColor: "rgba(194,96,63,0.10)",
  color: colors.textPrimary,
});

export const checkBtnBaseCss = css({
  paddingInline: "16px",
  paddingBlock: "8px",
  borderRadius: "9999px",
  border: `1px solid ${colors.borderMedium}`,
  fontSize: "13px",
  fontWeight: "700",
  transition: "all 0.18s",
  cursor: "pointer",
  backgroundColor: colors.bgCard,
  _hover: { borderColor: "rgba(194,96,63,0.45)" },
});

export const checkBtnActiveCss = css({
  borderColor: colors.brand,
  backgroundColor: "rgba(194,96,63,0.10)",
  color: colors.textPrimary,
});

export const checkBtnInactiveCss = css({ color: colors.textMuted });

export const fieldGroupCss = css({
  display: "flex",
  flexDirection: "column",
  gap: "26px",
});

export const gridCols2Css = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "20px",
  "@sm": { gridTemplateColumns: "repeat(2,1fr)" },
});

export const stepTitleCss = css({
  fontFamily: fonts.display,
  fontSize: "28px",
  fontWeight: "500",
  color: colors.textPrimary,
  marginBottom: "28px",
  letterSpacing: "-0.012em",
  lineHeight: "1.16",
});

export const summaryBoxCss = css({
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderSubtle}`,
  borderRadius: "12px",
  padding: "22px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});
export const summaryRowCss = css({
  display: "flex",
  justifyContent: "space-between",
  fontSize: "14px",
});
export const summaryLabelCss = css({
  color: colors.textFaint,
  fontFamily: fonts.mono,
  fontSize: "11px",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
});
export const summaryValueCss = css({
  color: colors.textPrimary,
  fontWeight: "600",
});

export const privacyCss = css({
  backgroundColor: colors.bgSection,
  border: `1px solid ${colors.borderMedium}`,
  borderRadius: "12px",
  padding: "22px",
});
export const privacyTitleCss = css({
  fontFamily: fonts.mono,
  fontSize: "11px",
  fontWeight: "700",
  color: colors.brand,
  textTransform: "uppercase",
  letterSpacing: "0.18em",
  marginBottom: "12px",
});
export const privacyDescCss = css({
  color: colors.textMuted,
  fontSize: "13px",
  lineHeight: "1.7",
  marginBottom: "16px",
});
export const privacyCheckRowCss = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  cursor: "pointer",
});

export const checkboxBaseCss = css({
  width: "20px",
  height: "20px",
  borderRadius: "5px",
  border: "1.5px solid",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.18s",
  flexShrink: "0",
});
export const checkboxActiveCss = css({
  backgroundColor: colors.brand,
  borderColor: colors.brand,
});
export const checkboxInactiveCss = css({ borderColor: colors.textDimmer });
export const checkboxLabelCss = css({
  color: colors.textPrimary,
  fontSize: "14px",
  fontWeight: "600",
});

export const warningBoxCss = css({
  backgroundColor: "rgba(194,96,63,0.06)",
  border: `1px solid rgba(194,96,63,0.20)`,
  borderRadius: "12px",
  padding: "16px",
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
});

export const warningTextCss = css({
  color: colors.brand,
  fontSize: "13px",
  lineHeight: "1.65",
});
