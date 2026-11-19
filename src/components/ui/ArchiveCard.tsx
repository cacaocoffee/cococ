import { motion } from 'framer-motion';
import { Calendar, GlassWater } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { css } from '@/lib/css';
import { colors, fonts } from '@/lib/tokens';
import type { ArchiveItem } from '@/domain/archive/archive-dto';

interface ArchiveCardProps {
  item: ArchiveItem;
}

const linkCss = css({
  display: 'block',
  backgroundColor: 'transparent',
  textDecoration: 'none',
  color: 'inherit',
});

const imgWrapCss = css({
  position: 'relative',
  overflow: 'hidden',
  aspectRatio: '4/5',
  borderRadius: '4px',
  border: `1px solid ${colors.borderSubtle}`,
  marginBottom: '16px',
  backgroundColor: colors.bgCard,
});

const imgCss = css({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 700ms cubic-bezier(0.25,0.1,0.25,1)',
  _groupHover: { transform: 'scale(1.04)' },
});

const overlayCss = css({
  position: 'absolute',
  inset: '0',
  background: 'linear-gradient(to top, rgba(33,27,18,0.42), rgba(33,27,18,0) 50%)',
  pointerEvents: 'none',
});

const categoryBadgeCss = css({
  position: 'absolute',
  top: '14px',
  left: '14px',
  backgroundColor: colors.bgPage,
  color: colors.textPrimary,
  fontFamily: fonts.mono,
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  paddingInline: '10px',
  paddingBlock: '4px',
  borderRadius: '9999px',
  border: `1px solid ${colors.borderMedium}`,
});

const metaCss = css({
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  marginBottom: '10px',
});

const metaItemCss = css({
  fontFamily: fonts.mono,
  fontSize: '10px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: colors.textFaint,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
});

const titleCss = css({
  fontFamily: fonts.display,
  fontSize: '20px',
  fontWeight: '500',
  color: colors.textPrimary,
  lineHeight: '1.2',
  letterSpacing: '-0.008em',
  transition: 'color 0.2s',
  _groupHover: { color: colors.brand },
});

export default function ArchiveCard({ item }: ArchiveCardProps) {
  return (
    <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }}>
      <Link
        to="/archive/$id"
        params={{ id: String(item.id) }}
        className={`group ${linkCss}`}
      >
        <div className={imgWrapCss}>
          <img src={item.img} alt={item.title} className={imgCss} />
          <div className={overlayCss} />
          <span className={categoryBadgeCss}>{item.category}</span>
        </div>
        <div className={metaCss}>
          <span className={metaItemCss}><Calendar size={11} />{item.date}</span>
          <span style={{ color: colors.textDimmer }}>·</span>
          <span className={metaItemCss}><GlassWater size={11} />{item.base}</span>
        </div>
        <h4 className={titleCss}>{item.title}</h4>
      </Link>
    </motion.div>
  );
}
