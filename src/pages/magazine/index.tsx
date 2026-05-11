import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useMagazineList } from "@/domain/magazine/magazine-query-options";
import PageWrapper from "@/components/ui/PageWrapper";
import SectionTitle from "@/components/ui/SectionTitle";
import MagazineCard from "@/components/ui/MagazineCard";
import Skeleton from "@/components/ui/Skeleton";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";

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

const skelRowCss = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "16px",
  "@sm": { gridTemplateColumns: "4fr 5fr", gap: "32px" },
});

const skelTextColCss = css({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  justifyContent: "center",
});

const emptyStateCss = css({
  textAlign: "center",
  paddingBlock: "96px",
  color: colors.textFaint,
});

const emptyIconCss = css({
  marginInline: "auto",
  marginBottom: "16px",
  opacity: "0.35",
});

const emptyTitleCss = css({
  fontSize: "16px",
  fontWeight: "700",
  color: colors.textMuted,
  marginBottom: "8px",
});

const emptySubCss = css({
  fontSize: "13px",
  color: colors.textDimmer,
});

export default function MagazinePage() {
  const { data: items = [], isLoading } = useMagazineList();
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

        {isLoading ? (
          <div className={listCss}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={skelRowCss}>
                <Skeleton height="220px" radius="0.75rem" />
                <div className={skelTextColCss}>
                  <Skeleton width="30%" height="11px" />
                  <Skeleton width="90%" height="22px" />
                  <Skeleton width="70%" height="22px" />
                  <Skeleton width="100%" height="14px" />
                  <Skeleton width="80%" height="14px" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className={emptyStateCss}>
            <div className={emptyIconCss}><BookOpen size={40} /></div>
            <p className={emptyTitleCss}>아직 발행된 아티클이 없습니다.</p>
            <p className={emptySubCss}>곧 새로운 이야기가 올라올 예정입니다.</p>
          </div>
        ) : (
          <div className={listCss}>
            {items.map((post, i) => (
              <MagazineCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
