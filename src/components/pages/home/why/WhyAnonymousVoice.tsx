import { Button } from "@/components/ui/button";
import Image from "next/image";
import { VideoSection } from "../stat/VideoSection";
import ArrowHand from "@/components/buttons/ArrowHand";

export default function WhyAnonymousVoice() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 overflow-hidden">
      <h2 className="text-lg md:text-2xl font-bold text-violet text-center mb-4 lg:mb-8">
      What to Expect from Anonymous Voices?
      </h2>

      <div className="mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* Left Column */}
          <div className="space-y-6 text-center lg:text-start w-full lg:w-2/3">
            <h2 className="text-xl md:text-3xl font-bold text-soft-paste leading-tight">
            A Safe, Confidential Space
            </h2>

            <p className="text-sm opacity-60 leading-relaxed">
            Anonymously share your thoughts, emotions, and experiences, knowing your privacy is protected—free from judgment or identification.
            </p>
            <Button className="bg-soft-paste rounded-md">
              Learn More
              <ArrowHand />
            </Button>
          </div>

          {/* Right Column */}
          <div className="relative w-full lg:w-1/2">
            <div className="absolute inset-0 -z-10">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[100%] aspect-square rounded-full bg-soft-paste-dark/10" />

              <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[100%] aspect-square rounded-full bg-violet/10" />
            </div>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
              <Image
                src="/images/why-av.png"
                alt="Mental health professionals in a supportive group session"
                className="w-full h-full object-cover"
                layout="fill"
              />
            </div>
          </div>
        </div>
      </div>
      <VideoSection
        imageUrl="/images/why-av-vid.png"
        videoUrl="/meditation-video.mp4"
      />
    </section>
  );
}
