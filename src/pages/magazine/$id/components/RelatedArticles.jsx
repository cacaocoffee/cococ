import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { css } from "../../../../lib/css";
import { colors } from "../../../../lib/tokens";

const dividerCss = css({
  marginBlock: "80px",
  display: "flex",
  alignItems: "center",
  gap: "16px",
});

const dividerLineCss = css({
  flex: "1 1 0%",
  height: "1px",
  backgroundColor: colors.borderMedium,
});

const dividerStarCss = css({
  color: colors.brand,
  fontWeight: "900",
  fontSize: "18px",
});

const othersTitleCss = css({
  fontSize: "18px",
  fontWeight: "900",
  color: colors.textPrimary,
  marginBottom: "24px",
});

const othersGridCss = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "20px",
  "@sm": { gridTemplateColumns: "repeat(2,1fr)" },
});

const otherCardCss = css({
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderSubtle}`,
  borderRadius: "1rem",
  overflow: "hidden",
  textDecoration: "none",
  display: "block",
});

const otherImgWrapCss = css({ height: "144px", overflow: "hidden" });

const otherImgCss = css({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 500ms",
  _groupHover: { transform: "scale(1.05)" },
});

const otherBodyCss = css({ padding: "20px" });

const otherMetaCss = css({
  color: colors.brand,
  fontSize: "10px",
  fontWeight: "700",
  marginBottom: "8px",
});

const otherTitleCss = css({
  color: colors.textPrimary,
  fontWeight: "700",
  fontSize: "14px",
  lineHeight: "1.375",
  transition: "color 0.2s",
  display: "-webkit-box",
  "-webkit-line-clamp": "2",
  "-webkit-box-orient": "vertical",
  overflow: "hidden",
  _groupHover: { color: colors.brand },
});

export default function RelatedArticles({ others }) {
  return (
    <>
      <div className={dividerCss}>
        <div className={dividerLineCss} />
        <span className={dividerStarCss}>✦</span>
        <div className={dividerLineCss} />
      </div>

      {others.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className={othersTitleCss}>다음으로 읽을 아티클</h3>
          <div className={othersGridCss}>
            {others.map((post) => (
              <Link
                key={post.id}
                to="/magazine/$id"
                params={{ id: String(post.id) }}
                className={`group ${otherCardCss}`}
              >
                <div className={otherImgWrapCss}>
                  <img
                    src={post.img}
                    alt={post.title}
                    className={otherImgCss}
                  />
                </div>
                <div className={otherBodyCss}>
                  <p className={otherMetaCss}>
                    {post.author} · {post.date}
                  </p>
                  <h4 className={otherTitleCss}>{post.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}
