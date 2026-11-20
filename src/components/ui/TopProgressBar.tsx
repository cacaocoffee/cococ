import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { subscribeInflight } from "@/lib/api";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";

const wrapCss = css({
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  height: "3px",
  zIndex: "9999",
  pointerEvents: "none",
  backgroundColor: "transparent",
});

const barCss = css({
  height: "100%",
  // 라임 막대 (그라데이션·빛 번짐 없음)
  backgroundColor: colors.lime,
  transformOrigin: "left center",
  transition: "transform 0.25s ease-out, opacity 0.3s ease-out",
});

export default function TopProgressBar() {
  const [count, setCount] = useState(0);
  const isRouterLoading = useRouterState({
    select: (s) => s.status === "pending" || s.isLoading,
  });

  useEffect(() => subscribeInflight(setCount), []);

  const active = count > 0 || isRouterLoading;
  const progress = active ? Math.min(0.92, 0.55 + count * 0.12) : 1;

  return (
    <div className={wrapCss} aria-hidden="true">
      <div
        className={barCss}
        style={{
          opacity: active ? 1 : 0,
          transform: `scaleX(${progress})`,
        }}
      />
    </div>
  );
}
