import { motion } from 'framer-motion';
import { Calendar, GlassWater } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { css } from '@/lib/css';
import { colors } from '@/lib/tokens';

const linkCss = css({
  display: 'block',
  backgroundColor: colors.bgCard,
  borderRadius: '1rem',
  overflow: 'hidden',
  border: `1px solid ${colors.borderSubtle}`,
  textDecoration: 'none',
});

const imgWrapCss = css({
  position: 'relative',
  overflow: 'hidden',
  height: '208px',
});

const imgCss = css({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 500ms',
  _groupHover: { transform: 'scale(1.1)' },
});

const overlayCss = css({
  position: 'absolute',
  inset: '0',
  backgroundColor: 'rgba(0,0,0,0.2)',
  transition: 'background-color 0.2s',
  _groupHover: { backgroundColor: 'rgba(0,0,0,0.3)' },
});

const categoryBadgeCss = css({
  position: 'absolute',
  top: '16px',
  left: '16px',
  backgroundColor: colors.brand,
  color: colors.bgPage,
  fontSize: '10px',
  fontWeight: '900',
  paddingInline: '12px',
  paddingBlock: '4px',
  borderRadius: '9999px',
  textTransform: 'uppercase',
});

const bodyCss = css({ padding: '20px' });

const metaCss = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
});

const metaItemCss = css({
  fontSize: '10px',
  color: colors.textFaint,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
});

const titleCss = css({
  fontSize: '18px',
  fontWeight: '700',
  color: colors.textPrimary,
  lineHeight: '1.375',
  transition: 'color 0.2s',
  _groupHover: { color: colors.brand },
});

export default function ArchiveCard({ item, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -10, transition: { duration: 0.25 } }}
    >
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
        <div className={bodyCss}>
          <div className={metaCss}>
            <span className={metaItemCss}><Calendar size={11} />{item.date}</span>
            <span className={metaItemCss}><GlassWater size={11} />{item.base}</span>
          </div>
          <h4 className={titleCss}>{item.title}</h4>
        </div>
      </Link>
    </motion.div>
  );
}
