"use client"

import { X } from "lucide-react"

interface CommunityGuidelinesModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CommunityGuidelinesModal({ isOpen, onClose }: CommunityGuidelinesModalProps) {
  if (!isOpen) return null

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

          <h2 className="text-2xl font-bold mb-4">Community Guidelines</h2>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber-500">⚠️</span>
              <h3 className="text-xl font-bold text-amber-500">Important: Read Before You Post!</h3>
            </div>

            <p className="mb-2">
              Welcome to the Skool Community! ✨ Before you jump in,{" "}
              <span className="font-bold">please take a moment to read these guidelines carefully and in full</span>.
              They're designed to keep our community helpful, respectful, and focused on your success.
            </p>

            <p className="mb-2">
              Ignoring these rules may lead to posts being removed, or in serious cases, your account access being
              flagged or revoked. Let's keep this space positive and valuable for everyone!
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3">Categories for Posting:</h3>

            <div className="space-y-4">
              <div className="flex gap-2">
                <span className="text-amber-500">🏆</span>
                <div>
                  <p className="font-bold">Student Wins</p>
                  <p>
                    - Share your success stories! This is the place to post about client achievements, new projects,
                    milestones, and any exciting updates in your freelancing journey.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <span>🎬</span>
                <div>
                  <p className="font-bold">Video Editing Tricks</p>
                  <p>
                    - Got a cool trick or tutorial? Share video editing tips, shortcuts, and hacks that could help
                    fellow students level up their skills.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <span>💼</span>
                <div>
                  <p className="font-bold">Freelancing Tips</p>
                  <p>
                    - Share valuable freelancing insights, negotiation tips, client-handling advice, or anything that
                    can help others succeed in their freelance careers.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <span>🐞</span>
                <div>
                  <p className="font-bold">Report a Bug</p>
                  <p>
                    - Help us improve! If you find any bugs or issues with the website, let us know here. Your feedback
                    is crucial for creating a smooth experience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3">Community House Rules:</h3>

            <div className="space-y-4">
              <div className="flex gap-2">
                <span>🙏</span>
                <div>
                  <p className="font-bold">Stay Respectful</p>
                  <p>
                    - Keep it positive! Treat everyone with respect, and avoid offensive language or personal attacks.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <span>⛔</span>
                <div>
                  <p className="font-bold">No Spamming</p>
                  <p>
                    - Avoid repetitive posts, self-promotions, or off-topic discussions. Let's keep the focus on
                    learning and growth.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <span>📋</span>
                <div>
                  <p className="font-bold">Category Only Posts</p>
                  <p>
                    - Post content that fits within the categories above. Avoid posting assignments or asking for
                    feedback on your work.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <span>⚠️</span>
                <div>
                  <p className="font-bold">Report Issues Responsibly</p>
                  <p>- Use the Report a Bug section responsibly, focusing on actual site issues.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3">Content Upload Guidelines</h3>

            <div className="space-y-4">
              <div className="flex gap-2">
                <span>📝</span>
                <div>
                  <p className="font-bold">Tutorials Format</p>
                  <p>
                    - When sharing tutorials or tips, please use only
                    <span className="font-bold">YouTube video links</span> (copied directly from the browser) or
                    <span className="font-bold">images</span>. This ensures easy access for all community members.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

