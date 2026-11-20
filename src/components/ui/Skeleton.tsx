import type { CSSProperties } from "react";
import { css } from "@/lib/css";

if (typeof document !== "undefined" && !document.getElementById("__skeleton_shimmer__")) {
  const style = document.createElement("style");
  style.id = "__skeleton_shimmer__";
  style.textContent =
    "@keyframes sk-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }";
  document.head.appendChild(style);
}

const baseCss = css({
  background:
    "linear-gradient(90deg, rgba(15,17,21,0.05) 0%, rgba(15,17,21,0.12) 50%, rgba(15,17,21,0.05) 100%)",
  backgroundSize: "200% 100%",
  animation: "sk-shimmer 1.6s ease-in-out infinite",
  borderRadius: "10px",
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
