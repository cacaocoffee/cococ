import { Instagram, ExternalLink } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { css } from '@/lib/css';
import { colors } from '@/lib/tokens';
import CococLogo from '@/components/ui/CococLogo';

const TABS = [
  { label: 'Home',     to: '/' },
  { label: 'Archive',  to: '/archive' },
  { label: 'Magazine', to: '/magazine' },
  { label: 'Apply',    to: '/apply' },
];

const footerCss = css({
  backgroundColor: colors.bgFooter,
  borderTop: `1px solid ${colors.borderFaint}`,
  paddingBlock: '64px',
  paddingInline: '24px',
  '@md': { paddingInline: '48px' },
});

const innerCss = css({
  maxWidth: '80rem',
  marginInline: 'auto',
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '48px',
  marginBottom: '64px',
  '@md': { gridTemplateColumns: 'repeat(4,1fr)' },
});

const brandColCss = css({ '@md': { gridColumn: 'span 2 / span 2' } });


const descCss = css({
  color: colors.textFaint,
  fontSize: '14px',
  maxWidth: '20rem',
  marginBottom: '8px',
  lineHeight: '1.625',
});

const subDescCss = css({
  color: colors.textDimmer,
  fontSize: '12px',
  maxWidth: '20rem',
  marginBottom: '24px',
  lineHeight: '1.625',
});

const socialRowCss = css({ display: 'flex', gap: '12px' });

const socialBtnCss = css({
  width: '40px',
  height: '40px',
  borderRadius: '9999px',
  backgroundColor: 'rgba(255,255,255,0.05)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.textFaint,
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s',
  textDecoration: 'none',
  flexShrink: '0',
  _hover: { backgroundColor: colors.brand, color: colors.bgPage },
});

const naverLetterCss = css({
  fontSize: '15px',
  fontWeight: '900',
  lineHeight: '1',
});

const colTitleCss = css({
  color: colors.textPrimary,
  fontWeight: '700',
  fontSize: '14px',
  marginBottom: '20px',
});

const linkListCss = css({ display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none' });

const footerLinkCss = css({
  color: colors.textFaint,
  fontSize: '14px',
  textDecoration: 'none',
  transition: 'color 0.2s',
  _hover: { color: colors.brand },
});

const partnerDescCss = css({
  color: colors.textFaint,
  fontSize: '14px',
  marginBottom: '16px',
  lineHeight: '1.625',
});

const emailLinkCss = css({
  color: colors.brand,
  fontWeight: '700',
  fontSize: '14px',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  _hover: { textDecoration: 'underline' },
});

const bottomCss = css({
  maxWidth: '80rem',
  marginInline: 'auto',
  paddingTop: '32px',
  borderTop: `1px solid ${colors.borderFaint}`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '12px',
  '@md': { flexDirection: 'row' },
});

const copyCss = css({
  fontSize: '10px',
  color: colors.textDimmest,
  fontWeight: '700',
  letterSpacing: '2px',
  textTransform: 'uppercase',
});

const mottosCss = css({ fontSize: '10px', color: colors.textDimmest, fontStyle: 'italic' });

export default function Footer() {
  return (
    <footer className={footerCss}>
      <div className={innerCss}>
        <div className={brandColCss}>
          <Link to="/" style={{ display: 'inline-block', color: colors.brand }}>
            <CococLogo size={80} color={colors.brand} />
          </Link>
          <p className={descCss}>Creations Over Cocktail &amp; Offbeat Culture.</p>
          <p className={subDescCss}>
            경험을 지식을, 지식은 미식을.<br />
            2030세대의 취향 있는 주류 생활을 함께 만들어갑니다.
          </p>
          <div className={socialRowCss}>
            <a
              href="https://www.instagram.com/cococ_official/reels/"
              target="_blank"
              rel="noopener noreferrer"
              className={socialBtnCss}
            >
              <Instagram size={17} />
            </a>
            <a
              href="https://blog.naver.com/cococ_blog"
              target="_blank"
              rel="noopener noreferrer"
              className={socialBtnCss}
            >
              <span className={naverLetterCss}>N</span>
            </a>
          </div>
        </div>

        <div>
          <h4 className={colTitleCss}>Quick Links</h4>
          <ul className={linkListCss}>
            {TABS.map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className={footerLinkCss}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className={colTitleCss}>Partnership</h4>
          <p className={partnerDescCss}>협업 및 제휴 문의는<br />아래 메일로 부탁드립니다.</p>
          <a href="mailto:contact@cococ.kr" className={emailLinkCss}>
            contact@cococ.kr <ExternalLink size={13} />
          </a>
        </div>
      </div>

      <div className={bottomCss}>
        <p className={copyCss}>© 2024 COCOC. All Rights Reserved.</p>
        <p className={mottosCss}>콕나투스 — COCOC은 궁극적으로 즐거움을 추구함으로써 존재한다.</p>
      </div>
    </footer>
  );
}
