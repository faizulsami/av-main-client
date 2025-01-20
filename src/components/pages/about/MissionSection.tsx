export default function MissionSection() {
  return (
    <section className="w-full">
      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-violet">
          Our Mission
        </h2>

        <div className="flex flex-col items-center rounded-xl overflow-hidden text-center bg-soft-paste-light-hover p-4 gap-4 max-w-4xl mx-auto">
          <div className="prose prose-lg text-muted-foreground text-sm h-full w-full">
            <p>
              Our mission is to provide accessible and compassionate mental
              health care to everyone in need. We are dedicated to creating a
              safe and supportive environment where individuals can seek help
              without fear of judgment.
            </p>
            <br />
            <p>
              We strive to offer personalized care, innovative therapies, and
              continuous support to help you achieve your mental health goals.
              Our team of professionals and volunteers is passionate about
              making a positive impact in the lives of those we serve.
            </p>
            <br />
            <p>
              We believe that mental health is a fundamental aspect of overall
              well-being. By fostering an environment of empathy and compassion,
              we aim to empower individuals to take control of their mental
              health and seek the help they need. Our commitment extends beyond
              just providing care; we aim to be a catalyst for change in the way
              society views and addresses mental health.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
