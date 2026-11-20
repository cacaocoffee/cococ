// 회원 한 명의 회비 상태를 한 줄로 보여 준다: 완납 / 미납 80,000원 · 2개월 / 선납 40,000원
import type { HrMember } from "@/domain/hr/hr-dto";
import { formatWon } from "@/domain/hr/hr-format";
import { css } from "@/lib/css";
import { pillCss } from "./styles";

type DuesFields = Pick<HrMember, "due" | "overdue" | "credit" | "unpaidMonths" | "chargedMonths">;

export function duesText(m: DuesFields): string {
  if (m.due > 0) {
    return m.unpaidMonths > 0
      ? `미납 ${formatWon(m.due)} · ${m.unpaidMonths}개월`
      : `미납 ${formatWon(m.due)}`;
  }
  if (m.credit > 0) return `선납 ${formatWon(m.credit)}`;
  // 아직 회비가 한 번도 부과되지 않은 회원(가입월이 다음 달 이후)은 완납이라고 하지 않는다
  if (m.chargedMonths === 0) return "부과 전";
  return "완납";
}

const monthsOnWideCss = css({ display: "none", "@md": { display: "inline" } });

interface DuesPillProps {
  member: DuesFields;
  /** 좁은 화면에서는 `· 2개월`을 빼고 금액만 보인다 (회원 목록처럼 옆자리가 좁은 곳) */
  compactOnNarrow?: boolean;
}

export default function DuesPill({ member, compactOnNarrow }: DuesPillProps) {
  const text = duesText(member);
  if (member.due > 0) {
    // 마감일이 지난 미납은 더 강한 색으로, 아직 마감 전인 이번 달 회비만 남았으면 약한 색으로 보인다
    const late = member.overdue > 0;
    return (
      <span className={late ? pillCss.danger : pillCss.warning} title={late ? "마감일이 지났어요" : "이번 달 마감일 전이에요"}>
        {compactOnNarrow && member.unpaidMonths > 0 ? (
          <>
            미납 {formatWon(member.due)}
            <span className={monthsOnWideCss}> · {member.unpaidMonths}개월</span>
          </>
        ) : (
          text
        )}
      </span>
    );
  }
  if (member.credit > 0) return <span className={pillCss.brand}>{text}</span>;
  if (member.chargedMonths === 0) return <span className={pillCss.neutral}>{text}</span>;
  return <span className={pillCss.success}>{text}</span>;
}
