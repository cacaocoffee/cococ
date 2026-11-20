// 회원·회비 탭이 함께 쓰는 작은 부품들.
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, RotateCw, X } from "lucide-react";
import { css, cx } from "@/lib/css";
import { colors, fonts, radii, shadows } from "@/lib/tokens";
import Skeleton from "@/components/ui/Skeleton";
import { digitsOnly, withCommas } from "@/domain/hr/hr-format";
import {
  cardCss,
  errorTextCss,
  fieldLabelCss,
  ghostBtnCss,
  hintCss,
  iconBtnCss,
  inputCss,
  inputInvalidCss,
  segBtnCss,
  segBtnOnCss,
  segCountCss,
  segWrapCss,
  selectCss,
} from "./styles";

// ─── 입력칸 한 묶음 (이름표 + 입력 + 도움말) ──────────────────
interface FieldProps {
  label: string;
  hint?: ReactNode;
  error?: string;
  className?: string;
  /** 버튼 여러 개처럼 입력칸이 하나가 아닐 때. 이름표를 눌러도 아무 버튼이 눌리지 않게 label 대신 div로 감싼다. */
  group?: boolean;
  children: ReactNode;
}

const fieldCss = css({ display: "block", minWidth: "0" });

export function Field({ label, hint, error, className, group, children }: FieldProps) {
  const Tag = group ? "div" : "label";
  return (
    <Tag className={cx(fieldCss, className)}>
      <span className={fieldLabelCss}>{label}</span>
      {children}
      {error ? <p className={errorTextCss}>{error}</p> : hint ? <p className={hintCss}>{hint}</p> : null}
    </Tag>
  );
}

// ─── 금액 입력 ────────────────────────────────────────────────
const moneyWrapCss = css({ position: "relative" });
const moneyUnitCss = css({
  position: "absolute",
  right: "14px",
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: "14px",
  color: colors.textFaint,
  pointerEvents: "none",
});

interface MoneyInputProps {
  /** 숫자만 담은 글. 비어 있으면 '' */
  value: string;
  onChange: (digits: string) => void;
  placeholder?: string;
  invalid?: boolean;
  autoFocus?: boolean;
}

export function MoneyInput({ value, onChange, placeholder, invalid, autoFocus }: MoneyInputProps) {
  return (
    <div className={moneyWrapCss}>
      <input
        inputMode="numeric"
        autoFocus={autoFocus}
        value={withCommas(value)}
        onChange={(e) => onChange(digitsOnly(e.target.value).slice(0, 9))}
        placeholder={placeholder}
        className={cx(inputCss, invalid && inputInvalidCss)}
        style={{ paddingRight: "36px", fontVariantNumeric: "tabular-nums" }}
      />
      <span className={moneyUnitCss}>원</span>
    </div>
  );
}

// ─── 달 고르기 (연도와 월을 따로 고른다) ──────────────────────
// `<input type="month">`는 데스크톱 사파리와 파이어폭스에서 달력이 나오지 않아 쓰지 않는다.
const monthRowCss = css({ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "8px" });

interface MonthSelectProps {
  /** YYYY-MM */
  value: string;
  onChange: (month: string) => void;
  /** 고를 수 있는 연도 범위를 정하는 기준 달 (보통 이번 달) */
  baseMonth: string;
}

export function MonthSelect({ value, onChange, baseMonth }: MonthSelectProps) {
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const baseYear = Number(baseMonth.slice(0, 4));
  const from = Math.min(year, baseYear - 6);
  const to = Math.max(year, baseYear + 1);
  const years = Array.from({ length: to - from + 1 }, (_, i) => from + i);
  const emit = (y: number, m: number) => onChange(`${y}-${String(m).padStart(2, "0")}`);
  return (
    <div className={monthRowCss}>
      <select
        aria-label="연도"
        className={selectCss}
        value={year}
        onChange={(e) => emit(Number(e.target.value), month)}
      >
        {years.map((y) => (
          <option key={y} value={y}>{y}년</option>
        ))}
      </select>
      <select
        aria-label="월"
        className={selectCss}
        value={month}
        onChange={(e) => emit(year, Number(e.target.value))}
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
          <option key={m} value={m}>{m}월</option>
        ))}
      </select>
    </div>
  );
}

