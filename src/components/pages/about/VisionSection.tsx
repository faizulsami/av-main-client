export default function VisionSection() {
  return (
    <section className="w-full py-16">
      <div className="space-y-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-violet">
          Our Vision
        </h2>

        <div className="flex flex-col items-center rounded-xl overflow-hidden text-center bg-soft-paste-light-hover p-4 gap-4 max-w-4xl mx-auto">
          <div className="prose prose-lg text-muted-foreground text-sm w-full">
            <p>
            To create a world where every voice is heard, emotional well-being is prioritised, and mental health awareness eliminates the stigma around expressing one’s feelings, ensuring that no one faces their emotions in isolation.
            </p>
            {/* <br />
            <p>
              We envision a future where everyone has access to the resources
              and support they need to achieve mental wellness. Our commitment
              is to offer innovative therapies, personalized care, and
              continuous support to help individuals lead fulfilling lives.
            </p>
            <br />
            <p>
              We believe that mental health is a fundamental aspect of overall
              well-being, and we are dedicated to raising awareness and
              understanding of mental health issues. By fostering an environment
              of empathy and compassion, we hope to empower individuals to take
              control of their mental health and seek the help they need.
            </p>
            <br />
            <p>
              Our vision extends beyond just providing care; we aim to be a
              catalyst for change in the way society views and addresses mental
              health. Through education, advocacy, and community engagement, we
              strive to create a world where mental health is treated with the
              same importance as physical health.
            </p> */}
          </div>
        </div>
      </div>
    </section>
  );
}
