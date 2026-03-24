import { motion } from "framer-motion";
import { FileText, Download, ExternalLink } from "lucide-react";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";

const sectionCss = css({ marginBottom: "64px" });

const titleCss = css({
  fontSize: "20px",
  fontWeight: "900",
  color: colors.textPrimary,
  marginBottom: "24px",
});

const gridCss = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "12px",
  "@sm": { gridTemplateColumns: "repeat(2,1fr)" },
});

const cardCss = css({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderLight}`,
  borderRadius: "1rem",
  padding: "20px",
});

const iconWrapCss = css({
  width: "48px",
  height: "48px",
  borderRadius: "0.75rem",
  backgroundColor: "rgba(245,158,11,0.1)",
  color: colors.brand,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: "0",
});

const cardBodyCss = css({ flex: "1 1 0%", minWidth: "0" });

const cardTitleCss = css({
  color: colors.textPrimary,
  fontWeight: "900",
  fontSize: "14px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  marginBottom: "4px",
});

const cardSubCss = css({
  color: colors.textDimmer,
  fontSize: "11px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
});

const actionsCss = css({ display: "flex", gap: "6px", flexShrink: "0" });

const btnCss = css({
  width: "32px",
  height: "32px",
  borderRadius: "0.5rem",
  border: `1px solid ${colors.borderLight}`,
  backgroundColor: "transparent",
  color: colors.textDimmer,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.15s",
  _hover: { color: colors.brand, borderColor: colors.brand },
});

export default function RecipeCards({ recipePdfs }) {
  if (!recipePdfs?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.58 }}
      className={sectionCss}
    >
      <h2 className={titleCss}>레시피 카드</h2>
      <div className={gridCss}>
        {recipePdfs.map((pdf, i) => (
          <motion.div
            key={i}
            className={cardCss}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className={iconWrapCss}>
              <FileText size={22} />
            </div>
            <div className={cardBodyCss}>
              <p className={cardTitleCss}>{pdf.title || `레시피 카드 ${i + 1}`}</p>
              <p className={cardSubCss}>PDF</p>
            </div>
            <div className={actionsCss}>
              <a
                href={pdf.url}
                target="_blank"
                rel="noopener noreferrer"
                className={btnCss}
                title="새 탭에서 보기"
              >
                <ExternalLink size={14} />
              </a>
              <a
                href={pdf.url}
                download={pdf.title || "recipe"}
                className={btnCss}
                title="다운로드"
              >
                <Download size={14} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
