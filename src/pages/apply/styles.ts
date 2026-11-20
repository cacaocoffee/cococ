import { css } from "@/lib/css";
import { colors, fonts } from "@/lib/tokens";

export const inputCss = css({
  // 흰 카드 안의 입력칸: 회색 면, 테두리 없음. 누르면 잉크 테두리
  backgroundColor: colors.bgSection,
  border: "1px solid transparent",
  borderRadius: "14px",
  paddingInline: "16px",
  paddingBlock: "13px",
  color: colors.textPrimary,
  fontSize: "16px",
  outline: "none",
  width: "100%",
  transition: "border-color 0.2s",
  _focus: { borderColor: colors.textPrimary },
  _placeholder: { color: colors.textDimmer },
});

export const inputErrorCss = css({
  borderColor: colors.danger,
  backgroundColor: colors.dangerBg,
  _focus: { borderColor: colors.danger },
});

export const errorTextCss = css({
  fontSize: "13px",
  color: colors.danger,
  fontWeight: "700",
  marginTop: "6px",
  display: "flex",
  alignItems: "center",
  gap: "5px",
});

export const labelCss = css({
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0",
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
  borderRadius: "14px",
  border: "1px solid transparent",
  cursor: "pointer",
  transition: "all 0.18s",
  fontSize: "14px",
  fontWeight: "700",
  color: colors.textSecondary,
  backgroundColor: colors.bgSection,
  _hover: { backgroundColor: colors.bgPressed },
});

// 고른 것은 잉크로 채운다
export const radioActiveCss = css({
  borderColor: colors.bgInk,
  backgroundColor: colors.bgInk,
  color: colors.onInk,
  _hover: { backgroundColor: colors.bgInk },
});

export const checkBtnBaseCss = css({
  paddingInline: "16px",
  paddingBlock: "8px",
  borderRadius: "9999px",
  border: "1px solid transparent",
  fontSize: "13px",
  fontWeight: "700",
  transition: "all 0.18s",
  cursor: "pointer",
  backgroundColor: colors.bgSection,
  _hover: { backgroundColor: colors.bgPressed },
});

export const checkBtnActiveCss = css({
  backgroundColor: colors.bgInk,
  color: colors.onInk,
  _hover: { backgroundColor: colors.bgInk },
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
  fontWeight: "700",
  color: colors.textPrimary,
  marginBottom: "28px",
  letterSpacing: "-0.012em",
  lineHeight: "1.16",
});

export const summaryBoxCss = css({
  backgroundColor: colors.bgCard,
  border: "none",
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
  fontSize: "12px",
  letterSpacing: "0",
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
  fontSize: "12px",
  fontWeight: "700",
  color: colors.textMuted,
  letterSpacing: "0",
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
  backgroundColor: colors.warningBg,
  border: "none",
  borderRadius: "16px",
  padding: "16px",
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
});

export const warningTextCss = css({
  color: colors.warning,
  fontSize: "13px",
  lineHeight: "1.65",
});
