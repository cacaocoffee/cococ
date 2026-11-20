// 회비 탭 맨 위: 이번 달에 얼마나 걷혔는지와 지금 할 일.
import { ArrowRight, CircleCheck } from "lucide-react";
import { css, cx } from "@/lib/css";
import { colors, fonts, radii } from "@/lib/tokens";
import type { HrOverview } from "@/domain/hr/hr-dto";
import { formatMonthShort, formatWon } from "@/domain/hr/hr-format";
import { cardCss, ghostBtnCss, primaryBtnCss, smallBtnCss } from "../members/shared/styles";

const gridCss = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "12px",
  "@lg": { gridTemplateColumns: "minmax(0, 1.25fr) minmax(0, 1fr)" },
});
// 이번 달 요약은 큰 검정 카드: 흰 숫자와 라임 진행 막대
const mainCardCss = css({
  padding: "24px",
  backgroundColor: colors.bgInk,
  borderRadius: radii.xl,
  "@sm": { padding: "32px" },
});
const eyebrowCss = css({ fontSize: "13px", fontWeight: "700", color: colors.onInkMuted });
const bigRowCss = css({
  display: "flex",
  alignItems: "baseline",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "10px",
});
const bigNumCss = css({
  fontFamily: fonts.display,
  fontSize: "44px",
  fontWeight: "700",
  lineHeight: "1",
  letterSpacing: "-0.035em",
  color: colors.onInk,
  fontVariantNumeric: "tabular-nums",
  "@sm": { fontSize: "64px" },
});
const bigSubCss = css({ fontSize: "16px", color: colors.onInkMuted, fontVariantNumeric: "tabular-nums" });
const barTrackCss = css({
  height: "10px",
  borderRadius: radii.pill,
  backgroundColor: colors.onInkLine,
  overflow: "hidden",
  marginTop: "18px",
});
const barFillCss = css({
  height: "100%",
  borderRadius: radii.pill,
  backgroundColor: colors.lime,
  transition: "width 0.5s ease",
});
const captionCss = css({
  display: "flex",
  justifyContent: "space-between",
  gap: "8px",
  flexWrap: "wrap",
  marginTop: "10px",
  fontSize: "13px",
  color: colors.onInkMuted,
  fontVariantNumeric: "tabular-nums",
});
const tilesCss = css({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "12px",
  "@lg": { gridTemplateColumns: "1fr", gap: "0" },
});
const tileCss = css({
  padding: "14px",
  "@sm": { padding: "18px 22px" },
  "@lg": {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: "12px",
    borderBottom: `1px solid ${colors.borderFaint}`,
    ":last-child": { borderBottom: "none" },
  },
});
// 좁은 화면에서는 칸마다 카드, 넓은 화면에서는 카드 하나 안에 세 줄
const tileCardCss = css({
  backgroundColor: colors.bgCard,
  border: "none",
  borderRadius: radii.lg,
  "@lg": { border: "none", borderRadius: "0", backgroundColor: "transparent" },
});
const tilesCardCss = css({
  "@lg": {
    backgroundColor: colors.bgCard,
    border: "none",
    borderRadius: radii.lg,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
});
const tileLabelCss = css({ fontSize: "12px", color: colors.textFaint, "@sm": { fontSize: "13px" } });
const tileValueCss = css({
  fontFamily: fonts.display,
  fontSize: "24px",
  fontWeight: "700",
  letterSpacing: "-0.03em",
  color: colors.textPrimary,
  marginTop: "4px",
  fontVariantNumeric: "tabular-nums",
  whiteSpace: "nowrap",
  "@sm": { fontSize: "32px" },
  "@lg": { marginTop: "0" },
});
const tileUnitCss = css({ fontFamily: fonts.body, fontSize: "13px", color: colors.textFaint, marginLeft: "2px" });

const nextCss = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px 16px",
  flexWrap: "wrap",
  marginTop: "12px",
  padding: "14px 18px",
  borderRadius: radii.lg,
});
const nextTodoCss = css({ backgroundColor: colors.bgCard });
const nextDoneCss = css({ backgroundColor: colors.successBg });
const nextTextCss = css({
  flex: "1 1 220px",
  fontSize: "14px",
  fontWeight: "700",
  color: colors.textPrimary,
  lineHeight: "1.5",
  display: "flex",
  alignItems: "center",
  gap: "8px",
});
const nextSubCss = css({ display: "block", fontSize: "13px", fontWeight: "500", color: colors.textMuted });

