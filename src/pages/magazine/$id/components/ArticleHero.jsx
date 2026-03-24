import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BackButton from "@/components/ui/BackButton";
import { css } from "@/lib/css";

const heroSectionCss = css({
  position: "relative",
  height: "50vh",
  overflow: "hidden",
});

const heroImgCss = css({ width: "100%", height: "100%", objectFit: "cover" });

const heroOverlayCss = css({
  position: "absolute",
  inset: "0",
  background: "linear-gradient(to top, #0a0a0a, rgba(0,0,0,0.5), transparent)",
});

const heroBackBtnCss = css({
  position: "absolute",
  top: "24px",
  left: "24px",
  "@md": { left: "48px" },
});

export default function ArticleHero({ item }) {
  const [thumb, setThumb] = useState(item.img || "");
  useEffect(() => {
    if (item.img) return;
    if (item.magazineType !== "cardnews") return;
    const firstUrl = item.instagramUrls?.[0];
    if (!firstUrl) return;
    fetch(`https://api.microlink.io/?url=${encodeURIComponent(firstUrl)}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.status === "success" && json.data?.image?.url) {
          setThumb(json.data.image.url);
        }
      })
      .catch(() => {});
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