// ─── 여러 개 중 하나 고르기 ───────────────────────────────────
interface SegmentedProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; count?: number }[];
  ariaLabel: string;
}

export function Segmented<T extends string>({ value, onChange, options, ariaLabel }: SegmentedProps<T>) {
  return (
    <div className={segWrapCss} role="tablist" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={o.value === value}
          className={cx(segBtnCss, o.value === value && segBtnOnCss)}
          onClick={() => onChange(o.value)}
        >
          {o.label}
          {o.count !== undefined && <span className={segCountCss}>{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

// ─── 화면 위에 겹쳐 뜨는 창 ───────────────────────────────────
// 좁은 화면에서는 아래에서 올라와 화면 폭을 다 쓰고, 넓은 화면에서는 가운데에 뜬다.
const sheetBackdropCss = css({
  position: "fixed",
  inset: "0",
  zIndex: "150",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  backgroundColor: "rgba(15,17,21,0.5)",
  "@sm": { alignItems: "center", padding: "24px" },
});
const sheetPanelCss = css({
  width: "100%",
  maxHeight: "92dvh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: colors.bgCard,
  borderTopLeftRadius: radii.xl,
  borderTopRightRadius: radii.xl,
  boxShadow: shadows.card,
  overflow: "hidden",
  "@sm": {
    maxWidth: "34rem",
    maxHeight: "88vh",
    borderRadius: radii.xl,
    border: `1px solid ${colors.borderStrong}`,
  },
});
const sheetHeadCss = css({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "12px",
  paddingInline: "20px",
  paddingTop: "20px",
  paddingBottom: "14px",
  "@sm": { paddingInline: "28px", paddingTop: "24px" },
});
const sheetTitleCss = css({
  fontFamily: fonts.display,
  fontSize: "22px",
  fontWeight: "700",
  color: colors.textPrimary,
  letterSpacing: "-0.01em",
});
const sheetDescCss = css({
  fontSize: "13px",
  color: colors.textFaint,
  lineHeight: "1.6",
  marginTop: "4px",
});
const sheetBodyCss = css({
  flex: "1 1 auto",
  overflowY: "auto",
  paddingInline: "20px",
  paddingBottom: "20px",
  "@sm": { paddingInline: "28px", paddingBottom: "24px" },
});
const sheetFootCss = css({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
  paddingInline: "20px",
  paddingTop: "14px",
  paddingBottom: "calc(14px + env(safe-area-inset-bottom, 0px))",
  borderTop: `1px solid ${colors.borderSubtle}`,
  backgroundColor: colors.bgCard,
  "@sm": { paddingInline: "28px", paddingBottom: "18px" },
});

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

export function Sheet({ open, onClose, title, description, footer, children }: SheetProps) {
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={sheetBackdropCss}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => {
            // 창 바깥을 눌렀을 때만 닫는다 (창 안에서 끌다가 밖에서 떼는 경우는 닫지 않는다)
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={sheetPanelCss}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className={sheetHeadCss}>
              <div>
                <h3 id={titleId} className={sheetTitleCss}>{title}</h3>
                {description && <p className={sheetDescCss}>{description}</p>}
              </div>
              <button type="button" className={iconBtnCss} onClick={onClose} aria-label="닫기">
                <X size={18} />
              </button>
            </div>
            <div className={sheetBodyCss}>{children}</div>
            {footer && <div className={sheetFootCss}>{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── 잠깐 떴다 사라지는 알림 ──────────────────────────────────
const toastWrapCss = css({
  position: "fixed",
  left: "0",
  right: "0",
  // 좁은 화면에서는 아래에서 올라오는 창의 버튼을 가리지 않게 위쪽에 띄운다
  top: "calc(12px + env(safe-area-inset-top, 0px))",
  zIndex: "300",
  display: "flex",
  justifyContent: "center",
  paddingInline: "16px",
  pointerEvents: "none",
  "@sm": { top: "auto", bottom: "20px" },
});
const toastCss = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  maxWidth: "32rem",
  paddingInline: "16px",
  paddingBlock: "12px",
  borderRadius: radii.md,
  backgroundColor: colors.textPrimary,
  color: colors.onInk,
  fontSize: "14px",
  lineHeight: "1.5",
  boxShadow: shadows.card,
  pointerEvents: "auto",
});

type ToastKind = "success" | "error";
export type Notify = (message: string, kind?: ToastKind) => void;

export function useToast() {
  const [toast, setToast] = useState<{ id: number; message: string; kind: ToastKind } | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const notify = useCallback<Notify>((message, kind = "success") => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), message, kind });
    // 오류는 읽을 시간을 더 준다
    timer.current = window.setTimeout(() => setToast(null), kind === "error" ? 6000 : 3500);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const toastNode = (
    <div className={toastWrapCss} aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            role="status"
            className={toastCss}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
          >
            {toast.kind === "error" ? (
              <AlertCircle size={16} color={colors.dangerMuted} style={{ flexShrink: 0 }} />
            ) : (
              <Check size={16} color={colors.successMuted} style={{ flexShrink: 0 }} />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return { notify, toastNode };
}

// ─── 불러오지 못했을 때 ───────────────────────────────────────
const stateBoxCss = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: "6px",
  paddingBlock: "48px",
  paddingInline: "20px",
});
const stateTitleCss = css({ fontSize: "15px", fontWeight: "700", color: colors.textSecondary });
const stateDescCss = css({ fontSize: "13px", color: colors.textFaint, lineHeight: "1.6" });

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry: () => void;
  retrying?: boolean;
}

export function ErrorState({
  title = "불러오지 못했어요",
  description = "인터넷 연결을 확인하고 다시 시도해 주세요.",
  onRetry,
  retrying,
}: ErrorStateProps) {
  return (
    <div className={cx(cardCss, stateBoxCss)} role="alert">
      <AlertCircle size={22} color={colors.dangerMuted} />
      <p className={stateTitleCss}>{title}</p>
      <p className={stateDescCss}>{description}</p>
      <button
        type="button"
        className={ghostBtnCss}
        style={{ marginTop: "10px" }}
        onClick={onRetry}
        disabled={retrying}
      >
        <RotateCw size={14} /> {retrying ? "불러오는 중이에요" : "다시 시도"}
      </button>
    </div>
  );
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className={stateBoxCss}>
      {icon && <div style={{ color: colors.textDimmest, marginBottom: "4px" }}>{icon}</div>}
      <p className={stateTitleCss}>{title}</p>
      {description && <p className={stateDescCss}>{description}</p>}
      {action && <div style={{ marginTop: "10px" }}>{action}</div>}
    </div>
  );
}

// ─── 불러오는 동안 보이는 자리 표시 ───────────────────────────
const skelRowCss = css({
  display: "flex",
  alignItems: "center",
  gap: "14px",
  paddingInline: "16px",
  paddingBlock: "16px",
  borderBottom: `1px solid ${colors.borderFaint}`,
  ":last-child": { borderBottom: "none" },
});

export function RowsSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className={cardCss} aria-busy="true" aria-label="불러오는 중">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={skelRowCss}>
          <Skeleton width={40} height={40} radius="9999px" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
            <Skeleton width={`${28 + ((i * 13) % 30)}%`} height={14} />
            <Skeleton width={`${18 + ((i * 7) % 20)}%`} height={11} />
          </div>
          <Skeleton width={84} height={24} radius="9999px" style={{ flexShrink: 0 }} />
        </div>
      ))}
    </div>
  );
}
