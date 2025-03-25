"use client";

import Loading from "@/app/loading";
import TitleHeader from "@/components/common/TitleHeader";
import HowToApplySection from "@/components/pages/mentor-reg/HowToApplySection";
import ListenerFAQ from "@/components/pages/mentor-reg/ListenerFAQ";
import ListenerSection from "@/components/pages/mentor-reg/ListenerSection";
import MentorRegistrationForm from "@/components/pages/mentor-reg/MentorRegistrationForm";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

const MentorRegistration = () => {
  const { user, isAuthenticated, loading } = useAuth();
  console.log("USER at - MentorRegistration", user);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-10 md:space-y-20">
      <TitleHeader title="Become a Listener and Make a Change" />
      <ListenerSection />
      {/* <ListenerFAQ /> */}
      <HowToApplySection />
      {isAuthenticated ? (
        <div className="flex gap-2 justify-center font-medium bg-soft-paste-light-hover py-4 px-8 rounded-lg w-fit mx-auto">
          You are already logged in as{" "}
          <div className="flex gap-1 text-violet">
            <Badge>
              <span>@{user?.userName}</span>
              <span>
                (
                {user?.role === "mentee"
                  ? "mentee"
                  : user?.role === "mentor"
                    ? "listener"
                    : "admin"}
                )
              </span>
            </Badge>
          </div>
        </div>
      ) : (
        <MentorRegistrationForm />
      )}
    </div>
  );
};

export default MentorRegistration;
