// 회원을 추가하거나 정보를 고치는 창.
import { useState } from "react";
import { X } from "lucide-react";
import LoadingButton from "@/components/ui/LoadingButton";
import { css, cx } from "@/lib/css";
import { colors, radii } from "@/lib/tokens";
import type {
  HrMember,
  HrSettings,
  HrToday,
  MemberCreatePayload,
  MemberPatchPayload,
  MemberStatus,
} from "@/domain/hr/hr-dto";
import {
  STATUS_LABEL,
  addMonths,
  errorMessage,
  formatMonth,
  formatPhoneInput,
  formatWon,
  isValidPhone,
} from "@/domain/hr/hr-format";
import { useCreateMember, useUpdateMember } from "@/domain/hr/hr-mutation-options";
import {
  formGridCss,
  ghostBtnCss,
  hintCss,
  inputCss,
  inputInvalidCss,
  pillCss,
  primaryBtnCss,
  sheetActionsCss,
  spanAllCss,
  textareaCss,
} from "./shared/styles";
import { Field, MoneyInput, MonthSelect, Segmented, Sheet } from "./shared/ui";
import type { Notify } from "./shared/ui";

const MAX_DEPOSIT_NAMES = 10;

const chipsBoxCss = css({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "6px",
  minHeight: "44px",
  padding: "6px",
  backgroundColor: colors.bgSection,
  border: "1px solid transparent",
  borderRadius: radii.md,
  ":focus-within": { borderColor: colors.textPrimary },
});
const chipRemoveCss = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "18px",
  height: "18px",
  marginRight: "-4px",
  border: "none",
  background: "none",
  color: "inherit",
  cursor: "pointer",
  borderRadius: "9999px",
  _hover: { backgroundColor: colors.bgPressed },
});
const chipsInputCss = css({
  flex: "1 1 120px",
  minWidth: "0",
  minHeight: "30px",
  paddingInline: "8px",
  border: "none",
  outline: "none",
  background: "none",
  color: colors.textPrimary,
  fontSize: "16px",
  fontFamily: "inherit",
  _placeholder: { color: colors.textDimmest },
  "@sm": { fontSize: "14px" },
});
const noteBoxCss = css({
  backgroundColor: colors.bgSection,
  borderRadius: radii.md,
  padding: "14px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});
const noteTextCss = css({ fontSize: "13px", color: colors.textMuted, lineHeight: "1.6" });

// ─── 입금자명 여러 개를 적는 입력칸 ───────────────────────────
interface NamesInputProps {
  value: string[];
  onChange: (names: string[]) => void;
}

function NamesInput({ value, onChange }: NamesInputProps) {
  const [draft, setDraft] = useState("");
  const full = value.length >= MAX_DEPOSIT_NAMES;

  const add = (text: string) => {
    const name = text.replace(/,/g, " ").trim().slice(0, 50);
    setDraft("");
    if (!name || value.includes(name) || full) return;
    onChange([...value, name]);
  };

  return (
    <div className={chipsBoxCss}>
      {value.map((name) => (
        <span key={name} className={pillCss.outline} style={{ backgroundColor: colors.bgCard }}>
          {name}
          <button
            type="button"
            className={chipRemoveCss}
            aria-label={`${name} 지우기`}
            onClick={() => onChange(value.filter((n) => n !== name))}
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        className={chipsInputCss}
        value={draft}
        disabled={full}
        placeholder={full ? "10개까지 적을 수 있어요" : value.length === 0 ? "예: 홍길동맘" : "하나 더 적기"}
        onChange={(e) => {
          // 쉼표를 치면 그 앞까지를 하나로 넣는다
          if (e.target.value.endsWith(",")) add(e.target.value);
          else setDraft(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (e.nativeEvent.isComposing) return;
            e.preventDefault();
            add(draft);
          } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => add(draft)}
      />
    </div>
  );
}

// ─── 폼 ───────────────────────────────────────────────────────
interface FormState {
  name: string;
  phone: string;
  generation: string;
  role: string;
  joinedMonth: string;
  monthlyFee: string;
  waivedAmount: string;
  depositNames: string[];
  memo: string;
  status: MemberStatus;
  stoppedMonth: string;
}

function initialState(member: HrMember | null, today: HrToday, defaultGeneration: number): FormState {
  if (!member) {
    return {
      name: "",
      phone: "",
      generation: defaultGeneration > 0 ? String(defaultGeneration) : "",
      role: "",
      joinedMonth: today.month,
      monthlyFee: "",
      waivedAmount: "",
      depositNames: [],
      memo: "",
      status: "active",
      stoppedMonth: addMonths(today.month, 1),
    };
  }
  return {
    name: member.name,
    phone: member.phone,
    generation: member.generation > 0 ? String(member.generation) : "",
    role: member.role,
    joinedMonth: member.joinedMonth,
    monthlyFee: member.monthlyFee === null ? "" : String(member.monthlyFee),
    waivedAmount: member.waivedAmount > 0 ? String(member.waivedAmount) : "",
    depositNames: member.depositNames,
    memo: member.memo,
    status: member.status,
    // 쉬거나 탈퇴할 때 따로 정하지 않으면 다음 달부터 회비를 부과하지 않는다
    stoppedMonth: member.stoppedMonth || addMonths(today.month, 1),
  };
}

interface MemberFormSheetProps {
  open: boolean;
  onClose: () => void;
  /** 고칠 회원. 없으면 새로 추가한다. */
  member: HrMember | null;
  today: HrToday;
  settings: HrSettings;
  /** 새 회원의 기수 입력칸에 미리 넣어 둘 값 (지금 가장 높은 기수) */
  defaultGeneration: number;
  notify: Notify;
}

export default function MemberFormSheet(props: MemberFormSheetProps) {
  // 창을 열 때마다 입력값을 새로 채우도록, 열려 있는 동안에만 안쪽을 그린다
  return (
    <Sheet
      open={props.open}
      onClose={props.onClose}
      title={props.member ? "회원 정보 수정" : "회원 추가"}
      description={props.member ? undefined : "이름과 가입월만 적어도 추가할 수 있어요."}
    >
      <FormBody key={props.member?.id ?? "new"} {...props} />
    </Sheet>
  );
}

function FormBody({ onClose, member, today, settings, defaultGeneration, notify }: MemberFormSheetProps) {
  const [f, setF] = useState<FormState>(() => initialState(member, today, defaultGeneration));
  const [submitted, setSubmitted] = useState(false);
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();
  const saving = createMember.isPending || updateMember.isPending;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setF((prev) => ({ ...prev, [key]: value }));

  const nameError = f.name.trim() === "" ? "이름을 적어 주세요." : "";
  const phoneError = isValidPhone(f.phone.trim()) ? "" : "숫자와 -만 써서 9~13자로 적어 주세요.";
  const wasActive = member ? member.status === "active" : true;
  const stopsNow = wasActive && f.status !== "active";
  const resumes = member !== null && !wasActive && f.status === "active";
  const staysStopped = member !== null && !wasActive && f.status !== "active";
  const stopError =
    (stopsNow || staysStopped) && f.stoppedMonth < f.joinedMonth
      ? "가입월보다 앞선 달은 고를 수 없어요."
      : "";

  const handleSave = () => {
    setSubmitted(true);
    if (saving || nameError || phoneError || stopError) return;

    const fields: MemberCreatePayload = {
      name: f.name.trim(),
      phone: f.phone.trim(),
      generation: f.generation === "" ? 0 : Number(f.generation),
      role: f.role.trim(),
      joinedMonth: f.joinedMonth,
      monthlyFee: f.monthlyFee === "" ? null : Number(f.monthlyFee),
      waivedAmount: f.waivedAmount === "" ? 0 : Number(f.waivedAmount),
      depositNames: f.depositNames,
      memo: f.memo,
    };

    const relinkedText = (n: number) =>
      n > 0 ? ` 연결 안 된 입금 ${n}건이 이름이 맞아 자동으로 연결됐어요.` : "";

    if (!member) {
      createMember.mutate(fields, {
        onSuccess: (res) => {
          notify(`${fields.name} 님을 추가했어요.${relinkedText(res.relinked)}`);
          onClose();
        },
        onError: (err) => notify(`추가하지 못했어요. ${errorMessage(err)}`, "error"),
      });
      return;
    }

    // 바뀐 값만 보낸다
    const patch: MemberPatchPayload = {};
    if (fields.name !== member.name) patch.name = fields.name;
    if (fields.phone !== member.phone) patch.phone = fields.phone;
    if (fields.generation !== member.generation) patch.generation = fields.generation;
    if (fields.role !== member.role) patch.role = fields.role;
    if (fields.joinedMonth !== member.joinedMonth) patch.joinedMonth = fields.joinedMonth;
    if (fields.monthlyFee !== member.monthlyFee) patch.monthlyFee = fields.monthlyFee;
    if (fields.waivedAmount !== member.waivedAmount) patch.waivedAmount = fields.waivedAmount;
    if (fields.memo !== member.memo) patch.memo = fields.memo;
    if (fields.depositNames.join("\n") !== member.depositNames.join("\n")) {
      patch.depositNames = fields.depositNames;
    }
    if (f.status !== member.status) patch.status = f.status;
    if ((stopsNow || staysStopped) && f.stoppedMonth !== member.stoppedMonth) {
      patch.stoppedMonth = f.stoppedMonth;
    }

    if (Object.keys(patch).length === 0) {
      onClose();
      return;
    }
    updateMember.mutate(
      { id: member.id, data: patch },
      {
        onSuccess: (res) => {
          notify(`${fields.name} 님의 정보를 저장했어요.${relinkedText(res.relinked)}`);
          onClose();
        },
        onError: (err) => notify(`저장하지 못했어요. ${errorMessage(err)}`, "error"),
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
        <Field label="이름" error={submitted ? nameError : ""}>
          <input
            className={cx(inputCss, submitted && nameError && inputInvalidCss)}
            value={f.name}
            maxLength={50}
            autoFocus={!member}
            onChange={(e) => set("name", e.target.value)}
          />
        </Field>
        <Field label="전화번호" error={submitted ? phoneError : ""}>
          <input
            className={cx(inputCss, submitted && phoneError && inputInvalidCss)}
            inputMode="tel"
            value={f.phone}
            placeholder="010-0000-0000"
            onChange={(e) => set("phone", formatPhoneInput(e.target.value))}
          />
        </Field>
        <Field label="기수">
          <input
            className={inputCss}
            inputMode="numeric"
            value={f.generation}
            placeholder="예: 6"
            onChange={(e) => set("generation", e.target.value.replace(/[^0-9]/g, "").slice(0, 3))}
          />
        </Field>
        <Field label="직책">
          <input
            className={inputCss}
            value={f.role}
            maxLength={30}
            placeholder="예: 총무 (없으면 비워 두세요)"
            onChange={(e) => set("role", e.target.value)}
          />
        </Field>

        <Field
          label="가입월"
          group
          className={spanAllCss}
          hint="이 달부터 매달 회비를 부과해요."
        >
          <MonthSelect value={f.joinedMonth} onChange={(m) => set("joinedMonth", m)} baseMonth={today.month} />
        </Field>

        <Field
          label="이 회원의 월 회비"
          hint={`비워 두면 기본 월 회비 ${formatWon(settings.monthlyFee)}을 적용해요.`}
        >
          <MoneyInput
            value={f.monthlyFee}
            onChange={(v) => set("monthlyFee", v)}
            placeholder={settings.monthlyFee.toLocaleString("ko-KR")}
          />
        </Field>
        <Field label="면제액" hint="부과된 회비에서 이만큼을 빼 줘요.">
          <MoneyInput value={f.waivedAmount} onChange={(v) => set("waivedAmount", v)} placeholder="0" />
        </Field>

        <Field
          label="다른 입금자명"
          group
          className={spanAllCss}
          hint="회원 이름과 다른 이름으로 입금하는 경우에 적어 두세요. 그 이름으로 들어온 입금을 이 회원에게 자동으로 연결해요. Enter나 쉼표로 하나씩 넣어요."
        >
          <NamesInput value={f.depositNames} onChange={(names) => set("depositNames", names)} />
        </Field>

        <Field label="메모" className={spanAllCss}>
          <textarea
            className={textareaCss}
            rows={2}
            maxLength={500}
            value={f.memo}
            onChange={(e) => set("memo", e.target.value)}
          />
        </Field>

        {member && (
          <Field label="상태" group className={spanAllCss}>
            <Segmented<MemberStatus>
              ariaLabel="상태"
              value={f.status}
              onChange={(v) => set("status", v)}
              options={(["active", "paused", "left"] as const).map((s) => ({
                value: s,
                label: STATUS_LABEL[s],
              }))}
            />

            {(stopsNow || staysStopped) && (
              <div className={noteBoxCss} style={{ marginTop: "10px" }}>
                <Field label="회비를 부과하지 않기 시작하는 달" group error={stopError}>
                  <MonthSelect
                    value={f.stoppedMonth}
                    onChange={(m) => set("stoppedMonth", m)}
                    baseMonth={today.month}
                  />
                </Field>
                <p className={noteTextCss}>
                  {formatMonth(f.stoppedMonth)}부터 회비를 부과하지 않아요.{" "}
                  {formatMonth(addMonths(f.stoppedMonth, -1))}까지의 미납은 그대로 남아요.
                </p>
              </div>
            )}

            {resumes && (
              <div className={noteBoxCss} style={{ marginTop: "10px" }}>
                <p className={noteTextCss}>
                  {formatMonth(today.month)}부터 다시 회비를 부과해요.
                  {member.stoppedMonth &&
                    ` ${formatMonth(member.stoppedMonth)}부터 지난달까지 쉰 달의 회비는 면제액에 더하고, 메모에 적어 둬요.`}
                </p>
              </div>
            )}

            {!stopsNow && !staysStopped && !resumes && (
              <p className={hintCss}>쉼이나 탈퇴로 바꾸면 어느 달부터 회비를 부과하지 않을지 정할 수 있어요.</p>
            )}
          </Field>
        )}
      </div>

      <div className={sheetActionsCss}>
        <button type="button" className={ghostBtnCss} onClick={onClose}>
          취소
        </button>
        <LoadingButton type="submit" loading={saving} className={primaryBtnCss} style={{ minWidth: "96px" }}>
          {member ? "저장" : "추가"}
        </LoadingButton>
      </div>
    </form>
  );
}
