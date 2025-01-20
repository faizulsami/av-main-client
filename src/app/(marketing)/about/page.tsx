import React from "react";
import TitleHeader from "@/components/common/TitleHeader";
import OurJourney from "@/components/pages/about/OurJourney";
import LeadershipSection from "@/components/pages/about/LeadershipSection";
import MissionSection from "@/components/pages/about/MissionSection";
import VisionSection from "@/components/pages/about/VisionSection";
import QuotationsSection from "@/components/pages/about/QuotationsSection";

const AboutPage = () => {
  return (
    <div
      className="w-full"
      style={{ backgroundImage: "url('/images/overlay/about-overlay.png')" }}
    >
      <div className="container mx-auto px-4 py-8 space-y-12 md:space-y-20">
        <TitleHeader title="Want To Know More About Us?" />
        <OurJourney />
        <LeadershipSection />
        <MissionSection />
        <VisionSection />
        <QuotationsSection />
      </div>
    </div>
  );
};

export default AboutPage;
