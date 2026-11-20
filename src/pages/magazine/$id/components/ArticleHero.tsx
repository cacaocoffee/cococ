import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BackButton from "@/components/ui/BackButton";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";
import { fetchInstagramThumbnail } from "@/lib/microlink";
import type { MagazineItem } from "@/domain/magazine/magazine-dto";

// 표지 사진은 둥근 카드로 화면 양옆 여백 안에 둔다. 사진 위에 글자를 얹지 않아 그라데이션이 필요 없다
const heroSectionCss = css({
  position: "relative",
  height: "44vh",
  minHeight: "260px",
  marginInline: "16px",
  marginTop: "8px",
  borderRadius: "28px",
  overflow: "hidden",
  backgroundColor: colors.bgInk,
  "@md": { marginInline: "32px", height: "50vh" },
});

const heroImgCss = css({ width: "100%", height: "100%", objectFit: "cover" });

const heroOverlayCss = css({ display: "none" });

// 사진 위의 뒤로 가기: 흰 알약
const heroBackBtnCss = css({
  position: "absolute",
  top: "14px",
  left: "14px",
  backgroundColor: colors.bgCard,
  borderRadius: "9999px",
  paddingInline: "14px",
  paddingBlock: "4px",
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
        <BackButton label="Magazine" />
      </motion.div>
    </div>
  );
}
