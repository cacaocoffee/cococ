import { motion } from "framer-motion";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";

const recipesSectionCss = css({ marginBottom: "64px" });

const recipesTitleCss = css({
  fontSize: "20px",
  fontWeight: "900",
  color: colors.textPrimary,
  marginBottom: "24px",
});

const recipesGridCss = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "16px",
  "@sm": { gridTemplateColumns: "repeat(2,1fr)" },
});

const recipeCardCss = css({
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderLight}`,
  borderRadius: "1rem",
  padding: "24px",
});

const recipeNumCss = css({
  width: "32px",
  height: "32px",
  backgroundColor: "rgba(245,158,11,0.1)",
  color: colors.brand,
  borderRadius: "9999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: "900",
  marginBottom: "16px",
});

const recipeNameCss = css({
  color: colors.textPrimary,
  fontWeight: "900",
  fontSize: "18px",
  marginBottom: "8px",
});

const recipeIngCss = css({
  color: colors.textFaint,
  fontSize: "14px",
  lineHeight: "1.625",
});

export default function RecipeList({ recipes }) {
  if (!recipes?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className={recipesSectionCss}
    >
      <h2 className={recipesTitleCss}>이날의 레시피</h2>
      <div className={recipesGridCss}>
        {recipes.map((r, i) => (
          <div key={i} className={recipeCardCss}>
            <div className={recipeNumCss}>{i + 1}</div>
            <h4 className={recipeNameCss}>{r.name}</h4>
            <p className={recipeIngCss}>{r.ingredients}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
