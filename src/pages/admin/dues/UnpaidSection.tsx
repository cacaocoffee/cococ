// 미납자 명단: 마감일이 지난 미납이 큰 순서로 보여 주고, 단체 대화방에 붙일 명단을 복사한다.
import { useMemo } from "react";
import { Copy, MessageSquareText, PartyPopper, Phone } from "lucide-react";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";
import type { HrMember, HrOverview } from "@/domain/hr/hr-dto";
import {
  STATUS_LABEL,
  formatDay,
  formatMonthShort,
  formatWon,
  reminderKindLabel,
} from "@/domain/hr/hr-format";
import DuesPill from "../members/shared/DuesPill";
import {
  cardCss,
  ghostBtnCss,
  pillCss,
  sectionDescCss,
  sectionHeadCss,
  sectionTitleCss,
} from "../members/shared/styles";
import { EmptyState } from "../members/shared/ui";
import type { Notify } from "../members/shared/ui";

const rowCss = css({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "8px 16px",
  flexWrap: "wrap",
  padding: "16px",
  borderBottom: `1px solid ${colors.borderFaint}`,
  ":last-child": { borderBottom: "none" },
  "@md": { paddingInline: "22px", alignItems: "center" },
});
const mainCss = css({ flex: "1 1 120px", minWidth: "0" });
const nameLineCss = css({ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" });
const nameCss = css({ fontSize: "15px", fontWeight: "700", color: colors.textPrimary });
const genCss = css({ fontSize: "12px", fontWeight: "600", color: colors.textFaint });
const metaCss = css({
  display: "flex",
  alignItems: "center",
  gap: "4px 12px",
  flexWrap: "wrap",
  marginTop: "6px",
  fontSize: "12px",
  color: colors.textFaint,
  fontVariantNumeric: "tabular-nums",
});
const metaItemCss = css({ display: "inline-flex", alignItems: "center", gap: "4px" });
const phoneLinkCss = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  color: colors.textMuted,
  textDecoration: "none",
  _hover: { color: colors.brand, textDecoration: "underline" },
});
const rightCss = css({ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", marginLeft: "auto" });
const lateNoteCss = css({ fontSize: "12px", color: colors.textFaint, fontVariantNumeric: "tabular-nums" });

/** 단체 대화방에 붙일 글 */
function buildListText(overview: HrOverview, unpaid: HrMember[]): string {
  const { today, settings } = overview;
  const [, month, day] = today.date.split("-").map(Number);
  const total = unpaid.reduce((sum, m) => sum + m.due, 0);
  const lines = [
    `[${settings.clubName}] 회비 미납 명단 (${month}월 ${day}일 기준)`,
    "",
    ...unpaid.map((m) => `${m.name} ${formatWon(m.due)}`),
    "",
    `${unpaid.length}명, 합계 ${formatWon(total)}`,
  ];
  if (settings.accountInfo.trim()) lines.push(`입금 계좌: ${settings.accountInfo.trim()}`);
  return lines.join("\n");
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // 클립보드 권한이 없는 브라우저에서는 보이지 않는 입력칸에 넣고 복사한다
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  }
}

interface UnpaidSectionProps {
  overview: HrOverview;
  notify: Notify;
}

export default function UnpaidSection({ overview, notify }: UnpaidSectionProps) {
  const { members, today, settings } = overview;
  const unpaid = useMemo(
    () => members.filter((m) => m.due > 0).sort((a, b) => b.overdue - a.overdue || b.due - a.due),
    [members],
  );
  const lateCount = unpaid.filter((m) => m.overdue > 0).length;

  const handleCopy = async () => {
    const ok = await copyText(buildListText(overview, unpaid));
    if (ok) notify(`미납자 ${unpaid.length}명의 명단을 복사했어요. 대화방에 붙여 넣으세요.`);
    else notify("복사하지 못했어요. 브라우저에서 복사를 허용해 주세요.", "error");
  };

  return (
    <section aria-label="미납자">
      <div className={sectionHeadCss}>
        <div>
          <h3 className={sectionTitleCss}>미납자 {unpaid.length}명</h3>
          <p className={sectionDescCss}>
            {unpaid.length === 0
              ? "지금까지 부과된 회비를 모두 걷었어요."
              : lateCount === unpaid.length
                ? "모두 마감일이 지났어요. 독촉 문자는 총무 휴대폰의 회비 앱이 정해진 날에 보내요."
                : `마감일이 지난 사람이 ${lateCount}명이에요. 독촉 문자는 총무 휴대폰의 회비 앱이 정해진 날에 보내요.`}
          </p>
        </div>
        {unpaid.length > 0 && (
          <button type="button" className={ghostBtnCss} onClick={() => void handleCopy()}>
            <Copy size={14} /> 명단 복사
          </button>
        )}
      </div>

      {unpaid.length === 0 ? (
        <div className={cardCss}>
          <EmptyState icon={<PartyPopper size={34} />} title="미납자가 없어요" />
        </div>
      ) : (
        <div className={cardCss}>
          {unpaid.map((m) => (
            <div key={m.id} className={rowCss}>
              <div className={mainCss}>
                <div className={nameLineCss}>
                  <span className={nameCss}>{m.name}</span>
                  {m.generation > 0 && <span className={genCss}>{m.generation}기</span>}
                  {m.status !== "active" && <span className={pillCss.neutral}>{STATUS_LABEL[m.status]}</span>}
                </div>
                <div className={metaCss}>
                  <span>{m.lastDepositAt ? `마지막 입금 ${formatDay(m.lastDepositAt)}` : "입금한 적 없음"}</span>
                  {m.phone && (
                    <a className={phoneLinkCss} href={`tel:${m.phone.replace(/-/g, "")}`}>
                      <Phone size={11} /> {m.phone}
                    </a>
                  )}
                  {m.remindedKinds.length > 0 && (
                    <span className={metaItemCss} title={`${formatMonthShort(today.month)} 회비로 보낸 독촉 문자`}>
                      <MessageSquareText size={12} />
                      독촉 문자: {m.remindedKinds.map(reminderKindLabel).join(", ")}
                    </span>
                  )}
                </div>
              </div>
              <div className={rightCss}>
                <DuesPill member={m} />
                {m.overdue === 0 && (
                  <span className={lateNoteCss}>마감일 {settings.dueDay}일 전이에요</span>
                )}
                {m.overdue > 0 && m.overdue < m.due && (
                  <span className={lateNoteCss}>이 중 {formatWon(m.overdue)}은 마감일이 지났어요</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
