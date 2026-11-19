// 회비 규칙(월 회비, 마감일, 독촉 시점 등)과 회비 앱을 쓰는 기기 목록.
import { useEffect, useMemo, useState } from "react";
import { Smartphone, X } from "lucide-react";
import { ConfirmModal } from "@/components/ui/Modal";
import LoadingButton from "@/components/ui/LoadingButton";
import Skeleton from "@/components/ui/Skeleton";
import { css, cx } from "@/lib/css";
import { colors } from "@/lib/tokens";
import type { HrDevice, HrSettings } from "@/domain/hr/hr-dto";
import { errorMessage, formatDayTime, formatWon, offsetLabel } from "@/domain/hr/hr-format";
import { useDeleteDevice, useUpdateSettings } from "@/domain/hr/hr-mutation-options";
import { useHrDevices } from "@/domain/hr/hr-query-options";
import {
  cardCss,
  dangerGhostBtnCss,
  formGridCss,
  ghostBtnCss,
  hintCss,
  inputCss,
  pillCss,
  primaryBtnCss,
  sectionCss,
  sectionDescCss,
  sectionHeadCss,
  sectionTitleCss,
  selectCss,
  smallBtnCss,
  spanAllCss,
  textareaCss,
} from "../members/shared/styles";
import { EmptyState, ErrorState, Field, MoneyInput } from "../members/shared/ui";
import type { Notify } from "../members/shared/ui";

const MAX_OFFSETS = 6;
const OFFSET_CHOICES = Array.from({ length: 29 }, (_, i) => i - 14);

const formCardCss = css({ padding: "20px", "@sm": { padding: "28px" } });
const chipsCss = css({ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" });
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
  _hover: { backgroundColor: "rgba(194,96,63,0.18)" },
});
const hoursCss = css({ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "8px", alignItems: "center" });
const hoursSepCss = css({ fontSize: "13px", color: colors.textFaint });
const footCss = css({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "24px",
  paddingTop: "18px",
  borderTop: `1px solid ${colors.borderSubtle}`,
});
const dirtyCss = css({ fontSize: "13px", color: colors.textMuted, marginRight: "auto" });
const warnCss = css({
  fontSize: "12px",
  lineHeight: "1.6",
  marginTop: "6px",
  color: "#8E621B",
});
const deviceRowCss = css({
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "16px",
  borderBottom: `1px solid ${colors.borderFaint}`,
  ":last-child": { borderBottom: "none" },
  "@md": { paddingInline: "22px" },
});
const deviceNameCss = css({ fontSize: "14px", fontWeight: "700", color: colors.textPrimary });
const deviceMetaCss = css({ fontSize: "12px", color: colors.textFaint, marginTop: "3px", fontVariantNumeric: "tabular-nums" });

interface Draft {
  monthlyFee: string;
  dueDay: number;
  reminderOffsets: number[];
  sendStartHour: number;
  sendEndHour: number;
  accountInfo: string;
  noticeClause: string;
}

function toDraft(s: HrSettings): Draft {
  return {
    monthlyFee: String(s.monthlyFee),
    dueDay: s.dueDay,
    reminderOffsets: [...s.reminderOffsets].sort((a, b) => a - b),
    sendStartHour: s.sendStartHour,
    sendEndHour: s.sendEndHour,
    accountInfo: s.accountInfo,
    noticeClause: s.noticeClause,
  };
}

interface RulesSectionProps {
  settings: HrSettings;
  notify: Notify;
}

