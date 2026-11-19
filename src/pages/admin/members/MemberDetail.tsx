// 회원 줄을 펼쳤을 때 보이는 부분: 달별 납부, 입금 내역, 독촉 문자 발송 기록.
import { Check, Pencil, Trash2 } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import { css, cx } from "@/lib/css";
import { colors, radii } from "@/lib/tokens";
import type { HrMember, HrSettings, HrToday, MonthState } from "@/domain/hr/hr-dto";
import {
  formatDayTime,
  formatMonth,
  formatMonthShort,
  formatWon,
  reminderKindLabel,
} from "@/domain/hr/hr-format";
import { useHrMember } from "@/domain/hr/hr-query-options";
import { dangerGhostBtnCss, ghostBtnCss, numCss, pillCss, smallBtnCss } from "./shared/styles";
import { ErrorState } from "./shared/ui";

const wrapCss = css({
  borderTop: `1px solid ${colors.borderSubtle}`,
  paddingInline: "16px",
  paddingTop: "20px",
  paddingBottom: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  "@md": { paddingInline: "24px", paddingLeft: "70px" },
});
const factsCss = css({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "16px 20px",
  "@md": { gridTemplateColumns: "repeat(4, minmax(0, 1fr))" },
});
const factLabelCss = css({ fontSize: "12px", color: colors.textFaint, marginBottom: "3px" });
const factValueCss = css({
  display: "flex",
  alignItems: "baseline",
  flexWrap: "wrap",
  fontSize: "15px",
  fontWeight: "700",
  color: colors.textPrimary,
  fontVariantNumeric: "tabular-nums",
});
const factSubCss = css({ fontSize: "12px", fontWeight: "500", color: colors.textFaint, marginLeft: "5px" });
const blockTitleCss = css({
  fontSize: "13px",
  fontWeight: "700",
  color: colors.textSecondary,
  marginBottom: "10px",
  display: "flex",
  alignItems: "baseline",
  gap: "8px",
  flexWrap: "wrap",
});
const blockNoteCss = css({ fontSize: "12px", fontWeight: "500", color: colors.textFaint });
const stripCss = css({ display: "flex", flexWrap: "wrap", gap: "6px" });
const cellCss = css({
  width: "52px",
  paddingBlock: "7px",
  borderRadius: radii.sm,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "2px",
  fontSize: "12px",
  fontWeight: "700",
  fontVariantNumeric: "tabular-nums",
});
const cellStateCss = css({ fontSize: "11px", fontWeight: "600", minHeight: "15px", display: "flex", alignItems: "center" });
const CELL: Record<MonthState | "waiting", string> = {
  paid: css({ backgroundColor: colors.successBg, color: colors.success }),
  partial: css({ backgroundColor: colors.warningBg, color: "#8E621B" }),
  unpaid: css({ backgroundColor: colors.dangerBg, color: colors.danger }),
  // 이번 달 회비인데 아직 마감일 전
  waiting: css({ boxShadow: `inset 0 0 0 1px ${colors.borderStrong}`, color: colors.textMuted }),
};
const CELL_TEXT: Record<MonthState | "waiting", string> = {
  paid: "",
  partial: "일부",
  unpaid: "미납",
  waiting: "마감 전",
};
const yearMarkCss = css({
  alignSelf: "center",
  fontSize: "12px",
  fontWeight: "600",
  color: colors.textDimmer,
  paddingInline: "4px",
  fontVariantNumeric: "tabular-nums",
});
const twoColCss = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "24px",
  "@md": { gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "32px" },
});
const histRowCss = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  gap: "12px",
  paddingBlock: "9px",
  borderBottom: `1px solid ${colors.borderFaint}`,
  fontSize: "13px",
  ":last-child": { borderBottom: "none" },
});
const histMainCss = css({ color: colors.textSecondary, minWidth: "0" });
const histSubCss = css({ color: colors.textFaint, fontSize: "12px", marginLeft: "8px" });
const histRightCss = css({
  color: colors.textPrimary,
  fontWeight: "700",
  whiteSpace: "nowrap",
  fontVariantNumeric: "tabular-nums",
});
const emptyLineCss = css({ fontSize: "13px", color: colors.textFaint, lineHeight: "1.6" });
const memoCss = css({
  fontSize: "13px",
  color: colors.textSecondary,
  lineHeight: "1.7",
  whiteSpace: "pre-wrap",
});
const actionsCss = css({ display: "flex", gap: "8px", flexWrap: "wrap" });

interface MemberDetailProps {
  member: HrMember;
  today: HrToday;
  settings: HrSettings;
  onEdit: () => void;
  onDelete: (linkedDeposits: number | null) => void;
}

