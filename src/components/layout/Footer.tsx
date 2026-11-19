import { Instagram, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { css } from "@/lib/css";
import { colors, fonts } from "@/lib/tokens";
import CococLogo from "@/components/ui/CococLogo";

interface Tab {
  label: string;
  to: string;
}

const TABS: Tab[] = [
  { label: "Home", to: "/" },
  { label: "Archive", to: "/archive" },
  { label: "Magazine", to: "/magazine" },
  { label: "Schedule", to: "/schedule" },
  { label: "Apply", to: "/apply" },
];

const footerCss = css({
  backgroundColor: colors.bgFooter,
  borderTop: `1px solid ${colors.borderSubtle}`,
  paddingTop: "80px",
  paddingBottom: "40px",
  paddingInline: "24px",
  "@md": { paddingInline: "48px" },
});

const colophonCss = css({
  maxWidth: "80rem",
  marginInline: "auto",
  marginBottom: "56px",
  paddingBottom: "56px",
  borderBottom: `1px solid ${colors.borderMedium}`,
});

const colophonHeadlineCss = css({
  fontFamily: fonts.display,
  fontSize: "clamp(28px, 3.4vw, 44px)",
  fontWeight: "500",
  color: colors.textPrimary,
  lineHeight: "1.12",
  letterSpacing: "-0.012em",
  maxWidth: "32rem",
  marginBottom: "16px",
});

const colophonSubCss = css({
  color: colors.textMuted,
  fontSize: "14px",
  lineHeight: "1.65",
  maxWidth: "28rem",
});

const innerCss = css({
  maxWidth: "80rem",
  marginInline: "auto",
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "40px",
  marginBottom: "56px",
  "@md": { gridTemplateColumns: "2fr 1fr 1fr 1fr" },
});

const brandColCss = css({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
});

const brandRowCss = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "12px",
  color: colors.textPrimary,
  textDecoration: "none",
});

const brandWordmarkCss = css({
  fontFamily: fonts.display,
  fontSize: "24px",
  fontWeight: "600",
  color: colors.textPrimary,
});

const sectionLabelCss = css({
  fontFamily: fonts.mono,
  fontSize: "10px",
  fontWeight: "700",
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  color: colors.textFaint,
  marginBottom: "20px",
});

const descCss = css({
  color: colors.textMuted,
  fontSize: "14px",
  maxWidth: "22rem",
  lineHeight: "1.65",
});

const socialRowCss = css({ display: "flex", gap: "10px", marginTop: "4px" });

const socialBtnCss = css({
  width: "40px",
  height: "40px",
  borderRadius: "9999px",
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderMedium}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: colors.textPrimary,
  cursor: "pointer",
  transition: "background-color 0.2s, color 0.2s, border-color 0.2s",
  textDecoration: "none",
  flexShrink: "0",
  _hover: {
    backgroundColor: colors.textPrimary,
    color: colors.bgPage,
    borderColor: colors.textPrimary,
  },
});

const naverLetterCss = css({
  fontSize: "14px",
  fontWeight: "900",
  lineHeight: "1",
});

const linkListCss = css({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  listStyle: "none",
});

const footerLinkCss = css({
  color: colors.textMuted,
  fontSize: "14px",
  textDecoration: "none",
  transition: "color 0.2s",
  _hover: { color: colors.brand },
});

const partnerDescCss = css({
  color: colors.textMuted,
  fontSize: "14px",
  marginBottom: "12px",
  lineHeight: "1.65",
});

const emailLinkCss = css({
  color: colors.brand,
  fontWeight: "700",
  fontSize: "14px",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  _hover: { textDecoration: "underline" },
});

const bottomCss = css({
  maxWidth: "80rem",
  marginInline: "auto",
  paddingTop: "28px",
  borderTop: `1px solid ${colors.borderSubtle}`,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  "@md": { flexDirection: "row" },
});

const copyCss = css({
  fontFamily: fonts.mono,
  fontSize: "10px",
  color: colors.textFaint,
  fontWeight: "600",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
});

const adminLinkCss = css({
  fontFamily: fonts.mono,
  fontSize: "10px",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: colors.textDimmer,
  textDecoration: "none",
  _hover: { color: colors.brand },
});

export default function Footer() {
  return (
    <footer className={footerCss}>
      <div className={colophonCss}>
        <h2 className={colophonHeadlineCss}>
          한 잔의 술 곁에 함께 머무는 사람들이 되어보세요.
        </h2>
        <p className={colophonSubCss}>
          코콕은 2030세대의 칵테일·주류 문화를 기록하는 자발적 결사체입니다.
          가입 문의와 협업 문의를 함께 받고 있습니다.
        </p>
      </div>

      <div className={innerCss}>
        <div className={brandColCss}>
          <Link to="/" className={brandRowCss}>
            <CococLogo size={40} color={colors.textPrimary} />
            <span className={brandWordmarkCss}>cococ</span>
          </Link>
          <p className={descCss}>
            Creations Over Cocktail &amp; Offbeat Culture — 경험을 지식으로, 지식은 미식으로.
          </p>
          <div className={socialRowCss}>
            <a
              href="https://www.instagram.com/cococ_official/reels/"
              target="_blank"
              rel="noopener noreferrer"
              className={socialBtnCss}
              aria-label="Instagram"
            >
              <Instagram size={17} />
            </a>
            <a
              href="https://blog.naver.com/cococ_blog"
              target="_blank"
              rel="noopener noreferrer"
              className={socialBtnCss}
              aria-label="Naver Blog"
            >
              <span className={naverLetterCss}>N</span>
            </a>
          </div>
        </div>

        <div>
          <h4 className={sectionLabelCss}>Sitemap</h4>
          <ul className={linkListCss}>
            {TABS.map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className={footerLinkCss}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className={sectionLabelCss}>Issue</h4>
          <ul className={linkListCss}>
            <li><span className={footerLinkCss}>Vol. 01 — 2026</span></li>
            <li><span className={footerLinkCss}>Seoul edition</span></li>
            <li><span className={footerLinkCss}>Quarterly</span></li>
          </ul>
        </div>

        <div>
          <h4 className={sectionLabelCss}>Partnership</h4>
          <p className={partnerDescCss}>
            협업 및 제휴 문의는 아래 메일로.
          </p>
          <a href="mailto:contact@cococ.kr" className={emailLinkCss}>
            contact@cococ.kr <ExternalLink size={13} />
          </a>
        </div>
      </div>

      <div className={bottomCss}>
        <p className={copyCss}>© 2026 cococ — All rights reserved.</p>
        <Link to="/admin" className={adminLinkCss}>Admin</Link>
      </div>
    </footer>
  );
}
