"use client";

import { X } from "lucide-react";

interface CommunityGuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommunityGuidelinesModal({
  isOpen,
  onClose,
}: CommunityGuidelinesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-16 overflow-y-auto">
      <div className="bg-gradient-to-b from-purple-100 to-teal-100 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="text-2xl font-bold mb-4">
            Anonymous Voices Community Guidelines
          </h2>

          <div className="mb-6">
            <p className="mb-2">
              Welcome to the{" "}
              <span className="font-semibold">
                Anonymous Voices Community Section
              </span>{" "}
              – a safe space where individuals can share their thoughts, seek
              support, and engage in meaningful conversations about mental
              wellness. To maintain a positive and respectful environment, we
              ask all users to follow these rules and guidelines.
            </p>
          </div>

          <div className="mb-6 space-y-6">
            {[
              {
                icon: "🤝",
                title: "1. Respect and Kindness Above All",
                points: [
                  "Treat everyone with kindness and respect.",
                  "No hate speech, harassment, bullying, or personal attacks.",
                  "Avoid making assumptions about others’ experiences or mental health conditions.",
                ],
              },
              {
                icon: "🕵️‍♂️",
                title: "2. Maintain Confidentiality and Anonymity",
                points: [
                  "Do not share personally identifiable information (your own or others’).",
                  "Respect the privacy of community members.",
                  "Any attempt to expose or dox another user will lead to immediate action.",
                ],
              },
              {
                icon: "🚫",
                title: "3. No Harmful or Triggering Content",
                points: [
                  "Do not share content that promotes self-harm, suicide, or violence.",
                  "If discussing sensitive topics, use trigger warnings when necessary.",
                  "Avoid graphic descriptions of trauma, abuse, or distressing experiences.",
                ],
              },
              {
                icon: "🩺",
                title: "4. No Professional or Medical Advice",
                points: [
                  "This community is for support and sharing, not for medical diagnosis or treatment.",
                  "If you or someone else is in crisis, please seek professional help immediately.",
                ],
              },
              {
                icon: "❗",
                title: "5. No Misinformation or Harmful Advice",
                points: [
                  "Do not spread false information about mental health, treatments, or medications.",
                  "Misinformation that could harm others will be removed.",
                ],
              },
              {
                icon: "📢",
                title: "6. No Spam or Promotions",
                points: [
                  "No advertising, self-promotion, or soliciting services.",
                  "Do not share links to unrelated external websites or personal blogs.",
                ],
              },
              {
                icon: "💬",
                title: "7. Be Mindful of Language and Tone",
                points: [
                  "Use compassionate and non-judgmental language.",
                  "Avoid aggressive, confrontational, or overly negative tones.",
                ],
              },
              {
                icon: "🛡️",
                title: "8. Follow Moderation Decisions",
                points: [
                  "Our moderators are here to maintain a safe space. Please respect their decisions.",
                  "If you have concerns about moderation, contact support rather than arguing publicly.",
                ],
              },
              {
                icon: "🚨",
                title: "9. Report Inappropriate Behavior",
                points: [
                  "If you see harmful, abusive, or inappropriate content, report it to our moderators.",
                  "Do not engage in fights or arguments; let moderators handle conflicts.",
                ],
              },
              {
                icon: "🌱",
                title: "10. Community Over Individual Interests",
                points: [
                  "This space is for mutual support and encouragement.",
                  "Help maintain a positive environment by being considerate of others.",
                ],
              },
            ].map(({ icon, title, points }, idx) => (
              <div key={idx} className="flex gap-2">
                <span>{icon}</span>
                <div>
                  <p className="font-bold">{title}</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {points.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <p>
              <span className="font-bold">Violation of these guidelines</span>{" "}
              may result in content removal and permanent banning from the
              community.
            </p>
            <p className="mt-2">
              We appreciate your participation and efforts in making{" "}
              <span className="font-semibold">Anonymous Voices</span> a safe and
              uplifting space for everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
