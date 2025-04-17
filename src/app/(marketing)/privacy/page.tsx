import React from "react";
import TitleHeader from "@/components/common/TitleHeader";

export default function PrivacyPolicy() {
  return (
    <div
      className="w-full"
      style={{ backgroundImage: "url('/images/overlay/privacy-overlay.png')" }}
    >
      <div className="container mx-auto px-4 py-8 space-y-12 md:space-y-20">
        <TitleHeader title="Privacy Policy" />

        <section className="">
          <div className="w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-violet mb-10">
              Your Privacy Is Our Priority
            </h2>

            <div className="flex flex-col items-center gap-8">
              <div className="space-y-6 max-w-4xl mx-auto">
                <h3 className="text-xl md:text-2xl text-center font-bold text-soft-paste leading-tight">
                  LAST MODIFIED: 11/12/2024
                </h3>

                <div
                  className="space-y-4 text-muted-foreground text-md"
                  style={{ textAlign: "justify", textJustify: "inter-word" }}
                >
                  <p className="leading-relaxed text-md">
                    We appreciate your presence at Anonymous Voices ("Anonymous
                    Voices", "we", "us", or "our"). Anonymous Voices is
                    committed to protecting your privacy. This policy is set out
                    with respect to privacy and Personally-Identifying
                    Information (PII). By using our platform, you consent to the
                    collection and use of your information as described in this
                    policy.
                  </p>

                  <h3 className="text-xl font-bold text-violet mt-8 mb-4">
                    Information We Collect
                  </h3>
                  <p className="leading-relaxed">
                    Without the Age and Gender, you do not need to provide us
                    any other Personally-Identifying-Information (PII) in order
                    to use the services available at Anonymous Voices. Please
                    note that your age and gender will be kept strictly
                    confidential and will only be used to provide you with the
                    best possible service.
                  </p>

                  <h3 className="text-xl font-bold text-violet mt-8 mb-4">
                    When do We Collect Information?
                  </h3>
                  <p className="leading-relaxed">
                    We collect PII (your Age, Gender) from you when you
                    register, log in, use our chat and call features, or
                    interact with our websites/services.
                  </p>

                  <h3 className="text-xl font-bold text-violet mt-8 mb-4">
                    How We Use Your Information
                  </h3>
                  <p className="leading-relaxed">
                    We will not disclose your PII data to brokers, advertisers,
                    third parties, or to anyone else for marketing purposes. We
                    will use your information and PII for the following
                    purposes:
                  </p>
                  <ul className="list-disc pl-6 mt-2">
                    <li className="mb-2">
                      To collect anonymous data, such as usage statistics and
                      trends, may be necessary to improve our services.
                    </li>
                    <li>
                      To allow us to better serve you in responding to customer
                      service requests.
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-violet mt-8 mb-4">
                    Age Limitation
                  </h3>
                  <p className="leading-relaxed">
                    Our platform is not intended for use by children under the
                    age of 18. We do not knowingly collect personal information
                    from children under 18. If you are under 18, please do not
                    use our platform.
                  </p>

                  <h3 className="text-xl font-bold text-violet mt-8 mb-4">
                    Policy Updates
                  </h3>
                  <p className="leading-relaxed">
                    From time to time, we may change this Privacy Policy. If we
                    decide to change this Privacy Policy, in whole or in part,
                    we will inform you by posting the revised Privacy Policy on
                    our website. Those changes will go into effect on the
                    effective date disclosed in the revised Privacy Policy.
                  </p>

                  <h3 className="text-xl font-bold text-violet mt-8 mb-4">
                    Contact Information
                  </h3>
                  <p className="leading-relaxed">
                    If you have any questions or comments about this privacy
                    policy or how we handle PII you may contact us through our
                    email address.
                  </p>
                  <p className="font-medium text-[#86C6C6] mt-2">
                    anonymous.voices.av@gmail.com
                  </p>
                </div>
              </div>

              <div className="text-center text-xs opacity-50 max-w-2xl mx-auto mt-8 mb-4 pt-8 border-t border-gray-200">
                <p>
                  Remember, you have a community behind you. By sharing your
                  story, you&apos;re taking a step toward healing and growth.
                  Thank you for trusting Anonymous Voices.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
