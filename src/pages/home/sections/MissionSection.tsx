import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { css } from "@/lib/css";
import { colors, fonts } from "@/lib/tokens";

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

function FadeUp({ children, delay = 0, className = "" }: FadeUpProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

const VALUES = [
  {
    no: "I.",
    keyword: "소속감",
    title: "좋은 사람, 좋은 술",
    desc: "코콕은 특정 목적을 가진 자발적 결사체입니다. 좋은 사람과 좋은 술이 함께라면, 즐겁지 않을 이유가 없습니다.",
  },
  {
    no: "II.",
    keyword: "콕나투스",
    title: "즐거움에 가까워지려고 한다",
    desc: "스피노자의 코나투스에서 따온 코콕의 철학. 지식도, 경험도, 사람도 — 모든 것은 결국 즐거움이 바탕이 되어야 합니다.",
  },
  {
    no: "III.",
    keyword: "성장",
    title: "경험이 역량이 된다",
    desc: "코콕에서의 활동은 자연스럽게 개인의 역량이 됩니다. 한 잔의 술을 둘러싼 시간이 곧 한 사람의 깊이가 됩니다.",
  },
];

const missionSectionCss = css({
  paddingBlock: "112px",
  paddingInline: "24px",
  backgroundColor: colors.bgPage,
  borderTop: `1px solid ${colors.borderFaint}`,
  "@md": { paddingInline: "48px" },
});

const sectionInnerCss = css({
  maxWidth: "80rem",
  marginInline: "auto",
});

const sectionHeaderCss = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "16px",
  marginBottom: "64px",
  "@md": { gridTemplateColumns: "200px 1fr", gap: "64px" },
});

const sectionKickerCss = css({
  fontFamily: fonts.mono,
  fontSize: "11px",
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  color: colors.brand,
  paddingTop: "10px",
});

const sectionLeadCss = css({
  fontFamily: fonts.display,
  fontSize: "clamp(28px, 3.6vw, 44px)",
  fontWeight: "500",
  lineHeight: "1.18",
  letterSpacing: "-0.012em",
  color: colors.textPrimary,
  maxWidth: "48rem",
  textWrap: "balance",
} as Parameters<typeof css>[0]);

const mvGridCss = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "20px",
  marginBottom: "80px",
  "@md": { gridTemplateColumns: "repeat(2,1fr)" },
});

const missionCardCss = css({
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderSubtle}`,
  borderRadius: "20px",
  padding: "44px",
  height: "100%",
});

const visionCardCss = css({
  backgroundColor: colors.textPrimary,
  borderRadius: "20px",
  padding: "44px",
  height: "100%",
});

const cardEyebrowCss = css({
  fontFamily: fonts.mono,
  fontSize: "10px",
  fontWeight: "700",
  letterSpacing: "0.28em",
  textTransform: "uppercase",
  marginBottom: "24px",
  display: "block",
});

const missionEyebrowCss = css({ color: colors.brand });
const visionEyebrowCss = css({ color: "rgba(251,246,236,0.55)" });

const cardTitleCss = css({
  fontFamily: fonts.display,
  fontSize: "32px",
  fontWeight: "500",
  lineHeight: "1.12",
  letterSpacing: "-0.012em",
  marginBottom: "20px",
});

const missionTitleCss = css({ color: colors.textPrimary });
const visionTitleCss = css({ color: colors.bgPage });

const missionDescCss = css({
  color: colors.textMuted,
  fontSize: "15px",
  lineHeight: "1.7",
});
const visionDescCss = css({
  color: "rgba(251,246,236,0.78)",
  fontSize: "15px",
  lineHeight: "1.7",
});

const valuesGridCss = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "0",
  borderTop: `1px solid ${colors.borderMedium}`,
  "@md": { gridTemplateColumns: "repeat(3,1fr)" },
});

const valueCardCss = css({
  paddingTop: "40px",
  paddingBottom: "40px",
  paddingInline: "0",
  borderBottom: `1px solid ${colors.borderMedium}`,
  "@md": {
    paddingInline: "32px",
    borderBottom: "none",
    borderRight: `1px solid ${colors.borderMedium}`,
  },
});

const valueCardLastCss = css({
  "@md": { borderRight: "none" },
});

const valueNoCss = css({
  fontFamily: fonts.display,
  fontStyle: "italic",
  fontSize: "32px",
  color: colors.brand,
  marginBottom: "16px",
  fontWeight: "500",
});

const valueKeywordCss = css({
  color: colors.textFaint,
  fontFamily: fonts.mono,
  fontSize: "10px",
  fontWeight: "700",
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  marginBottom: "10px",
  display: "block",
});

const valueTitleCss = css({
  color: colors.textPrimary,
  fontFamily: fonts.display,
  fontWeight: "500",
  fontSize: "22px",
  marginBottom: "14px",
  lineHeight: "1.22",
  letterSpacing: "-0.008em",
});
const valueDescCss = css({
  color: colors.textMuted,
  fontSize: "14px",
  lineHeight: "1.72",
});

export default function MissionSection() {
  return (
    <section className={missionSectionCss}>
      <div className={sectionInnerCss}>
        <FadeUp>
          <div className={sectionHeaderCss}>
            <span className={sectionKickerCss}>§ Mission &amp; Values</span>
            <h2 className={sectionLeadCss}>
              우리는 한 잔의 술 곁에 머무는 시간을 기록합니다.
            </h2>
          </div>
        </FadeUp>

        <div className={mvGridCss}>
          <FadeUp>
            <div className={missionCardCss}>
              <span className={`${cardEyebrowCss} ${missionEyebrowCss}`}>Our Mission</span>
              <h3 className={`${cardTitleCss} ${missionTitleCss}`}>
                취향을 알고,<br />주류를 선택한다.
              </h3>
              <p className={missionDescCss}>
                코콕은 2030세대가 본인의 취향을 알고 주류를 선택하는 것을 지향합니다.
                이를 미식의 정착점이라 믿으며, 모두가 미식에 가까워질 수 있는 활동을 실천하고 있습니다.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className={visionCardCss}>
              <span className={`${cardEyebrowCss} ${visionEyebrowCss}`}>Our Vision</span>
              <h3 className={`${cardTitleCss} ${visionTitleCss}`}>
                경험은 지식을,<br />지식은 미식을.
              </h3>
              <p className={visionDescCss}>
                코콕에서의 체험을 통해 자연스럽게 지식을 쌓고, 이를 내면화하여 미식을 추구할 수 있습니다.
                아는 만큼 맛있으니까요.
              </p>
            </div>
          </FadeUp>
        </div>

        <div className={valuesGridCss}>
          {VALUES.map((v, i) => (
            <FadeUp key={v.keyword} delay={i * 0.08}>
              <div className={`${valueCardCss} ${i === VALUES.length - 1 ? valueCardLastCss : ""}`}>
                <div className={valueNoCss}>{v.no}</div>
                <span className={valueKeywordCss}>{v.keyword}</span>
                <h4 className={valueTitleCss}>{v.title}</h4>
                <p className={valueDescCss}>{v.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
