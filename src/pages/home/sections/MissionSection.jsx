import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { css } from "@/lib/css";
import { colors } from "@/lib/tokens";

function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

const VALUES = [
  {
    keyword: "미식",
    title: "취향을 아는 것",
    desc: "코콕은 2030세대가 본인의 취향을 알고 주류를 선택하는 것을 지향합니다. 이것이 미식의 정착점이라 믿습니다.",
  },
  {
    keyword: "콕나투스",
    title: "즐거움에 가까워지려고 한다",
    desc: "스피노자의 코나투스에서 따온 코콕의 철학. 지식도, 경험도, 사람도 — 모든 것은 결국 즐거움이 바탕이 되어야 합니다.",
  },
  {
    keyword: "성장",
    title: "경험이 역량이 된다",
    desc: "COCOC에서의 체험은 자연스럽게 지식이 되고, 지식은 내면화되어 미식을 추구하게 합니다. 아는 만큼 맛있으니까요.",
  },
  {
    keyword: "소속감",
    title: "좋은 사람, 좋은 술",
    desc: "COCOC은 특정 목적을 가진 자발적 결사체입니다. 하나의 팀으로서 느끼는 유대감 — 즐겁지 않을 이유가 없습니다.",
  },
];

const missionSectionCss = css({
  paddingBlock: "112px",
  paddingInline: "24px",
  maxWidth: "80rem",
  marginInline: "auto",
  "@md": { paddingInline: "48px" },
});

const mvGridCss = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "24px",
  marginBottom: "24px",
  "@md": { gridTemplateColumns: "repeat(2,1fr)" },
});

const missionCardCss = css({
  backgroundColor: colors.bgSection,
  border: `1px solid ${colors.borderSubtle}`,
  borderRadius: "1.5rem",
  padding: "40px",
  height: "100%",
});

const visionCardCss = css({
  backgroundColor: colors.brand,
  borderRadius: "1.5rem",
  padding: "40px",
  height: "100%",
});

const cardEyebrowCss = css({
  fontSize: "10px",
  fontWeight: "900",
  letterSpacing: "4px",
  textTransform: "uppercase",
  marginBottom: "16px",
  display: "block",
});

const missionEyebrowCss = css({ color: colors.brand });
const visionEyebrowCss = css({ color: "rgba(0,0,0,0.5)" });

const cardTitleCss = css({
  fontSize: "30px",
  fontWeight: "900",
  lineHeight: "1.375",
  marginBottom: "24px",
});

const missionTitleCss = css({ color: colors.textPrimary });
const visionTitleCss = css({ color: colors.bgPage });

const missionDescCss = css({
  color: colors.textMuted,
  fontSize: "14px",
  lineHeight: "1.9",
});
const visionDescCss = css({
  color: "rgba(0,0,0,0.7)",
  fontSize: "14px",
  lineHeight: "1.9",
});

const valuesGridCss = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "16px",
  "@sm": { gridTemplateColumns: "repeat(2,1fr)" },
  "@lg": { gridTemplateColumns: "repeat(4,1fr)" },
});

const valueCardCss = css({
  backgroundColor: colors.bgSection,
  border: `1px solid ${colors.borderSubtle}`,
  borderRadius: "1rem",
  padding: "28px",
  height: "100%",
  transition: "border-color 0.2s",
  _hover: { borderColor: "rgba(245,158,11,0.2)" },
});

const valueKeywordCss = css({
  color: colors.brand,
  fontSize: "10px",
  fontWeight: "900",
  letterSpacing: "3px",
  textTransform: "uppercase",
  marginBottom: "12px",
  display: "block",
});

const valueTitleCss = css({
  color: colors.textPrimary,
  fontWeight: "900",
  fontSize: "16px",
  marginBottom: "12px",
  lineHeight: "1.375",
});
const valueDescCss = css({
  color: colors.textFaint,
  fontSize: "12px",
  lineHeight: "1.625",
});

export default function MissionSection() {
  return (
    <section className={missionSectionCss}>
      <div className={mvGridCss}>
        <FadeUp>
          <div className={missionCardCss}>
            <span className={`${cardEyebrowCss} ${missionEyebrowCss}`}>
              Our Mission
            </span>
            <h3 className={`${cardTitleCss} ${missionTitleCss}`}>
              취향을 알고,
              <br />
              주류를 선택한다.
            </h3>
            <p className={missionDescCss}>
              코콕은 2030세대가 <b>본인의 취향을 알고 주류를 선택하는 것</b>을
              지향합니다. 이를 미식의 정착점이라 믿으며,{" "}
              <b>모두가 미식에 가까워질수 있는 활동</b>을 실천하고 있습니다.
            </p>
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className={visionCardCss}>
            <span className={`${cardEyebrowCss} ${visionEyebrowCss}`}>
              Our Vision
            </span>
            <h3 className={`${cardTitleCss} ${visionTitleCss}`}>
              경험을 지식을,
              <br />
              지식은 미식을.
            </h3>
            <p className={visionDescCss}>
              COCOC에서의 체험을 통해 자연스럽게 지식을 쌓고, 이를 내면화하여
              미식을 추구할 수 있습니다. 아는 만큼 맛있으니까요.
            </p>
          </div>
        </FadeUp>
      </div>

      <div className={valuesGridCss}>
        {VALUES.map((v, i) => (
          <FadeUp key={v.keyword} delay={i * 0.08}>
            <div className={valueCardCss}>
              <span className={valueKeywordCss}>{v.keyword}</span>
              <h4 className={valueTitleCss}>{v.title}</h4>
              <p className={valueDescCss}>{v.desc}</p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
