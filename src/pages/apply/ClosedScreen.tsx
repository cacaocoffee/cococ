import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { applyService } from "@/domain/apply/apply-service";
import type { ApplyPeriod } from "@/domain/apply/apply-dto";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";

const closedWrapCss = css({
  minHeight: "60vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingInline: "24px",
});

const closedInnerCss = css({ textAlign: "center", maxWidth: "28rem" });

const closedIconWrapCss = css({
  width: "80px",
  height: "80px",
  backgroundColor: "rgba(107,114,128,0.1)",
  color: colors.textFaint,
  borderRadius: "9999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginInline: "auto",
  marginBottom: "24px",
});

const closedTitleCss = css({
  fontSize: "30px",
  fontWeight: "900",
  color: colors.textPrimary,
  marginBottom: "12px",
});
const closedDescCss = css({
  color: colors.textMuted,
  fontSize: "14px",
  lineHeight: "1.625",
});
const closedAccentCss = css({ color: colors.brand, fontWeight: "700" });

export default function ClosedScreen() {
  const [period, setPeriod] = useState<ApplyPeriod | null>(null);

  useEffect(() => {
    let cancelled = false;
    void applyService.loadApplyPeriod().then((p) => {
      if (!cancelled) setPeriod(p);
    });
    return () => { cancelled = true; };
  }, []);

  const generation = period?.generation;
  const title = generation
    ? `${generation}기 모집은 종료되었습니다`
    : "모집은 종료되었습니다";

  return (
    <div className={closedWrapCss}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className={closedInnerCss}
      >
        <div className={closedIconWrapCss}>
          <Lock size={36} />
        </div>
        <h2 className={closedTitleCss}>{title}</h2>
        <p className={closedDescCss}>
          다음 기회에 만나요!
          {period?.start && period?.end && (
            <>
              <br />
              <span style={{ fontSize: "12px", color: colors.textDimmer }}>
                접수 기간이었던 일자:{" "}
                <span className={closedAccentCss}>
                  {new Date(period.start).toLocaleDateString("ko-KR")} ~{" "}
                  {new Date(period.end).toLocaleDateString("ko-KR")}
                </span>
              </span>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
}
