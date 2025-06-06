"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import { Volunteer } from "@/types/volunteer";
import Loading from "@/app/loading";
import VolunteerCard from "@/components/cards/VolunteerCard";
import { useSearchParams } from "next/navigation";
import { ActionType } from "@/components/pages/home/hero/Hero";
import TitleHeader from "@/components/common/TitleHeader";
import useApprovedVolunteers from "@/hooks/useApprovedVolunteers";
import { useAuth } from "@/hooks/useAuth";
import VoiceCallModal from "@/components/ui/VoiceCallModal";

export default function Session() {
  const searchParams = useSearchParams();
  const actionParam = searchParams.get("action");
  const { approvedVolunteers, loading, error } =
    useApprovedVolunteers<Volunteer[]>();
  const [visibleCount, setVisibleCount] = useState(10);
  const { user } = useAuth();
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const sortedVolunteers = approvedVolunteers.sort((a, b) => {
    if (a.isOnline !== b.isOnline) {
      return a.isOnline ? -1 : 1; // Online volunteers come first
    }
    return a.name.localeCompare(b.name); // Then sort by name in ascending order
  });

  const validateActionType = (action: string | null): ActionType => {
    if (action === "chat" || action === "quick-call" || action === "booking") {
      return action;
    }
    return "chat";
  };

  const actionType = validateActionType(actionParam);

  const getHeaderText = () => {
    switch (actionType) {
      case "chat":
        return "Start a Chat Session";
      case "quick-call":
        return "Quick Call Session";
      case "booking":
        return "Book a Call Session";
      default:
        return "Make a Difference Today";
    }
  };

  const handleSeeMore = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      {actionType != "chat" && <VoiceCallModal />}

      {/* Header Section */}
      <TitleHeader title={getHeaderText()} />

      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg xl:text-xl text-soft-paste-dark font-bold mb-6">
          Who would you like to take the session with?
        </h2>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {sortedVolunteers.slice(0, visibleCount).map((volunteer, index) => (
            <motion.div
              key={volunteer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <VolunteerCard
                name={volunteer.name}
                userName={volunteer.userName}
                title={volunteer.title}
                gender={volunteer.gender}
                profileImage={volunteer.profileImage}
                isOnline={volunteer.isOnline}
                rating={volunteer.rating}
                yearsExperience={volunteer.yearsExperience}
                sessionsCompleted={volunteer.sessionsCompleted}
                expertise={volunteer.expertise}
                description={volunteer.description}
                actionType={actionType}
                user={user}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* See More Button */}
        {approvedVolunteers.length > visibleCount && (
          <div className="flex justify-center">
            <Button
              variant="secondary"
              className="bg-[#7FCCCC] text-white hover:bg-[#6BBBBB] transition-colors"
              onClick={handleSeeMore}
            >
              See More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
