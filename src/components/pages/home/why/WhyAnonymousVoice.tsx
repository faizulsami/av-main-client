import { Button } from "@/components/ui/button";
import Image from "next/image";
import { VideoSection } from "../stat/VideoSection";
import ArrowHand from "@/components/buttons/ArrowHand";
import Link from "next/link";

export default function WhyAnonymousVoice() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 overflow-hidden">
      <h2 className="text-2xl md:text-4xl font-bold text-violet text-center mb-4 lg:mb-8">
        What to Expect from Anonymous Voices?
      </h2>

      <div className="mx-auto pt-4">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* Left Column */}
          <div className="w-2/3">
            <div className="space-y-6 text-center lg:text-start w-full lg:w-2/3">
              <h2 className="text-xl md:text-2xl font-bold text-soft-paste leading-tight">
                A Safe, Confidential Space
              </h2>

              <p className="text-md opacity-60 leading-relaxed">
                Anonymously share your thoughts, emotions, and experiences,
                knowing your privacy is protected—free from judgment or
                identification.
              </p>
            </div>
            <div className="space-y-6 text-center lg:text-start w-full lg:w-2/3 mt-4">
              <h2 className="text-xl md:text-2xl font-bold text-soft-paste leading-tight">
                Dedicated to Listening
              </h2>

              <p className="text-md opacity-60 leading-relaxed">
                We do not offer therapy or professional advice, but our platform
                provides a space for open expression, where anonymous volunteers
                may offer supportive messages without providing professional
                guidance with empathy.
              </p>
            </div>
            <div className="space-y-6 text-center lg:text-start w-full lg:w-2/3 mt-4">
              <h2 className="text-xl md:text-2xl font-bold text-soft-paste leading-tight">
                No Professional Intervention
              </h2>

              <p className="text-md opacity-60 leading-relaxed">
                Our platform is not a substitute for therapy or professional
                mental health services. If you need professional support, we
                encourage you to reach out to a licensed provider. While we may
                provide links to external mental health resources, we do not
                endorse any specific services.
              </p>
            </div>
            <div className="space-y-6 text-center lg:text-start w-full lg:w-2/3 mt-4">
              <h2 className="text-xl md:text-2xl font-bold text-soft-paste leading-tight">
                Expression without Pressure
              </h2>

              <p className="text-md opacity-60 leading-relaxed">
                Use our call or chat services to vent your feelings, whether you
                {"'"}re celebrating a success or facing a challenge
              </p>
              <div className="mt-4">
                <Link href="/about">
                  <Button className="bg-soft-paste rounded-md">
                    Learn More
                    <ArrowHand />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="relative w-full lg:w-1/2">
            <div className="absolute inset-0 -z-10">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[100%] aspect-square rounded-full bg-soft-paste-dark/10" />

              <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[100%] aspect-square rounded-full bg-violet/10" />
            </div>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
              <div className="mx-auto">
                <Image
                  src="/images/Home Page Section.svg"
                  alt="Mental health professionals in a supportive group session"
                  className="w-full h-full object-cover"
                  layout="fill"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <VideoSection
        imageUrl="/images/why-av-vid.png"
        videoUrl="https://www.youtube.com/embed/s5JtxOAb1GU?si=rodbBORi6mOvCW9N"
      />
    </section>
  );
}
