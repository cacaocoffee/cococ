import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { css, cx } from "@/lib/css";

const spinnerCss = css({
  display: "inline-flex",
  marginRight: "6px",
  animation: "lb-spin 0.7s linear infinite",
});

// keyframes는 한 번만 주입
if (typeof document !== "undefined" && !document.getElementById("__lb_spin__")) {
  const style = document.createElement("style");
  style.id = "__lb_spin__";
  style.textContent =
    "@keyframes lb-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }";
  document.head.appendChild(style);
}

const loadingCss = css({
  opacity: "0.65",
  pointerEvents: "none",
  cursor: "progress",
});

interface LoadingButtonProps extends HTMLMotionProps<"button"> {
  loading?: boolean;
  spinnerSize?: number;
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  function LoadingButton(
    { loading, disabled, className, children, spinnerSize = 12, ...rest },
    ref,
  ) {
    return (
      <motion.button
        ref={ref}
        whileTap={loading || disabled ? undefined : { scale: 0.95 }}
        {...rest}
        disabled={loading || disabled}
        aria-busy={loading || undefined}
        className={cx(className, loading && loadingCss)}
      >
        {loading && (
          <span className={spinnerCss} aria-hidden="true">
            <Loader2 size={spinnerSize} />
          </span>
        )}
        {children}
      </motion.button>
    );
  },
);

export default LoadingButton;
