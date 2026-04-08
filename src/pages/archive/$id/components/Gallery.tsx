import { motion } from "framer-motion";
import { css } from "@/lib/css";

const gallerySectionCss = css({ marginBottom: "64px" });

const galleryTitleCss = css({
  fontSize: "20px",
  fontWeight: "900",
  color: "#ffffff",
  marginBottom: "24px",
});

const galleryCss = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "12px",
  "@sm": { gridTemplateColumns: "repeat(3,1fr)" },
});

const galleryWideItemCss = css({
  overflow: "hidden",
  borderRadius: "0.75rem",
  "@sm": { gridColumn: "span 2 / span 2", aspectRatio: "16/9" },
});

const gallerySquareItemCss = css({
  overflow: "hidden",
  borderRadius: "0.75rem",
  aspectRatio: "1/1",
});

const galleryImgCss = css({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

interface GalleryProps {
  gallery: string[];
}

export default function Gallery({ gallery }: GalleryProps) {
  if (!gallery?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      className={gallerySectionCss}
    >
      <h2 className={galleryTitleCss}>Gallery</h2>
      <div className={galleryCss}>
        {gallery.map((src, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className={i === 0 ? galleryWideItemCss : gallerySquareItemCss}
          >
            <img src={src} alt={`gallery-${i}`} className={galleryImgCss} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
