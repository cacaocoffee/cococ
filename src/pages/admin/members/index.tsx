// 관리자 `회원` 탭: 회원 명단, 회원별 회비 상태, 합격자 등록.
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Plus, Search, UserPlus, Users } from "lucide-react";
import { ConfirmModal, useConfirm } from "@/components/ui/Modal";
import { css, cx } from "@/lib/css";
import { colors, radii } from "@/lib/tokens";
import type { HrMember, MemberStatus } from "@/domain/hr/hr-dto";
import { STATUS_LABEL, errorMessage, normalizeName } from "@/domain/hr/hr-format";
import { useDeleteMember } from "@/domain/hr/hr-mutation-options";
import { useHrOverview } from "@/domain/hr/hr-query-options";
import { newBtnCss, tabHeaderRowCss, tabTitleCss } from "../styles";
import DuesPill from "./shared/DuesPill";
import {
  BRAND_BG,
  BRAND_BORDER,
  avatarCss,
  cardCss,
  checkRowCss,
  checkboxCss,
  ghostBtnCss,
  hrRootCss,
  inputCss,
  pillCss,
  primaryBtnCss,
  selectCss,
} from "./shared/styles";
import { EmptyState, ErrorState, RowsSkeleton, Segmented, useToast } from "./shared/ui";
import MemberDetail from "./MemberDetail";
import MemberFormSheet from "./MemberFormSheet";
import RegisterApplicantsSheet from "./RegisterApplicantsSheet";

type StatusFilter = "all" | MemberStatus;

const STATUS_ORDER: Record<MemberStatus, number> = { active: 0, paused: 1, left: 2 };

const bannerCss = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px 16px",
  flexWrap: "wrap",
  padding: "16px 18px",
  marginBottom: "20px",
  backgroundColor: BRAND_BG,
  border: `1px solid ${BRAND_BORDER}`,
  borderRadius: radii.lg,
});
const bannerTextCss = css({ display: "flex", alignItems: "center", gap: "12px", minWidth: "0", flex: "1 1 240px" });
const bannerTitleCss = css({ fontSize: "14px", fontWeight: "700", color: colors.textPrimary, lineHeight: "1.5" });
const bannerDescCss = css({ fontSize: "13px", color: colors.textMuted, lineHeight: "1.5" });

