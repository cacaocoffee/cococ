import { css } from "../../lib/css";
import PageWrapper from "../../components/ui/PageWrapper";
import HeroSection from "./sections/HeroSection";
import PartnerBand from "./sections/PartnerBand";
import MissionSection from "./sections/MissionSection";
import CocknatusSection from "./sections/CocknatusSection";
import RecentArchiveSection from "./sections/RecentArchiveSection";
import InsightSection from "./sections/InsightSection";

const ptWrapCss = css({ paddingTop: "80px" });

export default function HomePage() {
  return (
    <PageWrapper>
      <div className={ptWrapCss}>
        <HeroSection />
        <PartnerBand />
        <MissionSection />
        <CocknatusSection />
        <RecentArchiveSection />
        <InsightSection />
      </div>
    </PageWrapper>
  );
}
