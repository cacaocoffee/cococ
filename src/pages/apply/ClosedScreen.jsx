import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { loadApplyPeriod } from "@/hooks/useApplications";
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
  const period = loadApplyPeriod();
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
        <h2 className={closedTitleCss}>현재 접수 기간이 아닙니다</h2>
        {period?.start && period?.end ? (
          <p className={closedDescCss}>
            접수 기간:{" "}
            <span className={closedAccentCss}>
              {new Date(period.start).toLocaleDateString("ko-KR")} ~{" "}
              {new Date(period.end).toLocaleDateString("ko-KR")}
            </span>
            <br />
            다음 모집 공고를 기다려 주세요.
          </p>
        ) : (
          <p className={closedDescCss}>
            현재 모집 기간이 아닙니다. 다음 공고를 기다려 주세요.
          </p>
        )}
      </motion.div>
    </div>
  );
}