export default function MemberDetail({ member, today, settings, onEdit, onDelete }: MemberDetailProps) {
  const { data, isPending, isError, refetch, isRefetching } = useHrMember(member.id);

  const beforeDeadline = today.day <= settings.dueDay;

  return (
    <div className={wrapCss}>
      <div className={factsCss}>
        <div>
          <p className={factLabelCss}>월 회비</p>
          <p className={factValueCss}>
            {formatWon(member.fee)}
            <span className={factSubCss}>{member.monthlyFee === null ? "기본" : "따로 정함"}</span>
          </p>
        </div>
        <div>
          <p className={factLabelCss}>가입월</p>
          <p className={factValueCss}>
            {formatMonth(member.joinedMonth)}
          </p>
        </div>
        <div>
          <p className={factLabelCss}>낸 금액 / 부과액</p>
          <p className={factValueCss}>
            {formatWon(member.paid)}
            <span className={cx(factSubCss, css({ whiteSpace: "nowrap" }))}>/ {formatWon(member.charged)}</span>
          </p>
        </div>
        <div>
          <p className={factLabelCss}>{member.stoppedMonth ? "회비를 부과하지 않는 달" : "면제액"}</p>
          <p className={factValueCss}>
            {member.stoppedMonth ? `${formatMonth(member.stoppedMonth)}부터` : formatWon(member.waivedAmount)}
            {member.stoppedMonth && member.waivedAmount > 0 && (
              <span className={factSubCss}>면제액 {formatWon(member.waivedAmount)}</span>
            )}
          </p>
        </div>
      </div>

      {isPending ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} aria-busy="true">
          <Skeleton width={120} height={13} />
          <Skeleton width="70%" height={48} />
          <Skeleton width="90%" height={13} />
          <Skeleton width="60%" height={13} />
        </div>
      ) : isError || !data ? (
        <ErrorState
          title="납부 기록을 불러오지 못했어요"
          onRetry={() => void refetch()}
          retrying={isRefetching}
        />
      ) : (
        <>
          <div>
            <p className={blockTitleCss}>
              달별 납부
              <span className={blockNoteCss}>낸 돈을 오래된 달부터 채워서 보여 줘요.</span>
            </p>
            {data.months.length === 0 ? (
              <p className={emptyLineCss}>
                아직 회비가 부과된 달이 없어요. {formatMonth(member.joinedMonth)}부터 부과해요.
              </p>
            ) : (
              <div className={stripCss}>
                {data.months.map(({ month, state }, i) => {
                  const kind =
                    state === "unpaid" && month === today.month && beforeDeadline ? "waiting" : state;
                  const newYear = i === 0 || month.slice(0, 4) !== data.months[i - 1].month.slice(0, 4);
                  return (
                    <span key={month} style={{ display: "contents" }}>
                      {newYear && <span className={yearMarkCss}>{month.slice(0, 4)}</span>}
                      <span
                        className={cx(cellCss, CELL[kind])}
                        title={`${formatMonth(month)} · ${kind === "paid" ? "완납" : CELL_TEXT[kind]}`}
                      >
                        {formatMonthShort(month)}
                        <span className={cellStateCss}>
                          {kind === "paid" ? <Check size={13} strokeWidth={3} aria-label="완납" /> : CELL_TEXT[kind]}
                        </span>
                      </span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div className={twoColCss}>
            <div>
              <p className={blockTitleCss}>
                입금 내역
                <span className={blockNoteCss}>{data.deposits.length}건</span>
              </p>
              {data.deposits.length === 0 ? (
                <p className={emptyLineCss}>이 회원에게 연결된 입금이 아직 없어요.</p>
              ) : (
                <div>
                  {data.deposits.map((d) => (
                    <div key={d.id} className={histRowCss}>
                      <span className={histMainCss}>
                        {formatDayTime(d.depositedAt)}
                        {d.depositorName && d.depositorName !== member.name && (
                          <span className={histSubCss}>{d.depositorName}</span>
                        )}
                        {d.ignored && (
                          <span className={pillCss.neutral} style={{ marginLeft: "8px" }}>회비 아님</span>
                        )}
                      </span>
                      <span className={histRightCss} style={d.ignored ? { color: colors.textDimmer } : undefined}>
                        {formatWon(d.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className={blockTitleCss}>독촉 문자 발송 기록</p>
              {data.reminders.length === 0 ? (
                <p className={emptyLineCss}>이 회원에게 보낸 독촉 문자가 없어요.</p>
              ) : (
                <div>
                  {data.reminders.map((r) => (
                    <div key={r.id} className={histRowCss} title={r.body || undefined}>
                      <span className={histMainCss}>
                        {formatDayTime(r.sentAt)}
                        <span className={histSubCss}>{formatMonthShort(r.month)} 회비</span>
                        {r.testMode && (
                          <span className={pillCss.neutral} style={{ marginLeft: "8px" }}>테스트</span>
                        )}
                      </span>
                      <span className={cx(numCss, css({ color: colors.textMuted, whiteSpace: "nowrap" }))}>
                        {reminderKindLabel(r.kind)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {(member.memo || member.depositNames.length > 0) && (
        <div className={twoColCss}>
          {member.memo && (
            <div>
              <p className={blockTitleCss}>메모</p>
              <p className={memoCss}>{member.memo}</p>
            </div>
          )}
          {member.depositNames.length > 0 && (
            <div>
              <p className={blockTitleCss}>다른 입금자명</p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {member.depositNames.map((n) => (
                  <span key={n} className={pillCss.outline}>{n}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className={actionsCss}>
        <button type="button" className={cx(ghostBtnCss, smallBtnCss)} onClick={onEdit}>
          <Pencil size={13} /> 정보 수정
        </button>
        <button
          type="button"
          className={cx(dangerGhostBtnCss, smallBtnCss)}
          onClick={() => onDelete(data ? data.deposits.length : null)}
        >
          <Trash2 size={13} /> 삭제
        </button>
      </div>
    </div>
  );
}
