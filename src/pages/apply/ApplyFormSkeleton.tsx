import { css } from "@/lib/css";
import { colors, shadows } from "@/lib/tokens";

const boxCss = css({
  backgroundColor: colors.bgCard,
  borderRadius: "1.5rem",
  overflow: "hidden",
  border: `1px solid ${colors.borderSubtle}`,
  maxWidth: "42rem",
  marginInline: "auto",
  marginBottom: "80px",
  boxShadow: shadows.card,
  padding: "32px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  minHeight: "520px",
});

const lineBaseCss = css({
  height: "16px",
  borderRadius: "0.5rem",
  backgroundColor: "rgba(255,255,255,0.06)",
  position: "relative",
  overflow: "hidden",
});

const lineTallCss = css({
  height: "44px",
  borderRadius: "0.75rem",
  backgroundColor: "rgba(255,255,255,0.06)",
  position: "relative",
  overflow: "hidden",
});

const lineHeadCss = css({
  height: "12px",
  width: "30%",
  borderRadius: "0.5rem",
  backgroundColor: "rgba(255,255,255,0.05)",
  marginBottom: "4px",
  position: "relative",
  overflow: "hidden",
});

const shimmerCss = css({
  position: "absolute",
  inset: "0",
  background:
    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.05) 60%, transparent 100%)",
  animation: "apply-skel 1.4s ease-in-out infinite",
  transform: "translateX(-100%)",
});

const styleTag = `
@keyframes apply-skel {
  from { transform: translateX(-100%); }
  to   { transform: translateX(100%); }
}
`;

export default function ApplyFormSkeleton() {
  return (
    <div className={boxCss}>
      <style dangerouslySetInnerHTML={{ __html: styleTag }} />
      <div className={lineBaseCss} style={{ width: "40%" }}>
        <div className={shimmerCss} />
      </div>
      <div style={{ marginTop: "8px" }}>
        <div className={lineHeadCss}>
          <div className={shimmerCss} />
        </div>
        <div className={lineTallCss}>
          <div className={shimmerCss} />
        </div>
      </div>
      <div>
        <div className={lineHeadCss}>
          <div className={shimmerCss} />
        </div>
        <div className={lineTallCss}>
          <div className={shimmerCss} />
        </div>
      </div>
      <div>
        <div className={lineHeadCss}>
          <div className={shimmerCss} />
        </div>
        <div className={lineTallCss}>
          <div className={shimmerCss} />
        </div>
      </div>
      <div>
        <div className={lineHeadCss}>
          <div className={shimmerCss} />
        </div>
        <div className={lineTallCss}>
          <div className={shimmerCss} />
        </div>
      </div>
    </div>
  );
}
