import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";

const contentListCss = css({
  display: "flex",
  flexDirection: "column",
  gap: "48px",
  marginBottom: "64px",
});

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
  "& p": { marginBottom: "1em" },
  "& strong": { color: colors.textPrimary, fontWeight: "700" },
  "& em": { fontStyle: "italic" },
  "& ul": { listStyleType: "disc", paddingLeft: "1.5em", marginBottom: "1em" },
  "& ol": { listStyleType: "decimal", paddingLeft: "1.5em", marginBottom: "1em" },
  "& li": { marginBottom: "0.25em" },
  "& a": { color: colors.brand, textDecoration: "underline" },
  "& blockquote": {
    borderLeft: `3px solid ${colors.brand}`,
    paddingLeft: "1em",
    color: colors.textDimmer,
    fontStyle: "italic",
    margin: "1em 0",
  },
});

const noHeadingBodyCss = css({
  color: colors.textMuted,
  lineHeight: "1.9",
  fontSize: "16px",
  "& p": { marginBottom: "1em" },
  "& strong": { color: colors.textPrimary, fontWeight: "700" },
  "& em": { fontStyle: "italic" },
  "& ul": { listStyleType: "disc", paddingLeft: "1.5em", marginBottom: "1em" },
  "& ol": { listStyleType: "decimal", paddingLeft: "1.5em", marginBottom: "1em" },
  "& li": { marginBottom: "0.25em" },
  "& a": { color: colors.brand, textDecoration: "underline" },
  "& blockquote": { borderLeft: `3px solid ${colors.brand}`, paddingLeft: "1em", color: colors.textDimmer, fontStyle: "italic", margin: "1em 0" },
});

const blockImageCss = css({
  width: "100%",
  borderRadius: "1rem",
  objectFit: "cover",
  maxHeight: "480px",
});

const captionCss = css({
  textAlign: "center",
  color: colors.textDimmer,
  fontSize: "13px",
  marginTop: "12px",
});

function ContentBlock({ block, textIndex }) {
  const type = block.type ?? "text";

  if (type === "image") {
    return (
      <figure style={{ margin: 0 }}>
        <img src={block.url} alt={block.caption || ""} className={blockImageCss} />
        {block.caption && <figcaption className={captionCss}>{block.caption}</figcaption>}
      </figure>
    );
  }

  return (
    <div>
      <div className={sectionHeaderCss}>
        {block.heading && (
          <>
            <span className={sectionNumCss}>
              {String(textIndex).padStart(2, "0")}
            </span>
            <h2 className={sectionTitleCss}>{block.heading}</h2>
          </>
        )}
      </div>
      <div className={block.heading ? sectionBodyCss : noHeadingBodyCss}>
        <ReactMarkdown>{block.body}</ReactMarkdown>
      </div>
    </div>
  );
}

export default function ContentBlocks({ content }) {
  if (!content || content.length === 0) return null;

  let textCount = 0;

  return (
    <div className={contentListCss}>
      {content.map((block, i) => {
        const type = block.type ?? "text";
        if (type === "text") textCount++;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.55 }}
          >
            <ContentBlock block={block} textIndex={textCount} />
          </motion.div>
        );
      })}
    </div>
  );
}
