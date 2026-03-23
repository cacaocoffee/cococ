import { motion } from "framer-motion";
import { useParams } from "@tanstack/react-router";
import { useArchiveList } from "@/hooks/useArchive";
import PageWrapper from "@/components/ui/PageWrapper";
import BackButton from "@/components/ui/BackButton";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";
import HeroSection from "./components/HeroSection";
import MetaRow from "./components/MetaRow";
import Gallery from "./components/Gallery";
import RecipeList from "./components/RecipeList";

const notFoundCss = css({
  paddingTop: "160px",
  textAlign: "center",
  color: colors.textFaint,
});

const notFoundTitleCss = css({
  fontSize: "18px",
  fontWeight: "700",
  marginBottom: "16px",
});

const wrapperCss = css({ paddingTop: "96px", paddingBottom: "96px" });

const contentCss = css({
  maxWidth: "56rem",
  marginInline: "auto",
  paddingInline: "24px",
  marginTop: "48px",
  "@md": { paddingInline: "48px" },
});

const descCss = css({
  color: colors.textSecondary,
  fontSize: "18px",
  lineHeight: "1.9",
  marginBottom: "64px",
});

export default function ArchiveDetailPage() {
  const { id } = useParams({ strict: false });
  const { data: all = [], isLoading } = useArchiveList();
  const item = all.find((d) => String(d.id) === id);

  if (isLoading) return null;
  if (!item)
    return (
      <div className={notFoundCss}>
        <p className={notFoundTitleCss}>항목을 찾을 수 없습니다.</p>
        <BackButton label="아카이브로 돌아가기" />
      </div>
    );

  return (
    <PageWrapper>
      <div className={wrapperCss}>
        <HeroSection item={item} />

        <div className={contentCss}>
          <MetaRow item={item} />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={descCss}
          >
            {item.description}
          </motion.p>

          <Gallery gallery={item.gallery} />
          <RecipeList recipes={item.recipes} />

          <BackButton label="전체 아카이브 보기" />
        </div>
      </div>
    </PageWrapper>
  );
}
