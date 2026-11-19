import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BackButton from "@/components/ui/BackButton";
import { css } from "@/lib/css";
import { fetchInstagramThumbnail } from "@/lib/microlink";
import type { MagazineItem } from "@/domain/magazine/magazine-dto";

const heroSectionCss = css({
  position: "relative",
  height: "50vh",
  overflow: "hidden",
});

const heroImgCss = css({ width: "100%", height: "100%", objectFit: "cover" });

const heroOverlayCss = css({
  position: "absolute",
  inset: "0",
  background: "linear-gradient(to top, #F6EFE2 0%, rgba(246,239,226,0.55) 25%, rgba(33,27,18,0.18) 70%, rgba(33,27,18,0.42) 100%)",
});

const heroBackBtnCss = css({
  position: "absolute",
  top: "24px",
  left: "24px",
  "@md": { left: "48px" },
});

interface ArticleHeroProps {
  item: MagazineItem;
}

export default function ArticleHero({ item }: ArticleHeroProps) {
  const [thumb, setThumb] = useState(item.img || "");
  useEffect(() => {
    if (item.img) return;
    if (item.magazineType !== "cardnews") return;
    const firstUrl = item.instagramUrls?.[0];
    if (!firstUrl) return;
    const controller = new AbortController();
    void fetchInstagramThumbnail(firstUrl, { signal: controller.signal }).then((url) => {
      if (url && !controller.signal.aborted) setThumb(url);
    });
    return () => controller.abort();
  }, [item.img, item.magazineType, item.instagramUrls?.[0]]);

  return (
    <div className={heroSectionCss}>
      <motion.img
        src={thumb}
        alt={item.title}
        className={heroImgCss}
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
      />
      <div className={heroOverlayCss} />
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className={heroBackBtnCss}
      >
        <BackButton label="Magazine" tone="onDark" />
      </motion.div>
    </div>
  );
}
