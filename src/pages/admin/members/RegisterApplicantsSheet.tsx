// 최종 합격한 지원자 가운데 아직 회원이 아닌 사람을 골라 회원으로 등록하는 창.
import { useMemo, useState } from "react";
import LoadingButton from "@/components/ui/LoadingButton";
import Skeleton from "@/components/ui/Skeleton";
import { css, cx } from "@/lib/css";
import { colors, radii } from "@/lib/tokens";
import type { HrToday } from "@/domain/hr/hr-dto";
import { errorMessage, formatMonth } from "@/domain/hr/hr-format";
import { useRegisterFromApplications } from "@/domain/hr/hr-mutation-options";
import { useHrApplications } from "@/domain/hr/hr-query-options";
import { checkboxCss, ghostBtnCss, pillCss, primaryBtnCss, quietBtnCss, sheetActionsCss, smallBtnCss } from "./shared/styles";
import { EmptyState, ErrorState, Field, MonthSelect, Sheet } from "./shared/ui";
import type { Notify } from "./shared/ui";

const listBoxCss = css({
  border: `1px solid ${colors.borderLight}`,
  borderRadius: radii.md,
  backgroundColor: colors.bgSection,
  overflow: "hidden",
});
const rowCss = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  minHeight: "52px",
  paddingInline: "14px",
  paddingBlock: "8px",
  cursor: "pointer",
  borderBottom: `1px solid ${colors.borderFaint}`,
  ":last-child": { borderBottom: "none" },
  _hover: { backgroundColor: colors.bgSection },
});
const nameCss = css({ fontSize: "14px", fontWeight: "700", color: colors.textPrimary });
const phoneCss = css({
  fontSize: "12px",
  color: colors.textFaint,
  marginLeft: "auto",
  fontVariantNumeric: "tabular-nums",
});
const listHeadCss = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "8px",
});
const listHeadTextCss = css({ fontSize: "12px", fontWeight: "700", color: colors.textMuted });

interface Props {
  open: boolean;
  onClose: () => void;
  today: HrToday;
  notify: Notify;
}

export default function RegisterApplicantsSheet({ open, onClose, today, notify }: Props) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="합격자를 회원으로 등록"
      description="지원서에 적힌 이름, 전화번호, 기수를 그대로 가져와요."
    >
      <Body onClose={onClose} today={today} notify={notify} />
    </Sheet>
  );
}

function Body({ onClose, today, notify }: Omit<Props, "open">) {
  const { data, isPending, isError, refetch, isRefetching } = useHrApplications();
  const register = useRegisterFromApplications();
  const [joinedMonth, setJoinedMonth] = useState(today.month);
  // 따로 건드리기 전에는 모두 고른 상태로 둔다
  const [unchecked, setUnchecked] = useState<Set<number>>(new Set());

  const candidates = useMemo(
    () => (data ?? []).filter((a) => a.status === "pass2" && a.memberId === null),
    [data],
  );
  const chosen = candidates.filter((a) => !unchecked.has(a.id));

  const toggle = (id: number) =>
    setUnchecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleRegister = () => {
    if (chosen.length === 0 || register.isPending) return;
    register.mutate(
      { applicationIds: chosen.map((a) => a.id), joinedMonth },
      {
        onSuccess: (res) => {
          const parts = [`${res.created}명을 회원으로 등록했어요.`];
          if (res.skipped > 0) parts.push(`${res.skipped}명은 이미 회원이라 넘어갔어요.`);
          if (res.relinked > 0) parts.push(`연결 안 된 입금 ${res.relinked}건이 이름이 맞아 자동으로 연결됐어요.`);
          notify(parts.join(" "));
          onClose();
        },
        onError: (err) => notify(`등록하지 못했어요. ${errorMessage(err)}`, "error"),
      },
    );
  };

  if (isPending) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingBlock: "8px" }} aria-busy="true">
        <Skeleton height={52} />
        <Skeleton height={52} />
        <Skeleton height={44} width="60%" />
      </div>
    );
  }
  if (isError) {
    return <ErrorState title="지원서를 불러오지 못했어요" onRetry={() => void refetch()} retrying={isRefetching} />;
  }
  if (candidates.length === 0) {
    return (
      <EmptyState
        title="등록할 합격자가 없어요"
        description="최종 합격한 지원자는 모두 회원으로 등록돼 있어요."
        action={<button type="button" className={ghostBtnCss} onClick={onClose}>닫기</button>}
      />
    );
  }

  const allChosen = chosen.length === candidates.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <div className={listHeadCss}>
          <span className={listHeadTextCss}>
            최종 합격자 {candidates.length}명 중 {chosen.length}명 선택
          </span>
          <button
            type="button"
            className={cx(quietBtnCss, smallBtnCss)}
            onClick={() => setUnchecked(allChosen ? new Set(candidates.map((a) => a.id)) : new Set())}
          >
            {allChosen ? "모두 해제" : "모두 선택"}
          </button>
        </div>
        <div className={listBoxCss}>
          {candidates.map((a) => (
            <label key={a.id} className={rowCss}>
              <input
                type="checkbox"
                className={checkboxCss}
                checked={!unchecked.has(a.id)}
                onChange={() => toggle(a.id)}
              />
              <span className={nameCss}>{a.name}</span>
              {a.generation > 0 && <span className={pillCss.outline}>{a.generation}기</span>}
              <span className={phoneCss}>{a.phone}</span>
            </label>
          ))}
        </div>
      </div>

      <Field label="가입월" group hint={`${formatMonth(joinedMonth)}부터 매달 회비를 부과해요.`}>
        <MonthSelect value={joinedMonth} onChange={setJoinedMonth} baseMonth={today.month} />
      </Field>

      <div className={sheetActionsCss} style={{ marginTop: 0 }}>
        <button type="button" className={ghostBtnCss} onClick={onClose}>
          취소
        </button>
        <LoadingButton
          type="button"
          className={primaryBtnCss}
          loading={register.isPending}
          disabled={chosen.length === 0}
          onClick={handleRegister}
        >
          {chosen.length === 0 ? "등록할 사람을 골라 주세요" : `${chosen.length}명 회원으로 등록`}
        </LoadingButton>
      </div>
    </div>
  );
}
