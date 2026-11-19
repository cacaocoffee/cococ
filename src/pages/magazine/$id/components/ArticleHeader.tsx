import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import TagBadge from "@/components/ui/TagBadge";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";
import type { MagazineItem } from "@/domain/magazine/magazine-dto";

const headerCss = css({ marginTop: "48px", marginBottom: "48px" });

const tagsRowCss = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginBottom: "20px",
});

const titleCss = css({
  fontFamily: "'Newsreader', 'Iowan Old Style', Georgia, serif",
  fontSize: "clamp(36px, 5vw, 60px)",
  fontWeight: "500",
  color: colors.textPrimary,
  lineHeight: "1.06",
  letterSpacing: "-0.016em",
  marginBottom: "28px",
});

const metaRowCss = css({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  fontSize: "13px",
  fontFamily: "ui-monospace, 'JetBrains Mono', Menlo, monospace",
  letterSpacing: "0.06em",
  color: colors.textFaint,
});

const authorCss = css({
  fontWeight: "700",
  color: colors.textPrimary,
  letterSpacing: "0.04em",
});

const readTimeCss = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
});

interface ArticleHeaderProps {
  item: MagazineItem;
}

export default function ArticleHeader({ item }: ArticleHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className={headerCss}
    >
      <div className={tagsRowCss}>
        {(item.tags || []).map((tag) => (
          <TagBadge key={tag} label={tag} variant="amber" />
        ))}
      </div>
      <h1 className={titleCss}>{item.title}</h1>
      <div className={metaRowCss}>
        <span className={authorCss}>{item.author}</span>
        <span>{item.date}</span>
        {item.readTime && (
          <span className={readTimeCss}>
            <Clock size={13} /> {item.readTime} 소요
          </span>
        )}
      </div>
    </motion.div>
  );
}