const toolbarCss = css({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginBottom: "16px",
  "@lg": { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
});
const filtersCss = css({ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" });
const searchWrapCss = css({ position: "relative", flex: "1 1 180px", minWidth: "0", "@lg": { width: "220px", flex: "none" } });
const searchIconCss = css({
  position: "absolute",
  left: "13px",
  top: "50%",
  transform: "translateY(-50%)",
  color: colors.textDimmer,
  pointerEvents: "none",
});

const rowWrapCss = css({
  borderBottom: `1px solid ${colors.borderFaint}`,
  ":last-child": { borderBottom: "none" },
});
const rowBtnCss = css({
  display: "flex",
  alignItems: "center",
  gap: "14px",
  width: "100%",
  paddingInline: "16px",
  paddingBlock: "14px",
  background: "none",
  border: "none",
  fontFamily: "inherit",
  textAlign: "left",
  cursor: "pointer",
  transition: "background-color 0.15s",
  _hover: { backgroundColor: "rgba(60,40,15,0.03)" },
});
const rowMainCss = css({ flex: "1 1 0%", minWidth: "0" });
const nameLineCss = css({ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" });
const nameCss = css({ fontSize: "15px", fontWeight: "700", color: colors.textPrimary, whiteSpace: "nowrap" });
const genCss = css({ fontSize: "12px", fontWeight: "600", color: colors.textFaint, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" });
// 좁은 화면에서만 이름 아래에 직책과 전화번호를 한 줄로 보인다
const subLineCss = css({
  display: "block",
  "@md": { display: "none" },
  fontSize: "12px",
  color: colors.textFaint,
  marginTop: "3px",
  fontVariantNumeric: "tabular-nums",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});
// 넓은 화면에서만 따로 보이는 칸
const wideColCss = css({ display: "none", "@md": { display: "block" } });
const wideInlineCss = css({ display: "none", "@md": { display: "inline-flex" } });
const narrowOnlyCss = css({ "@md": { display: "none" } });
const phoneColCss = css({
  width: "130px",
  fontSize: "13px",
  color: colors.textMuted,
  fontVariantNumeric: "tabular-nums",
  flexShrink: "0",
});
const statusColCss = css({ width: "52px", flexShrink: "0" });
const duesColCss = css({ flexShrink: "0", display: "flex", justifyContent: "flex-end", "@md": { width: "190px" } });
const chevronCss = css({ color: colors.textDimmer, flexShrink: "0", transition: "transform 0.2s" });
const countLineCss = css({ fontSize: "12px", color: colors.textFaint, marginTop: "12px", textAlign: "right" });

/** 동그라미 안에 넣을 글자: 성을 뺀 이름 두 글자 (`홍길동` → `길동`) */
function initials(name: string): string {
  const compact = name.replace(/\s/g, "");
  return compact.length >= 3 ? compact.slice(-2) : compact;
}

function StatusPill({ status }: { status: MemberStatus }) {
  if (status === "active") return <span className={pillCss.outline}>{STATUS_LABEL.active}</span>;
  return <span className={pillCss.neutral}>{STATUS_LABEL[status]}</span>;
}

export default function MembersTab() {
  const { data, isPending, isError, refetch, isRefetching } = useHrOverview();
  const deleteMember = useDeleteMember();
  const { confirmProps, openConfirm } = useConfirm();
  const { notify, toastNode } = useToast();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [generation, setGeneration] = useState("all");
  const [unpaidOnly, setUnpaidOnly] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  // null이면 닫힘. member가 null이면 새 회원 추가.
  const [form, setForm] = useState<{ member: HrMember | null } | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);

  const members = data?.members ?? [];

  const counts = useMemo(() => {
    const c = { all: members.length, active: 0, paused: 0, left: 0 };
    for (const m of members) c[m.status] += 1;
    return c;
  }, [members]);

  const generations = useMemo(
    () => [...new Set(members.map((m) => m.generation))].filter((g) => g > 0).sort((a, b) => b - a),
    [members],
  );

  const visible = useMemo(() => {
    const q = normalizeName(query);
    const digits = query.replace(/[^0-9]/g, "");
    return members
      .filter((m) => status === "all" || m.status === status)
      .filter((m) => generation === "all" || m.generation === Number(generation))
      .filter((m) => !unpaidOnly || m.due > 0)
      .filter((m) => {
        if (!q) return true;
        if (normalizeName(m.name).includes(q)) return true;
        return digits.length >= 2 && m.phone.replace(/-/g, "").includes(digits);
      })
      // 서버가 기수가 높은 순, 이름순으로 주므로 상태만 앞에 놓고 그 순서는 그대로 둔다
      .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
  }, [members, query, status, generation, unpaidOnly]);

  const filtered = query !== "" || status !== "all" || generation !== "all" || unpaidOnly;
  const resetFilters = () => {
    setQuery("");
    setStatus("all");
    setGeneration("all");
    setUnpaidOnly(false);
  };

  const handleDelete = (member: HrMember, linkedDeposits: number | null) => {
    const depositLine =
      linkedDeposits === null
        ? "이 회원에게 연결된 입금은 지워지지 않고 `연결 안 된 입금`으로 돌아가요."
        : linkedDeposits > 0
          ? `이 회원에게 연결된 입금 ${linkedDeposits}건은 지워지지 않고 \`연결 안 된 입금\`으로 돌아가요.`
          : "";
    openConfirm({
      title: `${member.name} 님을 삭제할까요?`,
      description: `${depositLine} 독촉 문자 발송 기록은 함께 지워져요. 동아리를 나간 회원이라면 삭제하지 말고 상태를 탈퇴로 바꾸면 기록이 남아요.`.trim(),
      onConfirm: () => {
        deleteMember.mutate(member.id, {
          onSuccess: () => {
            setExpandedId(null);
            notify(`${member.name} 님을 삭제했어요.`);
          },
          onError: (err) => notify(`삭제하지 못했어요. ${errorMessage(err)}`, "error"),
        });
      },
    });
  };

  const pass2 = data?.applications.pass2Unregistered ?? 0;
  const topGeneration = generations[0] ?? 0;

  return (
    <div className={hrRootCss}>
      <div className={tabHeaderRowCss}>
        <h2 className={tabTitleCss}>회원</h2>
        <button type="button" className={newBtnCss} onClick={() => setForm({ member: null })} disabled={!data}>
          <Plus size={16} /> 회원 추가
        </button>
      </div>

      {isPending ? (
        <RowsSkeleton rows={8} />
      ) : isError || !data ? (
        <ErrorState title="회원 명단을 불러오지 못했어요" onRetry={() => void refetch()} retrying={isRefetching} />
      ) : (
        <>
          {pass2 > 0 && (
            <div className={bannerCss}>
              <div className={bannerTextCss}>
                <UserPlus size={20} color={colors.brand} style={{ flexShrink: 0 }} />
                <div>
                  <p className={bannerTitleCss}>최종 합격자 {pass2}명이 아직 회원으로 등록되지 않았어요</p>
                  <p className={bannerDescCss}>등록하면 가입월부터 회비를 부과해요.</p>
                </div>
              </div>
              <button type="button" className={primaryBtnCss} onClick={() => setRegisterOpen(true)}>
                회원으로 등록
              </button>
            </div>
          )}

          <div className={toolbarCss}>
            <Segmented<StatusFilter>
              ariaLabel="상태로 거르기"
              value={status}
              onChange={setStatus}
              options={[
                { value: "all", label: "전체", count: counts.all },
                { value: "active", label: "활동", count: counts.active },
                { value: "paused", label: "쉼", count: counts.paused },
                { value: "left", label: "탈퇴", count: counts.left },
              ]}
            />
            <div className={filtersCss}>
              <label className={checkRowCss}>
                <input
                  type="checkbox"
                  className={checkboxCss}
                  checked={unpaidOnly}
                  onChange={(e) => setUnpaidOnly(e.target.checked)}
                />
                미납만
              </label>
              <select
                aria-label="기수로 거르기"
                className={selectCss}
                style={{ width: "auto", minWidth: "108px" }}
                value={generation}
                onChange={(e) => setGeneration(e.target.value)}
              >
                <option value="all">기수 전체</option>
                {generations.map((g) => (
                  <option key={g} value={g}>{g}기</option>
                ))}
              </select>
              <div className={searchWrapCss}>
                <Search size={15} className={searchIconCss} />
                <input
                  type="search"
                  className={inputCss}
                  style={{ paddingLeft: "36px" }}
                  placeholder="이름, 전화번호"
                  aria-label="이름이나 전화번호로 찾기"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {members.length === 0 ? (
            <div className={cardCss}>
              <EmptyState
                icon={<Users size={36} />}
                title="아직 회원이 없어요"
                description="회원을 추가하면 가입월부터 회비를 부과하고, 들어온 입금을 이름으로 연결해요."
                action={
                  <button type="button" className={primaryBtnCss} onClick={() => setForm({ member: null })}>
                    <Plus size={16} /> 회원 추가
                  </button>
                }
              />
            </div>
          ) : visible.length === 0 ? (
            <div className={cardCss}>
              <EmptyState
                title="조건에 맞는 회원이 없어요"
                action={
                  <button type="button" className={ghostBtnCss} onClick={resetFilters}>
                    조건 지우기
                  </button>
                }
              />
            </div>
          ) : (
            <div className={cardCss} style={{ overflow: "hidden" }}>
              {visible.map((m) => {
                const expanded = expandedId === m.id;
                const sub = [m.role, m.phone].filter(Boolean).join(" · ");
                return (
                  <div key={m.id} className={rowWrapCss}>
                    <button
                      type="button"
                      className={rowBtnCss}
                      aria-expanded={expanded}
                      onClick={() => setExpandedId(expanded ? null : m.id)}
                      style={m.status === "left" ? { opacity: 0.6 } : undefined}
                    >
                      <span className={avatarCss} aria-hidden="true">{initials(m.name)}</span>
                      <span className={rowMainCss}>
                        <span className={nameLineCss}>
                          <span className={nameCss}>{m.name}</span>
                          {m.generation > 0 && <span className={genCss}>{m.generation}기</span>}
                          {m.role && <span className={cx(pillCss.brand, wideInlineCss)}>{m.role}</span>}
                          {m.status !== "active" && (
                            <span className={narrowOnlyCss}><StatusPill status={m.status} /></span>
                          )}
                        </span>
                        {sub && <span className={subLineCss}>{sub}</span>}
                      </span>
                      <span className={cx(wideColCss, phoneColCss)}>{m.phone || "—"}</span>
                      <span className={cx(wideColCss, statusColCss)}><StatusPill status={m.status} /></span>
                      <span className={duesColCss}><DuesPill member={m} compactOnNarrow /></span>
                      <ChevronDown
                        size={16}
                        className={chevronCss}
                        style={{ transform: expanded ? "rotate(180deg)" : undefined }}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          style={{ overflow: "hidden" }}
                        >
                          <MemberDetail
                            member={m}
                            today={data.today}
                            settings={data.settings}
                            onEdit={() => setForm({ member: m })}
                            onDelete={(n) => handleDelete(m, n)}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}

          {members.length > 0 && filtered && visible.length > 0 && (
            <p className={countLineCss}>
              {members.length}명 중 {visible.length}명을 보고 있어요.
            </p>
          )}

          <MemberFormSheet
            open={form !== null}
            onClose={() => setForm(null)}
            member={form?.member ?? null}
            today={data.today}
            settings={data.settings}
            defaultGeneration={topGeneration}
            notify={notify}
          />
          <RegisterApplicantsSheet
            open={registerOpen}
            onClose={() => setRegisterOpen(false)}
            today={data.today}
            notify={notify}
          />
        </>
      )}

      <ConfirmModal {...confirmProps} />
      {toastNode}
    </div>
  );
}
