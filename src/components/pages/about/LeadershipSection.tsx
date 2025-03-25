import Image from "next/image";
import { TeamMember } from "./types.about";

const members: TeamMember[] = [
  {
    name: "Maria Aaka",
    role: "Volunteer",
    image: "/images/volunteers/volunteer1.png",
  },
  {
    name: "Farha Tasnim",
    role: "Volunteer",
    image: "/images/volunteers/volunteer2.png",
  },
  {
    name: "Nahin Rahman Sami",
    role: "Co-director",
    image: "/images/volunteers/volunteer3.png",
  },
];

export default function LeadershipSection() {
  return (
    <section className="w-full">
      <div className="">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-violet mb-10">
          Our Leadership
        </h2>

        <div className="container mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-8">
          {members.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  className="object-cover"
                  width={1000}
                  height={1000}
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-center">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>

        {/* <div className="flex justify-center">
          <Button
            variant="outline"
            className="bg-soft-paste text-white border-0"
          >
            See More
          </Button>
        </div> */}
      </div>
    </section>
  );
}