export default function RulesSection({ settings, notify }: RulesSectionProps) {
  const update = useUpdateSettings();
  const [draft, setDraft] = useState<Draft>(() => toDraft(settings));
  const saved = useMemo(() => toDraft(settings), [settings]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  // 저장한 뒤 서버가 정리해서 돌려준 값(독촉 시점 정렬 등)으로 입력칸을 맞춘다.
  // 고치는 중에 다른 이유로 설정이 다시 내려와도 입력하던 값은 지우지 않는다.
  const [syncedWith, setSyncedWith] = useState(saved);
  useEffect(() => {
    if (JSON.stringify(saved) === JSON.stringify(syncedWith)) return;
    setSyncedWith(saved);
    setDraft((current) => (JSON.stringify(current) === JSON.stringify(syncedWith) ? saved : current));
  }, [saved, syncedWith]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const feeError = draft.monthlyFee === "" ? "월 회비를 적어 주세요. 받지 않으려면 0을 적어요." : "";
  const hoursError = draft.sendStartHour >= draft.sendEndHour ? "끝나는 시각이 시작 시각보다 늦어야 해요." : "";
  const feeChanged = draft.monthlyFee !== "" && Number(draft.monthlyFee) !== settings.monthlyFee;
  const addable = OFFSET_CHOICES.filter((o) => !draft.reminderOffsets.includes(o));

  const handleSave = () => {
    if (!dirty || feeError || hoursError || update.isPending) return;
    update.mutate(
      {
        monthlyFee: Number(draft.monthlyFee),
        dueDay: draft.dueDay,
        reminderOffsets: draft.reminderOffsets,
        sendStartHour: draft.sendStartHour,
        sendEndHour: draft.sendEndHour,
        accountInfo: draft.accountInfo,
        noticeClause: draft.noticeClause,
      },
      {
        onSuccess: (next) => {
          setDraft(toDraft(next));
          setSyncedWith(toDraft(next));
          notify("회비 규칙을 저장했어요.");
        },
        onError: (err) => notify(`저장하지 못했어요. ${errorMessage(err)}`, "error"),
      },
    );
  };

  return (
    <div>
      <section aria-label="회비 규칙">
        <div className={sectionHeadCss}>
          <div>
            <h3 className={sectionTitleCss}>회비 규칙</h3>
            <p className={sectionDescCss}>미납 계산과 독촉 문자가 이 규칙을 따라요.</p>
          </div>
        </div>

        <form
          className={cx(cardCss, formCardCss)}
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className={formGridCss}>
            <Field label="월 회비" error={feeError}>
              <MoneyInput value={draft.monthlyFee} onChange={(v) => set("monthlyFee", v)} invalid={feeError !== ""} />
              {feeChanged && !feeError && (
                <p className={warnCss}>
                  저장하면 지난 달 회비도 모두 {formatWon(Number(draft.monthlyFee))}으로 다시 계산해요. 회원마다
                  따로 정한 월 회비는 그대로예요.
                </p>
              )}
            </Field>
            <Field label="마감일" hint="이 날이 지나도 그 달 회비를 안 냈으면 마감일이 지난 미납으로 봐요.">
              <select className={selectCss} value={draft.dueDay} onChange={(e) => set("dueDay", Number(e.target.value))}>
                {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>매달 {d}일</option>
                ))}
              </select>
            </Field>

            <Field
              label="독촉 시점"
              group
              className={spanAllCss}
              hint={
                draft.reminderOffsets.length === 0
                  ? "정해 둔 날이 없어 독촉 문자를 자동으로 보내지 않아요."
                  : "그 달 회비를 안 낸 회원에게 이 날마다 독촉 문자를 한 번씩 보내요. 문자는 총무 휴대폰의 회비 앱이 보내요."
              }
            >
              <div className={chipsCss}>
                {draft.reminderOffsets.map((o) => (
                  <span key={o} className={pillCss.brand} style={{ paddingBlock: "7px", fontSize: "13px" }}>
                    {offsetLabel(o)}
                    <button
                      type="button"
                      className={chipRemoveCss}
                      aria-label={`${offsetLabel(o)} 지우기`}
                      onClick={() => set("reminderOffsets", draft.reminderOffsets.filter((x) => x !== o))}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {draft.reminderOffsets.length < MAX_OFFSETS ? (
                  <select
                    aria-label="독촉 시점 추가"
                    className={selectCss}
                    style={{ width: "auto", minHeight: "34px", paddingBlock: "5px", fontSize: "13px" }}
                    value=""
                    onChange={(e) => {
                      if (e.target.value === "") return;
                      const next = [...draft.reminderOffsets, Number(e.target.value)].sort((a, b) => a - b);
                      set("reminderOffsets", next);
                    }}
                  >
                    <option value="">+ 시점 추가</option>
                    {addable.map((o) => (
                      <option key={o} value={o}>{offsetLabel(o)}</option>
                    ))}
                  </select>
                ) : (
                  <span className={hintCss} style={{ marginTop: 0 }}>{MAX_OFFSETS}개까지 정할 수 있어요.</span>
                )}
              </div>
            </Field>

            <Field
              label="문자 발송 시간대"
              group
              className={spanAllCss}
              error={hoursError}
              hint="이 시간 안에서만 독촉 문자를 보내요. 밤늦게 문자가 가지 않게 하려는 거예요."
            >
              <div className={hoursCss} style={{ maxWidth: "340px" }}>
                <select
                  aria-label="시작 시각"
                  className={selectCss}
                  value={draft.sendStartHour}
                  onChange={(e) => set("sendStartHour", Number(e.target.value))}
                >
                  {Array.from({ length: 24 }, (_, h) => h).map((h) => (
                    <option key={h} value={h}>{h}시</option>
                  ))}
                </select>
                <span className={hoursSepCss}>부터</span>
                <select
                  aria-label="끝나는 시각"
                  className={selectCss}
                  value={draft.sendEndHour}
                  onChange={(e) => set("sendEndHour", Number(e.target.value))}
                >
                  {Array.from({ length: 24 }, (_, h) => h + 1).map((h) => (
                    <option key={h} value={h}>{h}시</option>
                  ))}
                </select>
              </div>
            </Field>

            <Field
              label="계좌 안내 문구"
              className={spanAllCss}
              hint="회비를 받을 계좌예요. 앱의 단톡 공지와 여기의 미납 명단 복사에 들어가요. 독촉 문자에는 70자를 넘지 않을 때만 붙어요."
            >
              <input
                className={inputCss}
                value={draft.accountInfo}
                maxLength={200}
                placeholder="예: 카카오뱅크 3333-00-0000000 홍길동"
                onChange={(e) => set("accountInfo", e.target.value)}
              />
            </Field>

            <Field
              label="공지에 붙일 회칙 조항"
              className={spanAllCss}
              hint="앱에서 단톡 공지를 만들 때 붙일지 고를 수 있어요."
            >
              <textarea
                className={textareaCss}
                rows={4}
                maxLength={1000}
                value={draft.noticeClause}
                onChange={(e) => set("noticeClause", e.target.value)}
              />
            </Field>
          </div>

          <div className={footCss}>
            {dirty && <span className={dirtyCss}>저장하지 않은 변경이 있어요.</span>}
            {dirty && (
              <button type="button" className={ghostBtnCss} onClick={() => setDraft(saved)} disabled={update.isPending}>
                되돌리기
              </button>
            )}
            <LoadingButton
              type="submit"
              className={primaryBtnCss}
              loading={update.isPending}
              disabled={!dirty || feeError !== "" || hoursError !== ""}
              style={{ minWidth: "96px" }}
            >
              저장
            </LoadingButton>
          </div>
        </form>
      </section>

      <DevicesBlock notify={notify} />
    </div>
  );
}

// ─── 연결된 기기 ──────────────────────────────────────────────
function DevicesBlock({ notify }: { notify: Notify }) {
  const { data, isPending, isError, refetch, isRefetching } = useHrDevices();
  const remove = useDeleteDevice();
  const [target, setTarget] = useState<HrDevice | null>(null);
  // 창이 닫히는 동안에도 기기 이름이 보이도록 마지막 대상을 남겨 둔다
  const [lastTarget, setLastTarget] = useState<HrDevice | null>(null);
  const shown = target ?? lastTarget;
  const nameOf = (d: HrDevice) => d.label.trim() || "이름 없는 기기";

  return (
    <section className={sectionCss} aria-label="연결된 기기">
      <div className={sectionHeadCss}>
        <div>
          <h3 className={sectionTitleCss}>연결된 기기</h3>
          <p className={sectionDescCss}>
            회비 앱을 등록한 휴대폰이에요. 이 휴대폰이 은행 입금 알림을 올리고 독촉 문자를 보내요.
          </p>
        </div>
      </div>

      {isPending ? (
        <div className={cardCss} style={{ padding: "18px" }} aria-busy="true">
          <Skeleton width="40%" height={14} />
          <Skeleton width="25%" height={11} style={{ marginTop: "8px" }} />
        </div>
      ) : isError || !data ? (
        <ErrorState title="기기 목록을 불러오지 못했어요" onRetry={() => void refetch()} retrying={isRefetching} />
      ) : data.length === 0 ? (
        <div className={cardCss}>
          <EmptyState
            icon={<Smartphone size={34} />}
            title="연결된 기기가 없어요"
            description="휴대폰의 회비 앱에서 관리자 비밀번호로 등록하면 여기에 나타나요."
          />
        </div>
      ) : (
        <div className={cardCss}>
          {data.map((d) => (
            <div key={d.id} className={deviceRowCss}>
              <Smartphone size={20} color={colors.textFaint} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className={deviceNameCss}>{nameOf(d)}</p>
                <p className={deviceMetaCss}>
                  {d.lastUsedAt ? `마지막 사용 ${formatDayTime(d.lastUsedAt)}` : "아직 쓴 적 없음"} · 등록{" "}
                  {formatDayTime(d.createdAt)}
                </p>
              </div>
              <button
                type="button"
                className={cx(dangerGhostBtnCss, smallBtnCss)}
                onClick={() => {
                  setTarget(d);
                  setLastTarget(d);
                }}
              >
                연결 해제
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={target !== null}
        onClose={() => setTarget(null)}
        title={shown ? `${nameOf(shown)}의 연결을 해제할까요?` : ""}
        description="이 휴대폰은 더 이상 입금을 올리거나 독촉 문자를 보낼 수 없어요. 다시 쓰려면 회비 앱에서 관리자 비밀번호로 다시 등록해야 해요."
        confirmLabel="연결 해제"
        onConfirm={() => {
          if (!shown) return;
          remove.mutate(shown.id, {
            onSuccess: () => notify(`${nameOf(shown)}의 연결을 해제했어요.`),
            onError: (err) => notify(`해제하지 못했어요. ${errorMessage(err)}`, "error"),
          });
        }}
      />
    </section>
  );
}
