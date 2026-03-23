import { css } from "@/lib/css";
import { colors, shadows } from "@/lib/tokens";

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
  _placeholder: { color: colors.textFaint },
});

export const labelCss = css({
  fontSize: "12px",
  fontWeight: "700",
  color: colors.textSecondary,
  marginBottom: "8px",
  display: "block",
});

export const sublabelCss = css({
  fontSize: "11px",
  color: colors.textFaint,
  marginBottom: "12px",
  display: "block",
  lineHeight: "1.625",
});

export const radioBaseCss = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px",
  borderRadius: "0.75rem",
  border: `1px solid ${colors.borderMedium}`,
  cursor: "pointer",
  transition: "all 0.2s",
  fontSize: "14px",
  color: colors.textSecondary,
  _hover: { borderColor: "rgba(245,158,11,0.4)" },
});

export const radioActiveCss = css({
  borderColor: colors.brand,
  backgroundColor: "rgba(245,158,11,0.1)",
  color: "rgba(245,158,11,0.9)",
});

export const checkBtnBaseCss = css({
  paddingInline: "16px",
  paddingBlock: "8px",
  borderRadius: "0.75rem",
  border: `1px solid ${colors.borderMedium}`,
  fontSize: "14px",
  fontWeight: "700",
  transition: "all 0.2s",
  cursor: "pointer",
  background: "none",
  _hover: { borderColor: "rgba(245,158,11,0.4)" },
});

export const checkBtnActiveCss = css({
  borderColor: colors.brand,
  backgroundColor: "rgba(245,158,11,0.1)",
  color: "rgba(245,158,11,0.9)",
});

export const checkBtnInactiveCss = css({ color: colors.textMuted });

export const fieldGroupCss = css({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

export const gridCols2Css = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "20px",
  "@sm": { gridTemplateColumns: "repeat(2,1fr)" },
});

export const stepTitleCss = css({
  fontSize: "20px",
  fontWeight: "900",
  color: colors.textPrimary,
  marginBottom: "24px",
});

export const summaryBoxCss = css({
  backgroundColor: "rgba(0,0,0,0.2)",
  borderRadius: "1rem",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});
export const summaryRowCss = css({
  display: "flex",
  justifyContent: "space-between",
  fontSize: "14px",
});
export const summaryLabelCss = css({ color: colors.textFaint });
export const summaryValueCss = css({
  color: colors.textPrimary,
  fontWeight: "700",
});

export const privacyCss = css({
  backgroundColor: colors.bgSection,
  border: `1px solid ${colors.borderMedium}`,
  borderRadius: "1rem",
  padding: "20px",
});
export const privacyTitleCss = css({
  fontSize: "11px",
  fontWeight: "900",
  color: colors.brand,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginBottom: "12px",
});
export const privacyDescCss = css({
  color: colors.textMuted,
  fontSize: "12px",
  lineHeight: "1.625",
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
  borderRadius: "0.375rem",
  border: "2px solid",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s",
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
  fontWeight: "700",
});

export const warningBoxCss = css({
  backgroundColor: "rgba(245,158,11,0.05)",
  border: `1px solid rgba(245,158,11,0.2)`,
  borderRadius: "1rem",
  padding: "16px",
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
});

export const warningTextCss = css({
  color: "rgba(252,211,77,0.8)",
  fontSize: "12px",
  lineHeight: "1.625",
});
