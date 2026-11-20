// 회원 한 명을 이름으로 찾아 고르는 입력칸.
// 목록은 입력칸 바로 아래에 펼쳐져 화면을 밀어낸다. 좁은 화면이나 겹쳐 뜨는 창 안에서도 잘리지 않게 하려는 것이다.
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { css, cx } from "@/lib/css";
import { colors, radii } from "@/lib/tokens";
import type { HrMember } from "@/domain/hr/hr-dto";
import { STATUS_LABEL, normalizeName } from "@/domain/hr/hr-format";
import { duesText } from "./DuesPill";
import { iconBtnCss, inputCss } from "./styles";

const wrapCss = css({ position: "relative", minWidth: "0" });
const searchIconCss = css({
  position: "absolute",
  left: "13px",
  top: "22px",
  transform: "translateY(-50%)",
  color: colors.textDimmer,
  pointerEvents: "none",
});
const listCss = css({
  marginTop: "6px",
  maxHeight: "232px",
  overflowY: "auto",
  backgroundColor: colors.bgSection,
  border: "none",
  borderRadius: radii.md,
  padding: "4px",
});
const optionCss = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
  width: "100%",
  minHeight: "40px",
  paddingInline: "10px",
  paddingBlock: "6px",
  borderRadius: "7px",
  border: "none",
  background: "none",
  fontFamily: "inherit",
  textAlign: "left",
  cursor: "pointer",
  _hover: { backgroundColor: colors.bgCard },
});
const optionActiveCss = css({ backgroundColor: colors.bgCard });
const optionNameCss = css({ fontSize: "14px", fontWeight: "700", color: colors.textPrimary });
const optionMetaCss = css({ fontSize: "12px", color: colors.textFaint, marginLeft: "6px" });
const optionDuesCss = css({
  fontSize: "12px",
  color: colors.textFaint,
  whiteSpace: "nowrap",
  fontVariantNumeric: "tabular-nums",
});
const emptyCss = css({ padding: "14px 10px", fontSize: "13px", color: colors.textFaint });
const selectedCss = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
  minHeight: "44px",
  paddingLeft: "14px",
  paddingRight: "4px",
  backgroundColor: colors.bgSection,
  border: "none",
  borderRadius: radii.md,
});

interface MemberPickerProps {
  members: HrMember[];
  value: number | null;
  onChange: (id: number | null) => void;
  placeholder?: string;
  /** 탈퇴한 회원도 목록에 넣을지 */
  includeLeft?: boolean;
}

export default function MemberPicker({
  members,
  value,
  onChange,
  placeholder = "회원 이름으로 찾기",
  includeLeft = false,
}: MemberPickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = value === null ? null : members.find((m) => m.id === value) ?? null;

  const options = useMemo(() => {
    const q = normalizeName(query);
    return members
      .filter((m) => includeLeft || m.status !== "left")
      .filter((m) => {
        if (!q) return true;
        return [m.name, ...m.depositNames].some((n) => normalizeName(n).includes(q)) ||
          m.phone.replace(/-/g, "").includes(q);
      });
  }, [members, query, includeLeft]);

  // 입력칸 바깥을 누르면 목록을 닫는다
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const pick = (m: HrMember) => {
    onChange(m.id);
    setOpen(false);
    setQuery("");
  };

  if (selected) {
    return (
      <div className={selectedCss}>
        <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          <span className={optionNameCss}>{selected.name}</span>
          <span className={optionMetaCss}>
            {selected.generation > 0 ? `${selected.generation}기 · ` : ""}
            {duesText(selected)}
          </span>
        </span>
        <button
          type="button"
          className={iconBtnCss}
          aria-label="다른 회원 고르기"
          onClick={() => {
            onChange(null);
            setOpen(true);
            // 선택을 지우면 입력칸이 새로 그려지므로, 그 뒤에 커서를 둔다
            window.setTimeout(() => inputRef.current?.focus(), 0);
          }}
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className={wrapCss} ref={wrapRef}>
      <Search size={15} className={searchIconCss} />
      <input
        ref={inputRef}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        className={inputCss}
        style={{ paddingLeft: "36px" }}
        placeholder={placeholder}
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setActive((i) => Math.min(i + 1, options.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter") {
            // 한글을 조합하는 중에 누른 Enter는 글자를 확정하는 것이라 넘긴다
            if (e.nativeEvent.isComposing) return;
            e.preventDefault();
            if (open && options[active]) pick(options[active]);
          } else if (e.key === "Escape" && open) {
            e.stopPropagation();
            setOpen(false);
          }
        }}
      />
      {open && (
        <div className={listCss} role="listbox">
          {options.length === 0 ? (
            <p className={emptyCss}>이 이름으로 찾은 회원이 없어요.</p>
          ) : (
            options.map((m, i) => (
              <button
                key={m.id}
                type="button"
                role="option"
                aria-selected={i === active}
                className={cx(optionCss, i === active && optionActiveCss)}
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(m)}
              >
                <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  <span className={optionNameCss}>{m.name}</span>
                  <span className={optionMetaCss}>
                    {m.generation > 0 ? `${m.generation}기` : ""}
                    {m.status !== "active" ? ` · ${STATUS_LABEL[m.status]}` : ""}
                  </span>
                </span>
                <span className={optionDuesCss}>{duesText(m)}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
