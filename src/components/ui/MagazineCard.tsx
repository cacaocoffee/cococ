import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { css } from '@/lib/css';
import { colors, fonts } from '@/lib/tokens';
import { fetchInstagramThumbnail } from '@/lib/microlink';
import type { MagazineItem } from '@/domain/magazine/magazine-dto';

interface MagazineCardProps {
  post: MagazineItem;
  index?: number;
}

function useInstagramThumbnail(post: MagazineItem): string {
  const [thumb, setThumb] = useState(post.img || "");
  useEffect(() => {
    if (post.img) return;
    if (post.magazineType !== "cardnews") return;
    const firstUrl = post.instagramUrls?.[0];
    if (!firstUrl) return;
    const controller = new AbortController();
    void fetchInstagramThumbnail(firstUrl, { signal: controller.signal }).then((url) => {
      if (url && !controller.signal.aborted) setThumb(url);
    });
    return () => controller.abort();
  }, [post.img, post.magazineType, post.instagramUrls?.[0]]);
  return thumb;
}

const linkCss = css({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '28px',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'inherit',
  backgroundColor: colors.bgCard,
  borderRadius: '20px',
  padding: '12px 12px 24px',
  '@md': { gridTemplateColumns: '2fr 3fr', gap: '48px', padding: '16px 40px 16px 16px' },
});

const imgWrapCss = css({
  overflow: 'hidden',
  borderRadius: '14px',
  aspectRatio: '4/5',
  backgroundColor: colors.bgSection,
});

const imgCss = css({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 700ms cubic-bezier(0.25,0.1,0.25,1)',
  _groupHover: { transform: 'scale(1.04)' },
});

const metaCss = css({
  color: colors.textMuted,
  fontSize: "12px",
  fontWeight: '700',
  letterSpacing: "0",
  marginBottom: '16px',
});

const titleCss = css({
  fontFamily: fonts.display,
  fontSize: 'clamp(28px, 3vw, 38px)',
  fontWeight: "700",
  color: colors.textPrimary,
  marginBottom: '20px',
  lineHeight: '1.15',
  letterSpacing: '-0.025em',
});

const excerptCss = css({
  color: colors.textMuted,
  marginBottom: '28px',
  fontSize: '15px',
  lineHeight: '1.7',
  fontWeight: '500',
  display: '-webkit-box',
  '-webkit-line-clamp': '3',
  '-webkit-box-orient': 'vertical',
  overflow: 'hidden',
});

const readMoreCss = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  color: colors.onInk,
  backgroundColor: colors.bgInk,
  fontSize: "14px",
  fontWeight: '700',
  paddingInline: '16px',
  paddingBlock: '10px',
  borderRadius: '9999px',
  transition: 'gap 0.2s',
  _groupHover: { gap: '12px' },
});

export default function MagazineCard({ post, index = 0 }: MagazineCardProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const thumb = useInstagramThumbnail(post);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link
        to="/magazine/$id"
        params={{ id: String(post.id) }}
        className={`group ${linkCss}`}
      >
        <div className={imgWrapCss}>
          <img src={thumb} alt={post.title} className={imgCss} />
        </div>
        <div>
          <p className={metaCss}>{post.author} · {post.date}</p>
          <h4 className={titleCss}>{post.title}</h4>
          <p className={excerptCss}>{post.excerpt}</p>
          <div className={readMoreCss}>
            Read Article <ArrowRight size={14} />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
