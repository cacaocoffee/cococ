// 입금 내역: 달마다 들어온 입금을 보고, 연결을 바꾸고, 직접 추가하고, CSV로 내려받는다.
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Inbox, Plus, Trash2 } from "lucide-react";
import { ConfirmModal, useConfirm } from "@/components/ui/Modal";
import LoadingButton from "@/components/ui/LoadingButton";
import { css, cx } from "@/lib/css";
import { colors, fonts, radii } from "@/lib/tokens";
import type { HrDeposit, HrOverview } from "@/domain/hr/hr-dto";
import {
  addMonths,
  errorMessage,
  formatDayTime,
  formatMonth,
  formatStamp,
  formatWon,
} from "@/domain/hr/hr-format";
import {
  useCreateDeposit,
  useDeleteDeposit,
  useUpdateDeposit,
} from "@/domain/hr/hr-mutation-options";
import { useHrDeposits } from "@/domain/hr/hr-query-options";
import MemberPicker from "../members/shared/MemberPicker";
import {
  cardCss,
  checkRowCss,
  checkboxCss,
  formGridCss,
  ghostBtnCss,
  iconBtnCss,
  inputCss,
  inputInvalidCss,
  pillCss,
  primaryBtnCss,
  sectionDescCss,
  sectionHeadCss,
  sectionTitleCss,
  sheetActionsCss,
  spanAllCss,
} from "../members/shared/styles";
import { EmptyState, ErrorState, Field, MoneyInput, RowsSkeleton, Sheet } from "../members/shared/ui";
import type { Notify } from "../members/shared/ui";

const monthNavCss = css({ display: "inline-flex", alignItems: "center", gap: "2px" });
const monthLabelCss = css({
  fontFamily: fonts.display,
  fontSize: "20px",
  fontWeight: "700",
  color: colors.textPrimary,
  minWidth: "116px",
  textAlign: "center",
  fontVariantNumeric: "tabular-nums",
});
const actionsCss = css({ display: "flex", gap: "8px", flexWrap: "wrap" });
const rowCss = css({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto",
  gridTemplateAreas: '"who amount" "when link"',
  alignItems: "center",
  gap: "6px 12px",
  padding: "14px 16px",
  borderBottom: `1px solid ${colors.borderFaint}`,
  ":last-child": { borderBottom: "none" },
  "@md": {
    gridTemplateColumns: "128px minmax(0, 1fr) minmax(0, 1fr) 110px 36px",
    gridTemplateAreas: '"when who link amount del"',
    paddingInline: "22px",
    gap: "16px",
  },
});
const whenCss = css({
  gridArea: "when",
  fontSize: "12px",
  color: colors.textFaint,
  fontVariantNumeric: "tabular-nums",
  "@md": { fontSize: "13px" },
});
const whoCss = css({
  gridArea: "who",
  fontSize: "14px",
  fontWeight: "700",
  color: colors.textPrimary,
  minWidth: "0",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  flexWrap: "wrap",
});
const linkCellCss = css({
  gridArea: "link",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "4px",
  minWidth: "0",
  "@md": { justifyContent: "flex-start" },
});
const linkBtnCss = css({
  display: "inline-flex",
  alignItems: "center",
  minHeight: "32px",
  padding: "0",
  border: "none",
  background: "none",
  fontFamily: "inherit",
  cursor: "pointer",
  borderRadius: radii.pill,
  transition: "opacity 0.15s",
  _hover: { opacity: "0.7" },
});
const amountCss = css({
  gridArea: "amount",
  fontSize: "15px",
  fontWeight: "700",
  color: colors.textPrimary,
  textAlign: "right",
  whiteSpace: "nowrap",
  fontVariantNumeric: "tabular-nums",
});
// 좁은 화면에서는 삭제 버튼을 연결 표시 옆에 두고, 넓은 화면에서는 맨 끝 칸에 둔다
const delWideCss = css({ display: "none", "@md": { display: "inline-flex", gridArea: "del" } });
const delNarrowCss = css({ "@md": { display: "none" } });
const totalLineCss = css({
  fontSize: "12px",
  color: colors.textFaint,
  marginTop: "12px",
  textAlign: "right",
  fontVariantNumeric: "tabular-nums",
});
const infoBoxCss = css({
  backgroundColor: colors.bgSection,
  borderRadius: radii.md,
  padding: "14px 16px",
  marginBottom: "18px",
});
const infoWhoCss = css({ fontSize: "15px", fontWeight: "700", color: colors.textPrimary });
const infoSubCss = css({ fontSize: "13px", color: colors.textMuted, marginTop: "2px", fontVariantNumeric: "tabular-nums" });

