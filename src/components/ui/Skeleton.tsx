import type { CSSProperties } from "react";
import { css } from "@/lib/css";

// shimmer keyframes — 한 번만 head 에 주입
if (typeof document !== "undefined" && !document.getElementById("__skeleton_shimmer__")) {
  const style = document.createElement("style");
  style.id = "__skeleton_shimmer__";
  style.textContent =
    "@keyframes sk-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }";
  document.head.appendChild(style);
}

const baseCss = css({
  background:
    "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.04) 100%)",
  backgroundSize: "200% 100%",
  animation: "sk-shimmer 1.4s ease-in-out infinite",
  borderRadius: "0.5rem",
  display: "block",
});

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: string;
  style?: CSSProperties;
  className?: string;
}

export default function Skeleton({
  width = "100%",
  height = "16px",
  radius,
  style,
  className,
}: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={`${baseCss} ${className ?? ""}`}
      style={{
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
    />
  );
}
