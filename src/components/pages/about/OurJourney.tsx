import Image from "next/image";

export default function OurJourney() {
  return (
    <section className="">
      <div className="w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-violet mb-10">
          Our Journey
        </h2>

        <div className="flex flex-col items-center gap-6">
          <div className="space-y-6 text-center max-w-4xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold text-soft-paste leading-tight ">
              Committed to Your Mental <br /> Wellness with Compassionate Care
            </h3>

            <div className="space-y-4 text-muted-foreground text-sm">
              <p className="leading-relaxed">
                Our journey began with a simple mission: to provide accessible
                and compassionate mental health care to everyone in need. Over
                the years, we have grown into a community of dedicated
                professionals and volunteers who are passionate about making a
                difference in people&apos;s lives.
              </p>
              <p className="leading-relaxed">
                We believe that mental wellness is a fundamental right, and we
                strive to create a safe and supportive environment where
                individuals can seek help without fear of judgment. Our team is
                committed to offering personalized care, innovative therapies,
                and continuous support to help you achieve your mental health
                goals.
              </p>
            </div>
          </div>

          <div className="relative w-full max-w-4xl mx-auto rounded-xl border overflow-hidden shadow-lg">
            <Image
              src="/images/about/who-we-are.webp"
              alt="Supportive mental health consultation"
              className="w-full object-cover text-xs"
              loading="lazy"
              width={1200}
              height={600}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
