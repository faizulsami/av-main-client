import TitleHeader from "@/components/common/TitleHeader";
import React from "react";
import Community from "../../../components/pages/community/community";
export const metadata = {
  title: "Community",
};
const CommunityPage = () => {
  return (
    <div
      className="w-full"
      style={{ backgroundImage: "url('/images/overlay/about-overlay.png')" }}
    >
      <div className="container mx-auto px-4 py-8 space-y-12 md:space-y-20">
        <TitleHeader title="Post Our Community" />
        <Community></Community>
      </div>
    </div>
  );
};

export default CommunityPage;
