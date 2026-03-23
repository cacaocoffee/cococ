import { motion } from "framer-motion";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";

const excerptCss = css({
  fontSize: "20px",
  color: colors.textSecondary,
  lineHeight: "1.85",
  marginBottom: "56px",
  paddingBottom: "56px",
  borderBottom: `1px solid ${colors.borderMedium}`,
  fontWeight: "300",
});

const contentListCss = css({
  display: "flex",
  flexDirection: "column",
  gap: "48px",
});

const sectionCss = css({});

const sectionHeaderCss = css({
  display: "flex",
  alignItems: "flex-start",
  gap: "16px",
  marginBottom: "16px",
});

const sectionNumCss = css({
  color: colors.brand,
  fontWeight: "900",
  fontSize: "14px",
  marginTop: "4px",
  flexShrink: "0",
});

const sectionTitleCss = css({
  fontSize: "24px",
  fontWeight: "900",
  color: colors.textPrimary,
  lineHeight: "1.375",
});

const sectionBodyCss = css({
  color: colors.textMuted,
  lineHeight: "1.9",
  fontSize: "16px",
  paddingLeft: "36px",
});

export default function ArticleBody({ item }) {
  return (
    <>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={excerptCss}
      >
        {item.excerpt}
      </motion.p>

      <div className={contentListCss}>
        {(item.content || []).map((section, i) => (
          <motion.div
            key={i}
            className={sectionCss}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 + i * 0.08, duration: 0.55 }}
          >
            <div className={sectionHeaderCss}>
              <span className={sectionNumCss}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className={sectionTitleCss}>{section.heading}</h2>
            </div>
            <p className={sectionBodyCss}>{section.body}</p>
          </motion.div>
        ))}
      </div>
    </>
  );
}
