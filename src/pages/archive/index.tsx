import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Archive as ArchiveIcon } from "lucide-react";
import { useArchiveList } from "@/domain/archive/archive-query-options";
import PageWrapper from "@/components/ui/PageWrapper";
import SectionTitle from "@/components/ui/SectionTitle";
import ArchiveCard from "@/components/ui/ArchiveCard";
import FilterButton from "@/components/ui/FilterButton";
import Skeleton from "@/components/ui/Skeleton";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";

const CATEGORIES = ["전체", "정기 클래스", "MT/파티", "외부 협업"];

const pageCss = css({
  paddingTop: "128px",
  paddingBottom: "96px",
  paddingInline: "24px",
  maxWidth: "80rem",
  marginInline: "auto",
  "@md": { paddingInline: "48px" },
});

const filterRowCss = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  marginBottom: "40px",
  alignItems: "center",
});

const filterRightCss = css({
  marginLeft: "auto",
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
});

const selectWrapCss = css({ position: "relative" });

const selectCss = css({
  appearance: "none",
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderLight}`,
  color: colors.textMuted,
  fontSize: "12px",
  paddingBlock: "8px",
  paddingLeft: "16px",
  paddingRight: "36px",
  borderRadius: "0.5rem",
  outline: "none",
  cursor: "pointer",
  transition: "border-color 0.2s",
  _focus: { borderColor: colors.brand },
});

const selectIconCss = css({
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  color: colors.textDimmer,
  pointerEvents: "none",
});

const searchWrapCss = css({ position: "relative" });

const searchInputCss = css({
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderLight}`,
  color: colors.textPrimary,
  fontSize: "12px",
  paddingBlock: "8px",
  paddingLeft: "36px",
  paddingRight: "16px",
  borderRadius: "0.5rem",
  outline: "none",
  width: "192px",
  transition: "border-color 0.2s",
  _focus: { borderColor: colors.brand },
});

const searchIconCss = css({
  position: "absolute",
  left: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  color: colors.textDimmer,
  pointerEvents: "none",
});

const emptyCss = css({
  color: colors.textFaint,
  fontSize: "14px",
  paddingBlock: "64px",
  textAlign: "center",
});

const emptyStateCss = css({
  textAlign: "center",
  paddingBlock: "96px",
  color: colors.textFaint,
});

const emptyIconCss = css({
  marginInline: "auto",
  marginBottom: "16px",
  opacity: "0.35",
});

const emptyTitleCss = css({
  fontSize: "16px",
  fontWeight: "700",
  color: colors.textMuted,
  marginBottom: "8px",
});

const emptySubCss = css({
  fontSize: "13px",
  color: colors.textDimmer,
});

const skeletonCardCss = css({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

const gridCss = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "24px",
  "@sm": { gridTemplateColumns: "repeat(2,1fr)" },
  "@lg": { gridTemplateColumns: "repeat(3,1fr)" },
  "@xl": { gridTemplateColumns: "repeat(4,1fr)" },
});

export default function ArchivePage() {
  const [filter, setFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("전체");
  const [baseFilter, setBaseFilter] = useState("전체");
  const { data: items = [], isLoading } = useArchiveList();

  const filtered = items.filter((d) => {
    const catOk = filter === "전체" || d.category === filter;
    const yearOk = yearFilter === "전체" || d.year === yearFilter;
    const baseOk = baseFilter === "전체" || d.base === baseFilter;
    const searchOk =
      !search || d.title.toLowerCase().includes(search.toLowerCase());
    return catOk && yearOk && baseOk && searchOk;
  });

  return (
    <PageWrapper>
      <div className={pageCss}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SectionTitle
            title="Activity Archive"
            subtitle="코콕의 모든 역동적인 순간들을 필터링하여 확인하세요."
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={filterRowCss}
        >
          {CATEGORIES.map((cat) => (
            <FilterButton
              key={cat}
              label={cat}
              active={filter === cat}
              onClick={() => setFilter(cat)}
            />
          ))}
          <div className={filterRightCss}>
            <div className={selectWrapCss}>
              <select
                value={baseFilter}
                onChange={(e) => setBaseFilter(e.target.value)}
                className={selectCss}
              >
                <option value="전체">전체 베이스</option>
                {[...new Set(items.map((d) => d.base).filter(Boolean))].sort().map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <span className={selectIconCss}>
                <ChevronDown size={14} />
              </span>
            </div>
            <div className={selectWrapCss}>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className={selectCss}
              >
                <option value="전체">전체 연도</option>
                {[...new Set(items.map((d) => d.year))]
                  .sort((a, b) => Number(b) - Number(a))
                  .map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
              </select>
              <span className={selectIconCss}>
                <ChevronDown size={14} />
              </span>
            </div>
            <div className={searchWrapCss}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search activities..."
                className={searchInputCss}
              />
              <span className={searchIconCss}>
                <Search size={14} />
              </span>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className={gridCss}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={skeletonCardCss}>
                <Skeleton height="208px" radius="0.75rem" />
                <Skeleton width="40%" height="11px" />
                <Skeleton width="80%" height="16px" />
                <Skeleton width="60%" height="12px" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className={emptyStateCss}>
            <div className={emptyIconCss}><ArchiveIcon size={40} /></div>
            <p className={emptyTitleCss}>아직 등록된 활동이 없습니다.</p>
            <p className={emptySubCss}>곧 코콕의 활동들이 이 곳에 채워질 예정입니다.</p>
          </div>
        ) : filtered.length === 0 ? (
          <p className={emptyCss}>검색 결과가 없습니다.</p>
        ) : (
          <motion.div layout className={gridCss}>
            <AnimatePresence mode="popLayout" initial={false}>
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.15) }}
                >
                  <ArchiveCard item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
}
