import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from '@tanstack/react-router';
import { css, cx } from '../../lib/css';
import { colors } from '../../lib/tokens';
import CococLogo from '../ui/CococLogo';

const TABS = [
  { label: 'Home',     to: '/' },
  { label: 'Archive',  to: '/archive' },
  { label: 'Magazine', to: '/magazine' },
  { label: 'Apply',    to: '/apply' },
];

const navCss = css({
  position: 'fixed',
  top: '0',
  width: '100%',
  zIndex: '50',
  backgroundColor: 'rgba(10,10,10,0.85)',
  backdropFilter: 'blur(12px)',
  borderBottom: `1px solid ${colors.borderMedium}`,
  paddingInline: '24px',
  paddingBlock: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  '@md': { paddingInline: '48px' },
});


const desktopNavCss = css({
  display: 'none',
  gap: '40px',
  '@md': { display: 'flex' },
});

const navLinkBaseCss = css({
  fontSize: '12px',
  fontWeight: '700',
  letterSpacing: '3px',
  textTransform: 'uppercase',
  transition: 'all 0.2s',
  paddingBottom: '4px',
  borderBottom: '2px solid transparent',
  textDecoration: 'none',
});

const navLinkActiveCss = css({ color: colors.brand, borderColor: colors.brand });
const navLinkInactiveCss = css({
  color: colors.textFaint,
  borderColor: 'transparent',
  _hover: { color: colors.textPrimary },
});

const rightGroupCss = css({ display: 'flex', alignItems: 'center', gap: '16px' });

const menuBtnCss = css({
  display: 'block',
  color: colors.textMuted,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  transition: 'color 0.2s',
  _hover: { color: colors.textPrimary },
  '@md': { display: 'none' },
});

const joinBtnCss = css({
  display: 'none',
  backgroundColor: colors.brand,
  color: colors.bgPage,
  paddingInline: '20px',
  paddingBlock: '8px',
  borderRadius: '9999px',
  fontSize: '12px',
  fontWeight: '900',
  textDecoration: 'none',
  transition: 'background-color 0.2s',
  _hover: { backgroundColor: colors.brandHover },
  '@md': { display: 'block' },
});

const mobileMenuCss = css({
  position: 'absolute',
  top: '100%',
  left: '0',
  width: '100%',
  backgroundColor: colors.bgPage,
  borderBottom: `1px solid ${colors.borderMedium}`,
  display: 'flex',
  flexDirection: 'column',
  paddingBlock: '16px',
});

const mobileLinkBaseCss = css({
  paddingInline: '24px',
  paddingBlock: '16px',
  fontSize: '14px',
  fontWeight: '700',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  transition: 'color 0.2s',
  textDecoration: 'none',
});

const mobileLinkActiveCss = css({ color: colors.brand });
const mobileLinkInactiveCss = css({ color: colors.textMuted, _hover: { color: colors.textPrimary } });

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (to) => to === '/' ? pathname === '/' : pathname.startsWith(to);

  return (
    <nav className={navCss}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', color: colors.brand }}>
        <CococLogo size={36} color={colors.brand} />
      </Link>

      <div className={desktopNavCss}>
        {TABS.map(({ label, to }) => (
          <Link key={to} to={to}
            className={cx(navLinkBaseCss, isActive(to) ? navLinkActiveCss : navLinkInactiveCss)}>
            {label}
          </Link>
        ))}
      </div>

      <div className={rightGroupCss}>
        <button
          className={menuBtnCss}
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <Link to="/apply" className={joinBtnCss}>JOIN US</Link>
      </div>

      {mobileOpen && (
        <div className={mobileMenuCss}>
          {TABS.map(({ label, to }) => (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)}
              className={cx(mobileLinkBaseCss, isActive(to) ? mobileLinkActiveCss : mobileLinkInactiveCss)}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
