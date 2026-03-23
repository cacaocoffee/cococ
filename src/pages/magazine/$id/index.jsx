import { useParams } from "@tanstack/react-router";
import { useMagazineList } from "@/hooks/useMagazine";
import PageWrapper from "@/components/ui/PageWrapper";
import BackButton from "@/components/ui/BackButton";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";
import ArticleHero from "./components/ArticleHero";
import ArticleHeader from "./components/ArticleHeader";
import ArticleBody from "./components/ArticleBody";
import RelatedArticles from "./components/RelatedArticles";

const notFoundCss = css({
  paddingTop: "160px",
  textAlign: "center",
  color: colors.textFaint,
});

const wrapperCss = css({ paddingTop: "96px", paddingBottom: "96px" });

const contentCss = css({
  maxWidth: "48rem",
  marginInline: "auto",
  paddingInline: "24px",
  "@md": { paddingInline: "48px" },
});

const backWrapCss = css({ marginTop: "64px" });

export default function MagazineDetailPage() {
  const { id } = useParams({ strict: false });
  const { data: all = [], isLoading } = useMagazineList();
  const item = all.find((m) => String(m.id) === id);
  const others = all.filter((m) => String(m.id) !== id).slice(0, 2);

  if (isLoading) return null;
  if (!item)
    return <div className={notFoundCss}>아티클을 찾을 수 없습니다.</div>;

  return (
    <PageWrapper>
      <div className={wrapperCss}>
        <ArticleHero item={item} />

        <div className={contentCss}>
          <ArticleHeader item={item} />
          <ArticleBody item={item} />
          <RelatedArticles others={others} />
          <div className={backWrapCss}>
            <BackButton label="전체 매거진 보기" />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
