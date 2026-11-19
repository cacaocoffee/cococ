import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from '@tanstack/react-router';
import { css, cx } from '@/lib/css';
import { colors, fonts } from '@/lib/tokens';
import CococLogo from '@/components/ui/CococLogo';

interface Tab {
  label: string;
  to: string;
}

const TABS: Tab[] = [
  { label: 'Home',     to: '/' },
  { label: 'Archive',  to: '/archive' },
  { label: 'Magazine', to: '/magazine' },
  { label: 'Schedule', to: '/schedule' },
  { label: 'Apply',    to: '/apply' },
];

const navCss = css({
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  zIndex: '50',
  backgroundColor: 'rgba(246,239,226,0.82)',
  backdropFilter: 'blur(14px) saturate(1.2)',
  borderBottom: `1px solid ${colors.borderSubtle}`,
  paddingInline: '24px',
  paddingBlock: '14px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  transition: 'border-color 0.25s, background-color 0.25s',
  '@md': { paddingInline: '48px', paddingBlock: '16px' },
});

const navScrolledCss = css({
  borderColor: colors.borderMedium,
  backgroundColor: 'rgba(246,239,226,0.94)',
});

const logoLinkCss = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '12px',
  color: colors.textPrimary,
  textDecoration: 'none',
});

const logoWordmarkCss = css({
  fontFamily: fonts.display,
  fontSize: '22px',
  fontWeight: '600',
  letterSpacing: '-0.01em',
  color: colors.textPrimary,
  display: 'none',
  '@sm': { display: 'inline' },
});

const desktopNavCss = css({
  display: 'none',
  gap: '32px',
  '@md': { display: 'flex' },
});

const navLinkBaseCss = css({
  fontFamily: fonts.mono,
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  transition: 'color 0.2s',
  paddingBlock: '6px',
  textDecoration: 'none',
  position: 'relative',
});

const navLinkActiveCss = css({
  color: colors.textPrimary,
  _after: {
    content: '""',
    position: 'absolute',
    left: '0',
    right: '0',
    bottom: '-2px',
    height: '1px',
    backgroundColor: colors.brand,
  },
});

const navLinkInactiveCss = css({
  color: colors.textFaint,
  _hover: { color: colors.textPrimary },
});

const rightGroupCss = css({ display: 'flex', alignItems: 'center', gap: '12px' });

const menuBtnCss = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  color: colors.textPrimary,
  background: 'none',
  border: `1px solid ${colors.borderMedium}`,
  borderRadius: '9999px',
  cursor: 'pointer',
  transition: 'background-color 0.2s, border-color 0.2s',
  _hover: { backgroundColor: colors.bgCard, borderColor: colors.borderStrong },
  '@md': { display: 'none' },
});

const joinBtnCss = css({
  display: 'none',
  backgroundColor: colors.textPrimary,
  color: colors.bgPage,
  paddingInline: '20px',
  paddingBlock: '10px',
  borderRadius: '9999px',
  fontSize: '11px',
  fontFamily: fonts.mono,
  letterSpacing: '0.18em',
  fontWeight: '700',
  textDecoration: 'none',
  textTransform: 'uppercase',
  transition: 'background-color 0.2s',
  _hover: { backgroundColor: colors.brand },
  '@md': { display: 'inline-block' },
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
  paddingBlock: '12px',
});

const mobileLinkBaseCss = css({
  paddingInline: '24px',
  paddingBlock: '14px',
  fontFamily: fonts.mono,
  fontSize: '12px',
  fontWeight: '700',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  transition: 'color 0.2s',
  textDecoration: 'none',
});

const mobileLinkActiveCss = css({ color: colors.brand });
const mobileLinkInactiveCss = css({
  color: colors.textMuted,
  _hover: { color: colors.textPrimary },
});

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (to: string): boolean =>
    to === '/' ? pathname === '/' : pathname.startsWith(to);

  return (
    <nav className={cx(navCss, scrolled && navScrolledCss)}>
      <Link to="/" className={logoLinkCss}>
        <CococLogo size={36} color={colors.textPrimary} compact />
        <span className={logoWordmarkCss}>cococ</span>
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
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <Link to="/apply" className={joinBtnCss}>Join</Link>
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
