import { motion } from 'framer-motion';
import { Calendar, GlassWater } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { css } from '@/lib/css';
import { colors, fonts } from '@/lib/tokens';
import type { ArchiveItem } from '@/domain/archive/archive-dto';

interface ArchiveCardProps {
  item: ArchiveItem;
}

// 흰 카드 안에 사진과 글. 테두리와 그림자는 없다
const linkCss = css({
  display: 'block',
  backgroundColor: colors.bgCard,
  borderRadius: '20px',
  padding: '10px 10px 18px',
  textDecoration: 'none',
  color: 'inherit',
});

const imgWrapCss = css({
  position: 'relative',
  overflow: 'hidden',
  aspectRatio: '4/5',
  borderRadius: '14px',
  marginBottom: '16px',
  backgroundColor: colors.bgSection,
});

const imgCss = css({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 700ms cubic-bezier(0.25,0.1,0.25,1)',
  _groupHover: { transform: 'scale(1.04)' },
});


const categoryBadgeCss = css({
  position: 'absolute',
  top: '14px',
  left: '14px',
  backgroundColor: colors.bgCard,
  color: colors.textPrimary,
  fontSize: "12px",
  fontWeight: '700',
  paddingInline: '10px',
  paddingBlock: '4px',
  borderRadius: '9999px',
});

const metaCss = css({
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  marginBottom: '8px',
  paddingInline: '8px',
});

const metaItemCss = css({
  fontSize: "12px",
  letterSpacing: "0",
  color: colors.textFaint,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
});

const titleCss = css({
  fontFamily: fonts.display,
  fontSize: '20px',
  fontWeight: "700",
  color: colors.textPrimary,
  lineHeight: '1.25',
  letterSpacing: '-0.02em',
  paddingInline: '8px',
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
          <span className={categoryBadgeCss}>{item.category}</span>
        </div>
        <div className={metaCss}>
          <span className={metaItemCss}><Calendar size={11} />{item.date}</span>
          <span style={{ color: colors.textDimmest }}>·</span>
          <span className={metaItemCss}><GlassWater size={11} />{item.base}</span>
        </div>
        <h4 className={titleCss}>{item.title}</h4>
      </Link>
    </motion.div>
  );
}
