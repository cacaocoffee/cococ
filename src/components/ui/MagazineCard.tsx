import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { css } from '@/lib/css';
import { colors } from '@/lib/tokens';
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
    fetch(`https://api.microlink.io/?url=${encodeURIComponent(firstUrl)}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.status === "success" && json.data?.image?.url) {
          setThumb(json.data.image.url);
        }
      })
      .catch(() => {});
  }, [post.img, post.magazineType, post.instagramUrls?.[0]]);
  return thumb;
}

const linkCss = css({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '32px',
  alignItems: 'center',
  textDecoration: 'none',
  '@md': { gridTemplateColumns: '2fr 3fr' },
});

const imgWrapCss = css({
  overflow: 'hidden',
  borderRadius: '1rem',
  aspectRatio: '4/3',
});

const imgCss = css({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const metaCss = css({
  color: colors.brand,
  fontSize: '12px',
  fontWeight: '700',
  marginBottom: '12px',
});

const titleCss = css({
  fontSize: '30px',
  fontWeight: '900',
  color: colors.textPrimary,
  marginBottom: '16px',
  lineHeight: '1.25',
  transition: 'color 0.2s',
  _groupHover: { color: colors.brand },
});

const excerptCss = css({
  color: colors.textMuted,
  marginBottom: '24px',
  fontSize: '14px',
  lineHeight: '1.625',
  fontWeight: '300',
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
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  transition: 'all 0.2s',
  _groupHover: { color: colors.brand, gap: '16px' },
});

export default function MagazineCard({ post, index = 0 }: MagazineCardProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const thumb = useInstagramThumbnail(post);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link
        to="/magazine/$id"
        params={{ id: String(post.id) }}
        className={`group ${linkCss}`}
      >
        <div className={imgWrapCss}>
          <motion.img
            src={thumb}
            alt={post.title}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
            className={imgCss}
          />
        </div>
        <div>
          <p className={metaCss}>{post.author} · {post.date}</p>
          <h4 className={titleCss}>{post.title}</h4>
          <p className={excerptCss}>{post.excerpt}</p>
          <div className={readMoreCss}>
            Read Article <ArrowRight size={15} />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
