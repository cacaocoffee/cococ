// 연결 안 된 입금: 입금자명으로 회원을 찾지 못한 입금을 사람이 연결하거나 회비 아님으로 표시한다.
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoadingButton from "@/components/ui/LoadingButton";
import { css, cx } from "@/lib/css";
import { colors, fonts, radii } from "@/lib/tokens";
import type { HrDeposit, HrMember } from "@/domain/hr/hr-dto";
import { errorMessage, formatDayTime, formatWon, suggestMembers } from "@/domain/hr/hr-format";
import { useUpdateDeposit } from "@/domain/hr/hr-mutation-options";
import MemberPicker from "../members/shared/MemberPicker";
import { duesText } from "../members/shared/DuesPill";
import {
  cardCss,
  checkRowCss,
  checkboxCss,
  ghostBtnCss,
  primaryBtnCss,
  sectionCss,
  sectionDescCss,
  sectionHeadCss,
  sectionTitleCss,
} from "../members/shared/styles";
import type { Notify } from "../members/shared/ui";

const listCss = css({ display: "flex", flexDirection: "column", gap: "12px" });
const itemCss = css({
  padding: "18px",
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "16px",
  "@md": { gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.15fr)", gap: "28px", padding: "22px 24px" },
});
const whoCss = css({ fontSize: "16px", fontWeight: "700", color: colors.textPrimary, wordBreak: "break-all" });
const amountCss = css({
  fontFamily: fonts.display,
  fontSize: "26px",
  fontWeight: "500",
  color: colors.textPrimary,
  fontVariantNumeric: "tabular-nums",
  marginTop: "2px",
});
const whenCss = css({ fontSize: "13px", color: colors.textFaint, marginTop: "4px", fontVariantNumeric: "tabular-nums" });
const rawCss = css({
  marginTop: "12px",
  padding: "10px 12px",
  backgroundColor: colors.bgSection,
  borderRadius: radii.sm,
  fontSize: "12px",
  color: colors.textMuted,
  lineHeight: "1.6",
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
});
const rawLabelCss = css({ display: "block", fontSize: "11px", fontWeight: "700", color: colors.textFaint });
const controlsCss = css({ display: "flex", flexDirection: "column", gap: "12px", minWidth: "0" });
const suggestLabelCss = css({ fontSize: "12px", fontWeight: "700", color: colors.textMuted, marginBottom: "6px" });
const suggestRowCss = css({ display: "flex", gap: "6px", flexWrap: "wrap" });
const suggestBtnCss = css({
  display: "inline-flex",
  alignItems: "baseline",
  gap: "6px",
  minHeight: "34px",
  paddingInline: "12px",
  paddingBlock: "6px",
  borderRadius: radii.pill,
  border: `1px solid ${colors.borderStrong}`,
  backgroundColor: "transparent",
  fontFamily: "inherit",
  fontSize: "13px",
  fontWeight: "700",
  color: colors.textPrimary,
  cursor: "pointer",
  transition: "background-color 0.15s, border-color 0.15s",
  _hover: { backgroundColor: colors.bgSection },
});
const suggestOnCss = css({ borderColor: colors.brand, backgroundColor: "rgba(194,96,63,0.10)" });
const suggestMetaCss = css({ fontSize: "12px", fontWeight: "500", color: colors.textFaint, fontVariantNumeric: "tabular-nums" });
const btnRowCss = css({ display: "flex", gap: "8px", flexWrap: "wrap" });

interface ItemProps {
  deposit: HrDeposit;
  members: HrMember[];
  notify: Notify;
}

