import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";

const wrapCss = css({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginTop: "16px",
});

const cardCss = css({
  height: "84px",
  borderRadius: "20px",
  backgroundColor: colors.bgCard,
  border: "none",
  position: "relative",
  overflow: "hidden",
});

const formBlockCss = css({
  height: "60px",
  borderRadius: "14px",
  backgroundColor: colors.bgCard,
  border: "none",
  position: "relative",
  overflow: "hidden",
});

const lineCss = css({
  height: "16px",
  borderRadius: "10px",
  backgroundColor: colors.bgSection,
  position: "relative",
  overflow: "hidden",
});

const shimmerCss = css({
  position: "absolute",
  inset: "0",
  background:
    "linear-gradient(90deg, transparent 0%, rgba(15,17,21,0.04) 40%, rgba(15,17,21,0.07) 50%, rgba(15,17,21,0.04) 60%, transparent 100%)",
  animation: "tab-skel 1.4s ease-in-out infinite",
  transform: "translateX(-100%)",
});

const styleTag = `
@keyframes tab-skel {
  from { transform: translateX(-100%); }
  to   { transform: translateX(100%); }
}
`;

interface Props {
  variant?: "cards" | "form" | "list";
  count?: number;
}

export default function TabSkeleton({ variant = "cards", count = 4 }: Props) {
  const blockClass =
    variant === "form" ? formBlockCss : variant === "list" ? lineCss : cardCss;
  return (
    <div className={wrapCss}>
      <style dangerouslySetInnerHTML={{ __html: styleTag }} />
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={blockClass}>
          <div className={shimmerCss} />
        </div>
      ))}
    </div>
  );
}
