import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { subscribeInflight } from "@/lib/api";
import { css } from "@/lib/css";

const wrapCss = css({
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  height: "2px",
  zIndex: "9999",
  pointerEvents: "none",
  backgroundColor: "transparent",
});

const barCss = css({
  height: "100%",
  background:
    "linear-gradient(90deg, rgba(194,96,63,0.2) 0%, #C2603F 35%, #A94E30 65%, rgba(194,96,63,0.2) 100%)",
  boxShadow: "0 0 10px rgba(194,96,63,0.55)",
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