function UnmatchedItem({ deposit, members, notify }: ItemProps) {
  const [memberId, setMemberId] = useState<number | null>(null);
  const [remember, setRemember] = useState(true);
  const update = useUpdateDeposit();

  const suggestions = useMemo(
    () => suggestMembers(deposit.depositorName, members),
    [deposit.depositorName, members],
  );
  const raw = [deposit.rawTitle, deposit.rawBody].filter(Boolean).join("\n");
  const hasName = deposit.depositorName.trim() !== "";
  const who = hasName ? deposit.depositorName : "입금자명 없음";

  const link = () => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;
    const rememberName = remember && hasName;
    // 연결하면 이 줄이 목록에서 바로 빠지므로, 줄이 사라진 뒤에도 결과를 알릴 수 있게 mutateAsync를 쓴다
    update
      .mutateAsync({ id: deposit.id, data: { memberId: member.id, rememberName } })
      .then((res) => {
        const parts = [`${member.name} 님의 회비로 연결했어요.`];
        if (rememberName) parts.push(`다음부터 같은 입금자명(${deposit.depositorName})은 자동으로 연결해요.`);
        if (res.relinked > 0) parts.push(`같은 이름의 다른 입금 ${res.relinked}건도 함께 연결했어요.`);
        notify(parts.join(" "));
      })
      .catch((err: unknown) => notify(`연결하지 못했어요. ${errorMessage(err)}`, "error"));
  };

  const ignore = () => {
    update
      .mutateAsync({ id: deposit.id, data: { ignored: true } })
      .then(() =>
        notify(`${who} ${formatWon(deposit.amount)}을 회비 아님으로 표시했어요. 입금 내역에서 되돌릴 수 있어요.`),
      )
      .catch((err: unknown) => notify(`표시하지 못했어요. ${errorMessage(err)}`, "error"));
  };

  return (
    <div className={cx(cardCss, itemCss)}>
      <div>
        <p className={whoCss}>{who}</p>
        <p className={amountCss}>{formatWon(deposit.amount)}</p>
        <p className={whenCss}>{formatDayTime(deposit.depositedAt)} 입금</p>
        {raw && (
          <p className={rawCss}>
            <span className={rawLabelCss}>은행 알림 원문</span>
            {raw}
          </p>
        )}
      </div>

      <div className={controlsCss}>
        {suggestions.length > 0 && memberId === null && (
          <div>
            <p className={suggestLabelCss}>이름이 비슷한 회원</p>
            <div className={suggestRowCss}>
              {suggestions.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={cx(suggestBtnCss, memberId === m.id && suggestOnCss)}
                  onClick={() => setMemberId(m.id)}
                >
                  {m.name}
                  <span className={suggestMetaCss}>{duesText(m)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <MemberPicker members={members} value={memberId} onChange={setMemberId} placeholder="누구의 회비인지 이름으로 찾기" />

        {hasName && (
          <label className={checkRowCss}>
            <input
              type="checkbox"
              className={checkboxCss}
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>
              이 입금자명 기억하기
              <span style={{ color: colors.textFaint }}> · 다음부터 자동으로 연결해요</span>
            </span>
          </label>
        )}

        <div className={btnRowCss}>
          <LoadingButton
            type="button"
            className={primaryBtnCss}
            style={{ flex: "1 1 120px" }}
            disabled={memberId === null}
            loading={update.isPending && update.variables?.data.memberId !== undefined}
            onClick={link}
          >
            연결
          </LoadingButton>
          <LoadingButton
            type="button"
            className={ghostBtnCss}
            loading={update.isPending && update.variables?.data.ignored === true}
            disabled={update.isPending}
            onClick={ignore}
            title="뒤풀이 정산처럼 회비가 아닌 입금일 때"
          >
            회비 아님
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}

interface UnmatchedSectionProps {
  deposits: HrDeposit[];
  members: HrMember[];
  notify: Notify;
}

export default function UnmatchedSection({ deposits, members, notify }: UnmatchedSectionProps) {
  if (deposits.length === 0) return null;
  return (
    <section className={sectionCss} id="hr-unmatched" style={{ scrollMarginTop: "24px" }}>
      <div className={sectionHeadCss}>
        <div>
          <h3 className={sectionTitleCss}>연결 안 된 입금 {deposits.length}건</h3>
          <p className={sectionDescCss}>
            입금자명이 회원 이름과 달라 자동으로 연결하지 못한 입금이에요. 누구의 회비인지 골라 주세요.
          </p>
        </div>
      </div>
      <div className={listCss}>
        <AnimatePresence initial={false}>
          {deposits.map((d) => (
            <motion.div
              key={d.id}
              layout="position"
              exit={{ opacity: 0, height: 0, marginBottom: -12 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: "hidden" }}
            >
              <UnmatchedItem deposit={d} members={members} notify={notify} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