function linkLabel(d: HrDeposit): { text: string; className: string } {
  if (d.ignored) return { text: "회비 아님", className: pillCss.neutral };
  if (d.memberId === null) return { text: "연결 안 됨", className: pillCss.warning };
  return { text: d.memberName ?? "삭제된 회원", className: pillCss.outline };
}

function csvCell(value: string | number): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function downloadCsv(month: string, deposits: HrDeposit[]): void {
  const header = ["입금 시각", "입금자명", "금액", "회원", "연결", "들어온 경로"];
  const rows = deposits.map((d) => [
    formatStamp(d.depositedAt),
    d.depositorName,
    d.amount,
    d.memberName ?? "",
    d.ignored ? "회비 아님" : d.memberId === null ? "연결 안 됨" : d.matchedBy === "auto" ? "자동 연결" : "직접 연결",
    d.source === "manual" ? "직접 추가" : "은행 알림",
  ]);
  const text = [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n");
  // 엑셀이 한글을 깨뜨리지 않게 맨 앞에 BOM을 붙인다
  const blob = new Blob(["﻿", text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `회비-입금-${month}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── 입금 한 건의 연결을 바꾸는 창 ────────────────────────────
interface LinkSheetBodyProps {
  deposit: HrDeposit;
  overview: HrOverview;
  onClose: () => void;
  notify: Notify;
}

function LinkSheetBody({ deposit, overview, onClose, notify }: LinkSheetBodyProps) {
  const update = useUpdateDeposit();
  const [memberId, setMemberId] = useState<number | null>(deposit.memberId);
  const hasName = deposit.depositorName.trim() !== "";
  // 지금 연결이 없는 입금을 연결할 때만 기억하기를 미리 켜 둔다.
  // 이미 연결된 것을 다른 회원으로 옮길 때는 잘못 연결된 것을 고치는 경우가 많아 꺼 둔다.
  const [remember, setRemember] = useState(deposit.memberId === null);
  const changed = memberId !== null && memberId !== deposit.memberId;

  const run = (data: Parameters<typeof update.mutate>[0]["data"], message: string) => {
    update
      .mutateAsync({ id: deposit.id, data })
      .then((res) => {
        notify(res.relinked > 0 ? `${message} 같은 이름의 다른 입금 ${res.relinked}건도 함께 연결했어요.` : message);
        onClose();
      })
      .catch((err: unknown) => notify(`바꾸지 못했어요. ${errorMessage(err)}`, "error"));
  };

  const target = overview.members.find((m) => m.id === memberId);

  return (
    <div>
      <div className={infoBoxCss}>
        <p className={infoWhoCss}>{hasName ? deposit.depositorName : "입금자명 없음"}</p>
        <p className={infoSubCss}>
          {formatWon(deposit.amount)} · {formatDayTime(deposit.depositedAt)}
          {deposit.source === "manual" ? " · 직접 추가" : ""}
        </p>
      </div>

      {deposit.ignored ? (
        <p className={sectionDescCss} style={{ marginBottom: "14px" }}>
          회비 아님으로 표시한 입금이에요. 회원을 골라 연결하면 회비로 계산해요.
        </p>
      ) : null}

      <Field label="이 입금을 낸 회원" group>
        <MemberPicker members={overview.members} value={memberId} onChange={setMemberId} includeLeft />
      </Field>

      {hasName && changed && (
        <label className={checkRowCss} style={{ marginTop: "10px" }}>
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

      <div className={sheetActionsCss} style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {deposit.memberId !== null && (
            <button
              type="button"
              className={ghostBtnCss}
              disabled={update.isPending}
              onClick={() => run({ memberId: null }, "연결을 해제했어요. `연결 안 된 입금`에 다시 나타나요.")}
            >
              연결 해제
            </button>
          )}
          {deposit.ignored ? (
            <button
              type="button"
              className={ghostBtnCss}
              disabled={update.isPending}
              onClick={() => run({ ignored: false }, "회비 아님 표시를 지웠어요.")}
            >
              회비 아님 표시 지우기
            </button>
          ) : (
            <button
              type="button"
              className={ghostBtnCss}
              disabled={update.isPending}
              onClick={() =>
                // 회원에게 연결돼 있었다면 연결도 함께 풀어야 그 회원의 낸 금액에서 빠진다
                run(
                  deposit.memberId !== null ? { ignored: true, memberId: null } : { ignored: true },
                  "회비 아님으로 표시했어요.",
                )
              }
            >
              회비 아님
            </button>
          )}
        </div>
        <LoadingButton
          type="button"
          className={primaryBtnCss}
          disabled={!changed}
          loading={update.isPending}
          onClick={() =>
            target &&
            run(
              { memberId: target.id, rememberName: remember && hasName },
              `${target.name} 님의 회비로 연결했어요.`,
            )
          }
        >
          {deposit.memberId === null ? "연결" : "이 회원으로 바꾸기"}
        </LoadingButton>
      </div>
    </div>
  );
}

// ─── 입금을 직접 추가하는 창 ──────────────────────────────────
function newDedupeKey(): string {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `manual:${id}`;
}

interface AddSheetBodyProps {
  overview: HrOverview;
  onClose: () => void;
  onAdded: (month: string) => void;
  notify: Notify;
}

function AddSheetBody({ overview, onClose, onAdded, notify }: AddSheetBodyProps) {
  const create = useCreateDeposit();
  const { today, members } = overview;
  const [date, setDate] = useState(today.date);
  const [amount, setAmount] = useState("");
  const [depositorName, setDepositorName] = useState("");
  const [memberId, setMemberId] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const member = members.find((m) => m.id === memberId) ?? null;
  const dateError = !/^\d{4}-\d{2}-\d{2}$/.test(date)
    ? "입금한 날을 골라 주세요."
    : date > today.date
      ? "오늘보다 뒤의 날은 고를 수 없어요."
      : "";
  const amountError = amount === "" || Number(amount) <= 0 ? "금액을 적어 주세요." : "";
  const whoError =
    depositorName.trim() === "" && member === null ? "입금자명을 적거나 회원을 골라 주세요." : "";

  const handleSave = () => {
    setSubmitted(true);
    if (create.isPending || dateError || amountError || whoError) return;
    // 오늘 입금이면 지금 시각으로, 지난 날이면 그날 낮 12시(한국 시간)로 적는다
    const depositedAt = date === today.date ? new Date().toISOString() : `${date}T12:00:00+09:00`;
    const name = depositorName.trim() || member?.name || "";
    create.mutate(
      { depositedAt, amount: Number(amount), depositorName: name, source: "manual", dedupeKey: newDedupeKey(), memberId },
      {
        onSuccess: (res) => {
          const linkedId = res.results[0]?.memberId ?? null;
          const linked = members.find((m) => m.id === linkedId);
          notify(
            linked
              ? `${formatWon(Number(amount))} 입금을 추가하고 ${linked.name} 님의 회비로 연결했어요.`
              : `${formatWon(Number(amount))} 입금을 추가했어요. 회원을 찾지 못해 \`연결 안 된 입금\`에 넣었어요.`,
          );
          onAdded(date.slice(0, 7));
          onClose();
        },
        onError: (err) => notify(`추가하지 못했어요. ${errorMessage(err)}`, "error"),
      },
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
    >
      <div className={formGridCss}>
        <Field label="입금한 날" error={submitted ? dateError : ""}>
          <input
            type="date"
            className={cx(inputCss, submitted && dateError && inputInvalidCss)}
            value={date}
            max={today.date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>
        <Field label="금액" error={submitted ? amountError : ""}>
          <MoneyInput
            value={amount}
            onChange={setAmount}
            invalid={submitted && amountError !== ""}
            placeholder={overview.settings.monthlyFee.toLocaleString("ko-KR")}
            autoFocus
          />
        </Field>
        <Field
          label="회원"
          group
          className={spanAllCss}
          hint="고르지 않으면 입금자명으로 회원을 찾아 자동으로 연결해요."
        >
          <MemberPicker
            members={members}
            value={memberId}
            onChange={(id) => {
              setMemberId(id);
              // 금액을 아직 안 적었으면 그 회원의 월 회비를 넣어 준다
              const picked = members.find((m) => m.id === id);
              if (picked && amount === "") setAmount(String(picked.fee));
            }}
          />
        </Field>
        <Field
          label="입금자명"
          className={spanAllCss}
          error={submitted ? whoError : ""}
          hint={member ? "비워 두면 회원 이름을 입금자명으로 적어요." : undefined}
        >
          <input
            className={cx(inputCss, submitted && whoError && inputInvalidCss)}
            value={depositorName}
            maxLength={60}
            placeholder={member?.name ?? "통장에 찍힌 이름"}
            onChange={(e) => setDepositorName(e.target.value)}
          />
        </Field>
      </div>
      <div className={sheetActionsCss}>
        <button type="button" className={ghostBtnCss} onClick={onClose}>
          취소
        </button>
        <LoadingButton type="submit" className={primaryBtnCss} loading={create.isPending} style={{ minWidth: "96px" }}>
          추가
        </LoadingButton>
      </div>
    </form>
  );
}

