import { Check } from "lucide-react";
import Image from "next/image";

export default function ListenerSection() {
  const requirements = [
    "Background in psychology, social work, or counseling preferred",
    "Ability to commit [X] months for the program",
    "Willingness to work with a team",
    "Flexibility to take on varied tasks",
    "Background check required",
  ];

  const benefits = [
    "Gain experience in active listening and empathy.",
    "Make a difference in people’s lives.",
    "Comprehensive mental health and support training.",
    "Volunteer from home on a schedule that works for you",
  ];

  // const responsibilities = [
  //   "Patiently listening to individuals who reach out for support.",
  //   "Responding with empathy and understanding, creating a safe and non-judgmental space.",
  //   "Maintaining strict confidentiality of all conversations.",
  //   "Providing information about mental health resources and support services.",
  //   "Attend training sessions to develop and enhance listening skills.",
  //   "Report any concerns about user safety following the organization’s protocols.",
  //   "Collaborate with a team of listeners and coordinators to ensure quality service.",
  // ];

  return (
    <section className="w-full px-4">
      <div className="">
        <h1 className="text-3xl font-bold text-center text-violet">Listener</h1>
        <h2 className="text-xl md:text-2xl font-bold text-start text-soft-paste mt-6">
          Become a Listener
        </h2>

        <div className="space-y-12 mt-4">
          {/* Text Content */}
          <div className="space-y-8">
            <p className="text-muted-foreground leading-relaxed text-sm text-center lg:text-start">
              As part of our Placement Program, you&apos;ll have the opportunity
              to immerse yourself in the mental health sector. You will work
              closely with professionals, gaining hands-on experience and
              contributing to impactful, real-world projects that support
              individuals in need. This program is designed to help you grow
              both personally and professionally while making a meaningful
              difference in mental health care.
            </p>

            {/* Role of a Volunteer Listener Section */}
            {/* <div className="space-y-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Role of a Volunteer Listener
              </h3>
              <ul className="space-y-3 text-sm font-medium">
                {responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-soft-paste mt-1 flex-shrink-0" />
                    <span className="text-gray-600">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div> */}

            {/* Requirements Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Required Qualifications
                </h3>
                <ul className="space-y-3 text-sm font-medium">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-soft-paste mt-1 flex-shrink-0" />
                      <span className="text-gray-600">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative w-full rounded-2xl overflow-hidden mt-6">
                <Image
                  src="/images/requirements.png"
                  alt="Mobile app interface showing task management"
                  className="object-cover"
                  loading="lazy"
                  width={600}
                  height={400}
                />
              </div>
            </div>

            {/* Benefits Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Benefits
                </h3>
                <ul className="space-y-3 text-sm font-medium">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-soft-paste mt-1 flex-shrink-0" />
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative w-full rounded-2xl overflow-hidden mt-6">
                <Image
                  src="/images/benefits.png"
                  alt="Document management interface"
                  className="object-cover"
                  loading="lazy"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h1 className="text-3xl font-bold text-center text-violet">
          Placement
        </h1>

        <div className="space-y-12 mt-4">
          {/* Text Content */}
          <div className="space-y-8">
            <p className="text-muted-foreground leading-relaxed text-sm text-center lg:text-start">
              As part of our Placement Program at Anonymous Voice, you will have
              the unique opportunity to gain practical, hands-on experience in
              the mental health sector. Collaborating with experienced
              professionals, you&apos;ll be involved in real-world projects that
              make a meaningful impact. This program is designed to enhance your
              skills, deepen your understanding of mental health, and contribute
              to providing vital support to those in need.
            </p>

            {/* Role of a Volunteer Listener Section */}
            {/* <div className="space-y-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Role of a Volunteer Listener
              </h3>
              <ul className="space-y-3 text-sm font-medium">
                {responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-soft-paste mt-1 flex-shrink-0" />
                    <span className="text-gray-600">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div> */}

            {/* Requirements Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Required Qualifications
                </h3>
                <ul className="space-y-3 text-sm font-medium">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-soft-paste mt-1 flex-shrink-0" />
                      <span className="text-gray-600">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative w-full rounded-2xl overflow-hidden mt-6">
                <Image
                  src="/images/requirements.png"
                  alt="Mobile app interface showing task management"
                  className="object-cover"
                  loading="lazy"
                  width={600}
                  height={400}
                />
              </div>
            </div>

            {/* Benefits Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Benefits
                </h3>
                <ul className="space-y-3 text-sm font-medium">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-soft-paste mt-1 flex-shrink-0" />
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative w-full rounded-2xl overflow-hidden mt-6">
                <Image
                  src="/images/benefits.png"
                  alt="Document management interface"
                  className="object-cover"
                  loading="lazy"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
