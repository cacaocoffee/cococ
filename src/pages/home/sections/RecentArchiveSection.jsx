import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ARCHIVE_DATA } from "../../../data";
import SectionTitle from "../../../components/ui/SectionTitle";
import ArchiveCard from "../../../components/ui/ArchiveCard";
import { css } from "../../../lib/css";
import { colors } from "../../../lib/tokens";

function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

const archiveSectionCss = css({
  paddingBottom: "96px",
  paddingInline: "24px",
  paddingTop: "16px",
  maxWidth: "80rem",
  marginInline: "auto",
  "@md": { paddingInline: "48px" },
});

const archiveHeaderCss = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  marginBottom: "48px",
  flexWrap: "wrap",
  gap: "16px",
});

const moreLinkCss = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  color: colors.brand,
  fontWeight: "700",
  fontSize: "14px",
  textDecoration: "none",
  marginBottom: "40px",
  _hover: { textDecoration: "underline" },
});

const archiveGridCss = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "32px",
  "@md": { gridTemplateColumns: "repeat(3,1fr)" },
});

export default function RecentArchiveSection() {
  return (
    <section className={archiveSectionCss}>
      <FadeUp>
        <div className={archiveHeaderCss}>
          <SectionTitle
            title="Recent Archive"
            subtitle="최근 진행된 코콕의 활동들을 만나보세요."
          />
          <Link to="/archive" className={moreLinkCss}>
            더보기 <ChevronRight size={18} />
          </Link>
        </div>
      </FadeUp>
      <div className={archiveGridCss}>
        {ARCHIVE_DATA.slice(0, 3).map((item, i) => (
          <ArchiveCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
