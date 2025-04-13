import React from "react";

const Crisis = () => {
  return (
    <div className="space-y-6 text-muted-foreground mx-auto text-center py-8">
      <h1 className="text-2xl md:text-4xl font-bold text-violet">
        Crisis Intervention Plan
      </h1>
      <p>
        Anonymous Voices is not equipped as an emergency hotline service for any
        critical situation or as any legal service provider. If you are
        searching for such services, here are some numbers that might be
        helpful:
      </p>
      <ul className="space-y-4 text-left">
        <li>
          <strong className="text-soft-paste-hover underline">999</strong> - A
          National Emergency Hotline number equipped to provide immediate
          services requiring police or hospitals.
        </li>
        <li>
          <strong className="text-soft-paste-hover underline">109</strong> - A
          Government Helpline number for reporting violence against women and
          prevention of child marriage that works as a support and
          multi-sectoral referral system.
        </li>
        <li>
          <strong className="text-soft-paste-hover underline">333</strong> - A
          National Hotline number for immediate reports and help for any social
          problems from inquiries after COVID-19 to child marriage and sexual
          harassment cases.
        </li>
        <li>
          <strong className="text-soft-paste-hover underline">10921</strong> - A
          National Helpline Center for reporting violence against women that
          provides immediate service to victims and links up to relevant
          agencies: doctors, counselors, lawyers, DNA experts, and police
          officers.
        </li>
        <li>
          <strong className="text-soft-paste-hover underline">
            01724415677
          </strong>{" "}
          - A Hotline number of Ain o Salish Kendra (ASK) providing legal
          assistance, emergency shelter, and mental healthcare. The number is
          accessible from 9 am to 5 pm.
        </li>
        <li>
          <strong className="text-soft-paste-hover underline">
            01714048418 (SRHR); 01771 444666 (legal)
          </strong>{" "}
          - Hotline numbers of Bandhu Social Welfare Society (In collaboration
          with Ministry of Social Welfare) providing psychosocial support as
          well as guidelines for SRHR and legal aspects.
        </li>
      </ul>
    </div>
  );
};

export default Crisis;
