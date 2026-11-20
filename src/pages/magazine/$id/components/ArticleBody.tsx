import { useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { css } from "@/lib/css";
import { colors, fonts } from "@/lib/tokens";
import type { MagazineItem } from "@/domain/magazine/magazine-dto";

const excerptCss = css({
  fontFamily: fonts.display,
  fontSize: "22px",
  color: colors.textPrimary,
  lineHeight: "1.55",
  marginBottom: "56px",
  paddingBottom: "56px",
  borderBottom: `1px solid ${colors.borderMedium}`,
  fontWeight: "700",
  letterSpacing: "-0.005em",
});

const contentListCss = css({
  display: "flex",
  flexDirection: "column",
  gap: "56px",
});

const sectionHeaderCss = css({
  display: "flex",
  alignItems: "baseline",
  gap: "16px",
  marginBottom: "20px",
});

const sectionNumCss = css({
  color: colors.textPrimary,
  backgroundColor: colors.bgCard,
  borderRadius: "9999px",
  paddingInline: "10px",
  paddingBlock: "3px",
  fontFamily: fonts.display,
  fontWeight: "700",
  fontSize: "13px",
  flexShrink: "0",
});

const sectionTitleCss = css({
  fontFamily: fonts.display,
  fontSize: "28px",
  fontWeight: "700",
  color: colors.textPrimary,
  lineHeight: "1.2",
  letterSpacing: "-0.03em",
});

const sectionBodyCss = css({
  color: colors.textSecondary,
  lineHeight: "1.85",
  fontSize: "17px",
  paddingLeft: "0",
  "& p": { marginBottom: "1em" },
  "& strong": { color: colors.textPrimary, fontWeight: "700" },
  "& em": { },
  "& ul": { listStyleType: "disc", paddingLeft: "1.5em", marginBottom: "1em" },
  "& ol": { listStyleType: "decimal", paddingLeft: "1.5em", marginBottom: "1em" },
  "& li": { marginBottom: "0.25em" },
  "& a": { color: colors.brand, textDecoration: "underline" },
  "& blockquote": {
    backgroundColor: colors.bgCard,
    borderRadius: "16px",
    padding: "16px 20px",
    color: colors.textMuted,
    margin: "1em 0",
  },
});

const blockImageCss = css({
  width: "100%",
  borderRadius: "20px",
  objectFit: "cover",
  maxHeight: "560px",
});

const captionCss = css({
  textAlign: "center",
  color: colors.textFaint,
  fontSize: "13px",
  marginTop: "14px",
});

const instagramWrapCss = css({
  display: "flex",
  flexDirection: "column",
  gap: "32px",
  alignItems: "center",
});

interface InstagramEmbedProps {
  urls: string[];
}

function InstagramEmbed({ urls }: InstagramEmbedProps) {
  useEffect(() => {
    const process = () => {
      if ((window as Window & { instgrm?: { Embeds: { process: () => void } } }).instgrm) {
        (window as Window & { instgrm?: { Embeds: { process: () => void } } }).instgrm!.Embeds.process();
      }
    };
    if ((window as Window & { instgrm?: { Embeds: { process: () => void } } }).instgrm) {
      process();
    } else {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = process;
      document.body.appendChild(script);
    }
  }, [urls]);

  return (
    <div className={instagramWrapCss}>
      {urls.map((url, i) => (
        <blockquote
          key={i}
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-captioned
          data-instgrm-version="14"
          style={{
            background: "#fff",
            border: 0,
            borderRadius: "3px",
            boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
            margin: "1px",
            maxWidth: "540px",
            minWidth: "326px",
            padding: 0,
            width: "calc(100% - 2px)",
          }}
        />
      ))}
    </div>
  );
}

interface ArticleBlock {
  type?: string;
  heading?: string;
  body?: string;
  url?: string;
  caption?: string;
}

interface ArticleBlockItemProps {
  block: ArticleBlock;
  textIndex: number;
}

function ArticleBlockItem({ block, textIndex }: ArticleBlockItemProps) {
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
      <div className={block.heading ? sectionBodyCss : css({
        color: colors.textSecondary, lineHeight: "1.85", fontSize: "17px",
        "& p": { marginBottom: "1em" },
        "& strong": { color: colors.textPrimary, fontWeight: "700" },
        "& em": { },
        "& ul": { listStyleType: "disc", paddingLeft: "1.5em", marginBottom: "1em" },
        "& ol": { listStyleType: "decimal", paddingLeft: "1.5em", marginBottom: "1em" },
        "& li": { marginBottom: "0.25em" },
        "& a": { color: colors.brand, textDecoration: "underline" },
        "& blockquote": { backgroundColor: colors.bgCard, borderRadius: "16px", padding: "16px 20px", color: colors.textMuted, margin: "1em 0" },
      })}>
        <ReactMarkdown>{block.body}</ReactMarkdown>
      </div>
    </div>
  );
}

interface ArticleBodyProps {
  item: MagazineItem;
}

export default function ArticleBody({ item }: ArticleBodyProps) {
  let textCount = 0;
  const isCardNews = item.magazineType === "cardnews";

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

      {isCardNews ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.55 }}
        >
          <InstagramEmbed urls={item.instagramUrls || []} />
        </motion.div>
      ) : (
        <div className={contentListCss}>
          {(item.content || []).map((block, i) => {
            const b = block as ArticleBlock;
            const type = b.type ?? "text";
            if (type === "text") textCount++;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.08, duration: 0.55 }}
              >
                <ArticleBlockItem block={b} textIndex={textCount} />
              </motion.div>
            );
          })}
        </div>
      )}
    </>
  );
}
