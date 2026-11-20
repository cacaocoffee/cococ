import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";
import type { MagazineItem } from "@/domain/magazine/magazine-dto";

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
  fontFamily: "'Space Grotesk', 'Apple SD Gothic Neo', 'Noto Sans KR', system-ui, sans-serif",
  fontSize: "22px",
});

const othersTitleCss = css({
  fontFamily: "'Space Grotesk', 'Apple SD Gothic Neo', 'Noto Sans KR', system-ui, sans-serif",
  fontSize: "24px",
  fontWeight: "700",
  color: colors.textPrimary,
  marginBottom: "28px",
  letterSpacing: "-0.012em",
});

const othersGridCss = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "20px",
  "@sm": { gridTemplateColumns: "repeat(2,1fr)" },
});

const otherCardCss = css({
  backgroundColor: colors.bgCard,
  border: "none",
  borderRadius: "20px",
  overflow: "hidden",
  textDecoration: "none",
  display: "block",
  transition: "border-color 0.2s",
  _hover: { borderColor: colors.borderStrong },
});

const otherImgWrapCss = css({ height: "144px", overflow: "hidden", backgroundColor: colors.bgSection });

const otherImgCss = css({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 500ms",
  _groupHover: { transform: "scale(1.05)" },
});

const otherBodyCss = css({ padding: "20px" });

const otherMetaCss = css({
  color: colors.textMuted,
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0",
  marginBottom: "10px",
});

const otherTitleCss = css({
  color: colors.textPrimary,
  fontFamily: "'Space Grotesk', 'Apple SD Gothic Neo', 'Noto Sans KR', system-ui, sans-serif",
  fontWeight: "700",
  fontSize: "17px",
  letterSpacing: "-0.005em",
  lineHeight: "1.22",
  transition: "color 0.2s",
  display: "-webkit-box",
  "-webkit-line-clamp": "2",
  "-webkit-box-orient": "vertical",
  overflow: "hidden",
  _groupHover: { color: colors.brand },
});

interface RelatedArticlesProps {
  others: MagazineItem[];
}

export default function RelatedArticles({ others }: RelatedArticlesProps) {
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
