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
  backgroundColor: 'rgba(242,243,245,0.88)',
  backdropFilter: 'blur(14px)',
  borderBottom: '1px solid transparent',
  paddingInline: '16px',
  paddingBlock: '12px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  transition: 'border-color 0.25s, background-color 0.25s',
  '@md': { paddingInline: '32px', paddingBlock: '14px' },
});

// 스크롤하면 아래쪽에만 가는 선을 보인다
const navScrolledCss = css({
  borderColor: colors.borderSubtle,
  backgroundColor: 'rgba(242,243,245,0.96)',
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
  fontWeight: "700",
  letterSpacing: '-0.03em',
  color: colors.textPrimary,
  display: 'none',
  '@sm': { display: 'inline' },
});

// 넓은 화면의 메뉴: 흰 알약 안에 글자 버튼, 지금 페이지는 잉크로 채운다
const desktopNavCss = css({
  display: 'none',
  gap: '2px',
  padding: '4px',
  backgroundColor: colors.bgCard,
  borderRadius: '9999px',
  '@md': { display: 'flex' },
});

const navLinkBaseCss = css({
  fontSize: "14px",
  fontWeight: '700',
  transition: 'color 0.2s, background-color 0.2s',
  paddingInline: '16px',
  paddingBlock: '8px',
  borderRadius: '9999px',
  textDecoration: 'none',
});

const navLinkActiveCss = css({
  color: colors.onInk,
  backgroundColor: colors.bgInk,
});

const navLinkInactiveCss = css({
  color: colors.textMuted,
  _hover: { color: colors.textPrimary, backgroundColor: colors.bgSection },
});

const rightGroupCss = css({ display: 'flex', alignItems: 'center', gap: '12px' });

const menuBtnCss = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  color: colors.textPrimary,
  backgroundColor: colors.bgCard,
  border: 'none',
  borderRadius: '9999px',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  _hover: { backgroundColor: colors.bgPressed },
  '@md': { display: 'none' },
});

const joinBtnCss = css({
  display: 'none',
  backgroundColor: colors.lime,
  color: colors.textPrimary,
  paddingInline: '20px',
  paddingBlock: '10px',
  borderRadius: '9999px',
  fontSize: "14px",
  fontWeight: '700',
  textDecoration: 'none',
  transition: 'background-color 0.2s',
  _hover: { backgroundColor: colors.limeHover },
  '@md': { display: 'inline-block' },
});

const mobileMenuCss = css({
  position: 'absolute',
  top: 'calc(100% + 4px)',
  left: '12px',
  right: '12px',
  backgroundColor: colors.bgCard,
  borderRadius: '20px',
  display: 'flex',
  flexDirection: 'column',
  padding: '8px',
});

const mobileLinkBaseCss = css({
  paddingInline: '16px',
  paddingBlock: '14px',
  borderRadius: '14px',
  fontSize: '16px',
  fontWeight: '700',
  transition: 'color 0.2s',
  textDecoration: 'none',
});

const mobileLinkActiveCss = css({ color: colors.onInk, backgroundColor: colors.bgInk });
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
