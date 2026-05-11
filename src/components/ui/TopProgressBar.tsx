import { useEffect, useState } from "react";
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
    "linear-gradient(90deg, rgba(245,158,11,0.0), rgba(245,158,11,0.95) 35%, #fbbf24 65%, rgba(245,158,11,0.0))",
  boxShadow: "0 0 8px rgba(245,158,11,0.6)",
  transformOrigin: "left center",
  transition: "transform 0.25s ease-out, opacity 0.3s ease-out",
});

export default function TopProgressBar() {
  const [count, setCount] = useState(0);

  useEffect(() => subscribeInflight(setCount), []);

  const active = count > 0;
  // 인플라이트 1개=70%, 그 이상은 90%까지 천천히 — 끝나면 100% 잠깐, 그 후 사라짐
  const progress = active ? Math.min(0.9, 0.5 + count * 0.12) : 1;

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