interface SummarySectionProps {
  overview: HrOverview;
  onGoUnmatched: () => void;
  onGoUnpaid: () => void;
}

export default function SummarySection({ overview, onGoUnmatched, onGoUnpaid }: SummarySectionProps) {
  const { summary, today, settings, members, unmatched } = overview;
  const ratio = summary.expectedThisMonth > 0 ? summary.collectedThisMonth / summary.expectedThisMonth : 0;
  const percent = Math.round(ratio * 100);
  const lateCount = members.filter((m) => m.overdue > 0).length;
  const dueCount = members.filter((m) => m.due > 0).length;
  const daysLeft = settings.dueDay - today.day;

  let next: { done: boolean; title: string; sub?: string; action?: { label: string; onClick: () => void } };
  if (unmatched.length > 0) {
    next = {
      done: false,
      title: `연결 안 된 입금이 ${unmatched.length}건 있어요`,
      sub: "누가 낸 회비인지 연결해야 미납 명단이 맞아요.",
      action: { label: "연결하러 가기", onClick: onGoUnmatched },
    };
  } else if (lateCount > 0) {
    next = {
      done: false,
      title: `마감일이 지난 미납자가 ${lateCount}명이에요`,
      sub: "명단을 복사해 단체 대화방에 올릴 수 있어요.",
      action: { label: "미납자 보기", onClick: onGoUnpaid },
    };
  } else if (dueCount > 0) {
    next = {
      done: false,
      title: `이번 달 회비를 아직 안 낸 회원이 ${dueCount}명이에요`,
      sub: daysLeft > 0 ? `마감일까지 ${daysLeft}일 남았어요.` : "오늘이 마감일이에요.",
      action: { label: "미납자 보기", onClick: onGoUnpaid },
    };
  } else {
    next = { done: true, title: "지금 할 일이 없어요", sub: "모든 회원이 회비를 다 냈고, 연결 안 된 입금도 없어요." };
  }

  return (
    <section aria-label="이번 달 요약">
      <div className={gridCss}>
        <div className={cx(cardCss, mainCardCss)}>
          <p className={eyebrowCss}>{formatMonthShort(today.month)}에 들어온 회비</p>
          <div className={bigRowCss}>
            <span className={bigNumCss}>{formatWon(summary.collectedThisMonth)}</span>
            <span className={bigSubCss}>/ {formatWon(summary.expectedThisMonth)}</span>
          </div>
          <div
            className={barTrackCss}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.min(100, percent)}
          >
            <div className={barFillCss} style={{ width: `${Math.min(100, percent)}%` }} />
          </div>
          <div className={captionCss}>
            <span>이번 달에 걷을 회비의 {percent}%</span>
            <span>마감일 매달 {settings.dueDay}일</span>
          </div>
        </div>

        <div className={cx(tilesCss, tilesCardCss)}>
          <div className={cx(tileCss, tileCardCss)}>
            <p className={tileLabelCss}>완납</p>
            <p className={tileValueCss}>
              {summary.paidUpCount}
              <span className={tileUnitCss}>/ {summary.activeCount}명</span>
            </p>
          </div>
          <div className={cx(tileCss, tileCardCss)}>
            <p className={tileLabelCss}>미납 합계</p>
            <p className={tileValueCss} style={summary.totalDue > 0 ? { color: colors.danger } : undefined}>
              {summary.totalDue.toLocaleString("ko-KR")}
              <span className={tileUnitCss}>원</span>
            </p>
          </div>
          <div className={cx(tileCss, tileCardCss)}>
            <p className={tileLabelCss}>연결 안 된 입금</p>
            <p className={tileValueCss}>
              {unmatched.length}
              <span className={tileUnitCss}>건</span>
            </p>
          </div>
        </div>
      </div>

      <div className={cx(nextCss, next.done ? nextDoneCss : nextTodoCss)}>
        <p className={nextTextCss}>
          {next.done && <CircleCheck size={18} color={colors.success} style={{ flexShrink: 0 }} />}
          <span>
            {next.title}
            {next.sub && <span className={nextSubCss}>{next.sub}</span>}
          </span>
        </p>
        {next.action && (
          <button
            type="button"
            className={cx(unmatched.length > 0 ? primaryBtnCss : ghostBtnCss, smallBtnCss)}
            onClick={next.action.onClick}
          >
            {next.action.label} <ArrowRight size={14} />
          </button>
        )}
      </div>
    </section>
  );
}
