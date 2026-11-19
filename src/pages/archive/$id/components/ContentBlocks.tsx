import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { css } from "@/lib/css";
import { colors, fonts } from "@/lib/tokens";

const contentListCss = css({
  display: "flex",
  flexDirection: "column",
  gap: "56px",
  marginBottom: "72px",
});

const sectionHeaderCss = css({
  display: "flex",
  alignItems: "baseline",
  gap: "16px",
  marginBottom: "20px",
});

const sectionNumCss = css({
  color: colors.brand,
  fontFamily: fonts.mono,
  fontWeight: "700",
  fontSize: "12px",
  letterSpacing: "0.18em",
  flexShrink: "0",
});

const sectionTitleCss = css({
  fontFamily: fonts.display,
  fontSize: "28px",
  fontWeight: "500",
  color: colors.textPrimary,
  lineHeight: "1.18",
  letterSpacing: "-0.012em",
});

const sectionBodyCss = css({
  color: colors.textSecondary,
  lineHeight: "1.85",
  fontSize: "17px",
  paddingLeft: "0",
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
  color: colors.textSecondary,
  lineHeight: "1.85",
  fontSize: "17px",
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
  borderRadius: "4px",
  objectFit: "cover",
  maxHeight: "560px",
  border: `1px solid ${colors.borderSubtle}`,
});

const captionCss = css({
  textAlign: "center",
  color: colors.textFaint,
  fontFamily: fonts.mono,
  fontSize: "12px",
  letterSpacing: "0.06em",
  marginTop: "14px",
});

interface ContentBlock {
  type?: string;
  heading?: string;
  body?: string;
  url?: string;
  caption?: string;
}

interface ContentBlockProps {
  block: ContentBlock;
  textIndex: number;
}

function ContentBlockItem({ block, textIndex }: ContentBlockProps) {
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

interface ContentBlocksProps {
  content: unknown[];
}

export default function ContentBlocks({ content }: ContentBlocksProps) {
  if (!content || content.length === 0) return null;

  let textCount = 0;

  return (
    <div className={contentListCss}>
      {content.map((block, i) => {
        const b = block as ContentBlock;
        const type = b.type ?? "text";
        if (type === "text") textCount++;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.55 }}
          >
            <ContentBlockItem block={b} textIndex={textCount} />
          </motion.div>
        );
      })}
    </div>
  );
}
