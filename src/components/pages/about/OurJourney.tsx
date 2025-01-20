import Image from "next/image";

export default function OurJourney() {
  return (
    <section className="">
      <div className="w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-violet mb-10">
          Our Journey
        </h2>

        <div className="flex flex-col items-center gap-8">
          <div className="space-y-6 text-center max-w-4xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold text-soft-paste leading-tight ">
              Committed to Your Mental <br /> Wellness with Compassionate Care
            </h3>

            <div className="space-y-4 text-muted-foreground text-sm">
              <p className="leading-relaxed">
                It all started one day when one of the three of us was visibly
                exhausted and struggling to concentrate. When we asked her what
                was wrong, she said she hadn’t slept the night before and had to
                wake up early. Knowing this wasn’t a one-off occurrence—she
                often had sleepless nights followed by drained, difficult
                days—we urged her to open up about what was really going on. She
                confided that she stayed up late, overwhelmed by thoughts about
                her life, and had formed the frustrating belief that she was
                “good for nothing.” She shared that she had sought professional
                help, but the process of scheduling appointments and the lack of
                immediate support made it feel more like a hassle than help.
                What she truly wished for was someone she could talk to in the
                moment—someone who would listen without judgment, whenever she
                needed it.
              </p>
              <p className="leading-relaxed">
                As we listened to her, we realized that all of us, in different
                ways and to different extents, faced similar struggles. The
                desire for a safe space to express ourselves without fear of
                judgment or being treated differently began to resonate deeply.
                We wanted a place where we wouldn’t have to worry about being
                misunderstood, facing future repercussions, or even harassment.
                So, we started searching for existing platforms that might offer
                such a space. We found many—but new concerns quickly arose.
              </p>

              <p className="leading-relaxed">
                <br /> “Do I really need to see a psychiatrist for this?” <br />{" "}
                “If I call, will my phone number be used for something else?”{" "}
                <br />
                “What if they see my identity when I sign up, and someone I know
                works there?” <br /> “Is this really worth the high cost?”
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

          <div className="space-y-4 text-muted-foreground text-sm max-w-4xl mx-auto text-center">
            <p className="leading-relaxed">
              And then, a few days later, we had a thought: why not create
              something ourselves that could address all these concerns? As we
              shared our thoughts and ideas with friends and others, we realized
              how many shared the same concerns. Some didn’t even know such
              platforms existed, while others avoided them for the very reasons
              that made us hesitate. Many encouraged us, believing in the vision
              of a platform that would eliminate these barriers. That’s when the
              idea of Anonymous Voices started to take shape. We wanted to
              create a platform that would allow anyone to express their
              thoughts freely, without fear of judgment, identity exposure, or
              high costs. When we pitched this idea to BYLC’s BBLT/J Scale-up
              Funding program, we were fortunate enough to win a grant to make
              it a reality. And so, Anonymous Voices was born—a safe, anonymous
              space where everyone’s voice matters and no one has to face their
              feelings alone.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
