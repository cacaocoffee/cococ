import { motion } from "framer-motion";
import { FileText, Download, ExternalLink } from "lucide-react";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";

const sectionCss = css({ marginBottom: "64px" });

const titleCss = css({
  fontFamily: "'Space Grotesk', 'Apple SD Gothic Neo', 'Noto Sans KR', system-ui, sans-serif",
  fontSize: "28px",
  fontWeight: "700",
  color: colors.textPrimary,
  marginBottom: "28px",
  letterSpacing: "-0.012em",
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
  border: "none",
  borderRadius: "20px",
  padding: "20px",
});

const iconWrapCss = css({
  width: "48px",
  height: "48px",
  borderRadius: "10px",
  backgroundColor: colors.bgSection,
  color: colors.textPrimary,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: "0",
});

const cardBodyCss = css({ flex: "1 1 0%", minWidth: "0" });

const cardTitleCss = css({
  color: colors.textPrimary,
  fontWeight: "700",
  fontSize: "14px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  marginBottom: "4px",
});

const cardSubCss = css({
  color: colors.textDimmer,
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0",
});

const actionsCss = css({ display: "flex", gap: "6px", flexShrink: "0" });

const btnCss = css({
  width: "32px",
  height: "32px",
  borderRadius: "10px",
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

interface RecipePdf {
  title?: string;
  url: string;
}

interface RecipeCardsProps {
  recipePdfs: RecipePdf[];
}

export default function RecipeCards({ recipePdfs }: RecipeCardsProps) {
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
