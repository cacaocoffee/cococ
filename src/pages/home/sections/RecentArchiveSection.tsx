import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useArchiveList } from "@/domain/archive/archive-query-options";
import ArchiveCard from "@/components/ui/ArchiveCard";
import { ARCHIVE_DATA } from "@/data";
import { css } from "@/lib/css";
import { colors, fonts } from "@/lib/tokens";

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

function FadeUp({ children, delay = 0, className = "" }: FadeUpProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

const archiveSectionCss = css({
  paddingBlock: "112px",
  paddingInline: "24px",
  backgroundColor: colors.bgPage,
  borderTop: `1px solid ${colors.borderFaint}`,
  "@md": { paddingInline: "48px" },
});

const sectionInnerCss = css({
  maxWidth: "80rem",
  marginInline: "auto",
});

const sectionHeaderCss = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "20px",
  alignItems: "end",
  marginBottom: "56px",
  "@md": { gridTemplateColumns: "1fr auto" },
});

const headerTextCss = css({
  display: "flex",
  flexDirection: "column",
});

const sectionKickerCss = css({
  fontFamily: fonts.mono,
  fontSize: "11px",
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  color: colors.brand,
  marginBottom: "16px",
});

const sectionHeadlineCss = css({
  fontFamily: fonts.display,
  fontSize: "clamp(32px, 4vw, 48px)",
  fontWeight: "500",
  color: colors.textPrimary,
  lineHeight: "1.08",
  letterSpacing: "-0.014em",
  textWrap: "balance",
} as Parameters<typeof css>[0]);

const moreLinkCss = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  color: colors.textPrimary,
  fontWeight: "600",
  fontSize: "14px",
  textDecoration: "none",
  paddingBlock: "8px",
  borderBottom: `1px solid ${colors.textPrimary}`,
  alignSelf: "start",
  transition: "color 0.2s, border-color 0.2s",
  _hover: { color: colors.brand, borderColor: colors.brand },
});

const archiveGridCss = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "32px",
  "@md": { gridTemplateColumns: "repeat(3,1fr)" },
});

export default function RecentArchiveSection() {
  const { data: items = [] } = useArchiveList();
  const source = items.length > 0 ? items : ARCHIVE_DATA;
  const recent = [...source].sort((a, b) => b.id - a.id).slice(0, 3);

  return (
    <section className={archiveSectionCss}>
      <div className={sectionInnerCss}>
        <FadeUp>
          <div className={sectionHeaderCss}>
            <div className={headerTextCss}>
              <span className={sectionKickerCss}>§ Archive — Recent Sessions</span>
              <h3 className={sectionHeadlineCss}>
                지난 잔의 기록들.
              </h3>
            </div>
            <Link to="/archive" className={moreLinkCss}>
              전체 아카이브 <ArrowUpRight size={16} />
            </Link>
          </div>
        </FadeUp>
        <div className={archiveGridCss}>
          {recent.map((item) => (
            <ArchiveCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
