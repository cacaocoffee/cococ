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
  paddingBottom: '64px',
  borderBottom: `1px solid ${colors.borderMedium}`,
  '@md': { gridTemplateColumns: '2fr 3fr', gap: '48px' },
});

const imgWrapCss = css({
  overflow: 'hidden',
  borderRadius: '4px',
  aspectRatio: '4/5',
  border: `1px solid ${colors.borderSubtle}`,
});

const imgCss = css({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 700ms cubic-bezier(0.25,0.1,0.25,1)',
  _groupHover: { transform: 'scale(1.04)' },
});

const metaCss = css({
  fontFamily: fonts.mono,
  color: colors.brand,
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  marginBottom: '16px',
});

const titleCss = css({
  fontFamily: fonts.display,
  fontSize: 'clamp(28px, 3vw, 38px)',
  fontWeight: '500',
  color: colors.textPrimary,
  marginBottom: '20px',
  lineHeight: '1.12',
  letterSpacing: '-0.014em',
  transition: 'color 0.2s',
  _groupHover: { color: colors.brand },
});

const excerptCss = css({
  color: colors.textMuted,
  marginBottom: '28px',
  fontSize: '15px',
  lineHeight: '1.7',
  fontWeight: '400',
  display: '-webkit-box',
  '-webkit-line-clamp': '3',
  '-webkit-box-orient': 'vertical',
  overflow: 'hidden',
});

const readMoreCss = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  color: colors.textPrimary,
  fontFamily: fonts.mono,
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  paddingBlock: '4px',
  borderBottom: `1px solid ${colors.textPrimary}`,
  transition: 'gap 0.2s, color 0.2s, border-color 0.2s',
  _groupHover: { color: colors.brand, gap: '14px', borderColor: colors.brand },
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
