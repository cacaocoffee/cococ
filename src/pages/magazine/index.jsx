import { motion } from "framer-motion";
import { useMagazineList } from "@/hooks/useMagazine";
import PageWrapper from "@/components/ui/PageWrapper";
import SectionTitle from "@/components/ui/SectionTitle";
import MagazineCard from "@/components/ui/MagazineCard";
import { css } from "@/lib/css";

const pageCss = css({
  paddingTop: "128px",
  paddingBottom: "96px",
  paddingInline: "24px",
  maxWidth: "64rem",
  marginInline: "auto",
  "@md": { paddingInline: "48px" },
});

const listCss = css({
  display: "flex",
  flexDirection: "column",
  gap: "64px",
});

export default function MagazinePage() {
  const { data: items = [] } = useMagazineList();
  return (
    <PageWrapper>
      <div className={pageCss}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SectionTitle
            title="COCOC Magazine"
            subtitle="주류 문화에 대한 심도 있는 이야기"
          />
        </motion.div>
        <div className={listCss}>
          {items.map((post, i) => (
            <MagazineCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
