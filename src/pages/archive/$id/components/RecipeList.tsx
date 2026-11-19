import { motion } from "framer-motion";
import { css } from "@/lib/css";
import { colors, fonts } from "@/lib/tokens";
import type { Recipe } from "@/domain/archive/archive-dto";

const sectionCss = css({ marginBottom: "72px" });

const titleCss = css({
  fontFamily: fonts.display,
  fontSize: "28px",
  fontWeight: "500",
  color: colors.textPrimary,
  marginBottom: "28px",
  letterSpacing: "-0.012em",
});

const gridCss = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "20px",
  "@sm": { gridTemplateColumns: "repeat(2,1fr)" },
  "@lg": { gridTemplateColumns: "repeat(3,1fr)" },
});

const cardCss = css({
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderSubtle}`,
  borderRadius: "14px",
  overflow: "hidden",
});

const imgWrapCss = css({
  width: "100%",
  aspectRatio: "4/3",
  backgroundColor: colors.bgSection,
  overflow: "hidden",
  borderBottom: `1px solid ${colors.borderSubtle}`,
});

const imgCss = css({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.4s ease",
  _hover: { transform: "scale(1.04)" },
});

const imgPlaceholderCss = css({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "40px",
  opacity: "0.3",
});

const bodyCss = css({ padding: "20px" });

const nameCss = css({
  color: colors.textPrimary,
  fontFamily: fonts.display,
  fontWeight: "500",
  fontSize: "20px",
  marginBottom: "12px",
  letterSpacing: "-0.008em",
});

const ingredientsCss = css({
  color: colors.textFaint,
  fontSize: "13px",
  lineHeight: "1.7",
  whiteSpace: "pre-line",
});

interface RecipeListProps {
  recipes: Recipe[];
}

export default function RecipeList({ recipes }: RecipeListProps) {
  if (!recipes?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className={sectionCss}
    >
      <h2 className={titleCss}>이날의 레시피</h2>
      <div className={gridCss}>
        {recipes.map((r, i) => (
          <motion.div
            key={i}
            className={cardCss}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 + i * 0.07 }}
          >
            <div className={imgWrapCss}>
              {r.img ? (
                <img src={r.img} alt={r.name} className={imgCss} />
              ) : (
                <div className={imgPlaceholderCss}>🍸</div>
              )}
            </div>
            <div className={bodyCss}>
              <h4 className={nameCss}>{r.name}</h4>
              <p className={ingredientsCss}>{r.ingredients}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