// ─── 섹션 ─────────────────────────────────────────────────────
interface DepositsSectionProps {
  overview: HrOverview;
  notify: Notify;
}

export default function DepositsSection({ overview, notify }: DepositsSectionProps) {
  const { today } = overview;
  const [month, setMonth] = useState(today.month);
  const { data, isPending, isError, refetch, isRefetching, isPlaceholderData } = useHrDeposits(month);
  const deleteDeposit = useDeleteDeposit();
  const { confirmProps, openConfirm } = useConfirm();
  const [editing, setEditing] = useState<HrDeposit | null>(null);
  const [adding, setAdding] = useState(false);

  const deposits = data ?? [];
  const total = useMemo(
    () => deposits.filter((d) => !d.ignored).reduce((sum, d) => sum + d.amount, 0),
    [deposits],
  );
  const isCurrent = month >= today.month;

  const handleDelete = (d: HrDeposit) => {
    const who = d.depositorName.trim() || "입금자명 없음";
    openConfirm({
      title: "이 입금을 삭제할까요?",
      description: `${who} · ${formatWon(d.amount)} · ${formatDayTime(d.depositedAt)}. ${
        d.memberName ? `${d.memberName} 님의 낸 금액에서도 빠져요. ` : ""
      }삭제하면 되돌릴 수 없어요. 회비가 아닌 입금이라면 삭제하지 말고 회비 아님으로 표시해 두세요.`,
      onConfirm: () => {
        deleteDeposit.mutate(d.id, {
          onSuccess: () => notify("입금을 삭제했어요."),
          onError: (err) => notify(`삭제하지 못했어요. ${errorMessage(err)}`, "error"),
        });
      },
    });
  };

  return (
    <section aria-label="입금 내역">
      <div className={sectionHeadCss}>
        <div className={monthNavCss}>
          <button
            type="button"
            className={iconBtnCss}
            aria-label="이전 달"
            onClick={() => setMonth(addMonths(month, -1))}
          >
            <ChevronLeft size={18} />
          </button>
          <h3 className={monthLabelCss}>{formatMonth(month)}</h3>
          <button
            type="button"
            className={iconBtnCss}
            aria-label="다음 달"
            disabled={isCurrent}
            onClick={() => setMonth(addMonths(month, 1))}
          >
            <ChevronRight size={18} />
          </button>
          {!isCurrent && (
            <button type="button" className={cx(ghostBtnCss, css({ minHeight: "32px", paddingInline: "10px", fontSize: "12px", marginLeft: "6px" }))} onClick={() => setMonth(today.month)}>
              이번 달
            </button>
          )}
        </div>
        <div className={actionsCss}>
          <button
            type="button"
            className={ghostBtnCss}
            disabled={deposits.length === 0 || isPlaceholderData}
            onClick={() => downloadCsv(month, deposits)}
          >
            <Download size={14} /> CSV 내려받기
          </button>
          <button type="button" className={primaryBtnCss} onClick={() => setAdding(true)}>
            <Plus size={15} /> 입금 직접 추가
          </button>
        </div>
      </div>

      {isPending ? (
        <RowsSkeleton rows={6} />
      ) : isError ? (
        <ErrorState title="입금 내역을 불러오지 못했어요" onRetry={() => void refetch()} retrying={isRefetching} />
      ) : deposits.length === 0 ? (
        <div className={cardCss}>
          <EmptyState
            icon={<Inbox size={34} />}
            title={`${formatMonth(month)}에 들어온 입금이 없어요`}
            description="총무 휴대폰의 회비 앱이 은행 입금 알림을 받으면 여기에 자동으로 올라와요."
          />
        </div>
      ) : (
        <>
          <div className={cardCss} style={{ opacity: isPlaceholderData ? 0.5 : 1, transition: "opacity 0.15s" }}>
            {deposits.map((d) => {
              const label = linkLabel(d);
              const del = (extra: string) => (
                <button
                  type="button"
                  className={cx(iconBtnCss, extra)}
                  aria-label="입금 삭제"
                  onClick={() => handleDelete(d)}
                >
                  <Trash2 size={15} />
                </button>
              );
              return (
                <div key={d.id} className={rowCss} style={d.ignored ? { opacity: 0.6 } : undefined}>
                  <span className={whenCss}>{formatDayTime(d.depositedAt)}</span>
                  <span className={whoCss}>
                    {d.depositorName.trim() || "입금자명 없음"}
                    {d.source === "manual" && <span className={pillCss.neutral}>직접 추가</span>}
                  </span>
                  <span className={linkCellCss}>
                    <button
                      type="button"
                      className={linkBtnCss}
                      title="눌러서 연결 바꾸기"
                      aria-label={`${label.text}, 눌러서 연결 바꾸기`}
                      onClick={() => setEditing(d)}
                    >
                      <span className={label.className}>
                        {label.text}
                        <ChevronRight size={12} style={{ marginRight: "-3px", opacity: 0.6 }} />
                      </span>
                    </button>
                    {del(delNarrowCss)}
                  </span>
                  <span className={amountCss}>{formatWon(d.amount)}</span>
                  {del(delWideCss)}
                </div>
              );
            })}
          </div>
          <p className={totalLineCss}>
            {deposits.length}건 · 합계 {formatWon(total)}
            {deposits.some((d) => d.ignored) ? " (회비 아님은 빼고 더했어요)" : ""}
          </p>
        </>
      )}

      <Sheet open={editing !== null} onClose={() => setEditing(null)} title="입금 연결 바꾸기">
        {editing && (
          <LinkSheetBody deposit={editing} overview={overview} onClose={() => setEditing(null)} notify={notify} />
        )}
      </Sheet>
      <Sheet
        open={adding}
        onClose={() => setAdding(false)}
        title="입금 직접 추가"
        description="현금으로 받았거나 앱이 놓친 입금을 적어요."
      >
        <AddSheetBody overview={overview} onClose={() => setAdding(false)} onAdded={setMonth} notify={notify} />
      </Sheet>
      <ConfirmModal {...confirmProps} />
    </section>
  );
}
