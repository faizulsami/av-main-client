import Image from "next/image";

export default function MissionSection() {
  return (
    <section className="w-full">
      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-violet">
          Our Mission
        </h2>

        <div className="flex flex-col lg:flex-row items-center rounded-xl overflow-hidden text-center lg:text-start bg-soft-paste-light-hover p-4 gap-4">
          {/* Text Content */}
          <div className="prose prose-lg text-muted-foreground text-sm h-full w-full lg:w-1/2">
            <p>
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC,
              making it over 2000 years old. Richard McClintock, a Latin
              professor at Hampden-Sydney College in Virginia, looked up one of
              the more obscure Latin words, consectetur, from a Lorem Ipsum
              passage, and going through the cites of the word in classical
              literature, discovered the undoubtable source.
            </p>
            <br />
            <p>
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC,
              making it over 2000 years old. Richard McClintock, a Latin
              professor at Hampden-Sydney College in Virginia, looked up one of
              the more obscure Latin words, consectetur, from a Lorem Ipsum
              passage, and going through the cites of the word in classical
              literature, discovered the undoubtable source. Contrary to popular
              belief, Lorem Ipsum is not simply random text. It has roots in a
              piece of classical Latin literature from 45 BC, making it over
              2000 years old. Richard McClintock, a Latin professor at
              Hampden-Sydney College in Virginia, looked up one of the more
              obscure Latin words,
            </p>
          </div>

          {/* Image */}
          <div className="relative w-full lg:w-1/2 h-96 rounded-2xl overflow-hidden">
            <Image
              src="/images/our-mission.png"
              alt="Group of diverse people in a library showing support"
              className="object-cover"
              layout="fill"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
