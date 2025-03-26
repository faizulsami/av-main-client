import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DonationDetails() {
  return (
    <section className="w-full py-16">
      <div className="">
        {/* <h1 className="text-2xl font-bold text-center text-violet mb-12">
          Donation Details
        </h1> */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bank Details */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="text-lg text-soft-paste">
                Bank Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-medium">Account Name:</span> Anonymous
                Voices
              </div>
              <div>
                <span className="font-medium">Account Number:</span>{" "}
                110*****9577
              </div>
              <div>
                <span className="font-medium">Bank Name:</span> Dutch Bangla
                Bank Ltd.
              </div>
              <div>
                <span className="font-medium">Branch Name:</span> Mirpur 10
                Branch.
              </div>
              <div>
                <span className="font-medium">Routing No:</span> 092548183
              </div>
            </CardContent>
          </Card> */}

          {/* Online Banking Details */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="text-lg text-soft-paste">
                Online Banking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-medium">Account Name:</span> Anonymous
                Voices
              </div>
              <div>
                <span className="font-medium">Bkash:</span> 110*****9577
              </div>
              <div>
                <span className="font-medium">Nagad:</span> 215462321548
              </div>
              <div>
                <span className="font-medium">Rocket:</span> 12458796542
              </div>
              <div>
                <span className="font-medium">Upay:</span> 09254818353
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Support Our Mission */}
        <div className="rounded-xl p-6 text-muted-foreground bg-soft-paste-light-hover leading-relaxed text-md mb-8">
          <h2 className="text-3xl font-bold text-center text-violet mb-4">
            Support Our Mission
          </h2>
          <p className="text-md">
          Anonymous Voices is a growing platform, your generosity can help us expand our reach and continue providing support to those in need. Every contribution, no matter how small, can make a big impact. With your generous donation, we will be able to:
          </p>
          <ul className="list-disc list-inside mt-4">
            <li>Expand our services and reach even more individuals.</li>
            <li>
              Train more volunteers to equip them with the skills to offer
              greater support.
            </li>
            <li>
              Improve our platform to ensure it remains user-friendly, safe, and
              accessible to all.
            </li>
            <li>
              Innovate mental health support by allowing us to offer
              professional counseling services in the future, ensuring
              individuals receive the expert care they need.
            </li>
          </ul>
          <p className="mt-4 font-extrabold text-md">
            If you’re interested in supporting our cause, please connect with us
            via our official email, and we’ll share the necessary details to
            guide you through the donation process.
          </p>
          <p className="mt-4 font-medium">Our Email address</p>
          <a className="text-blue-500" href="mailto:anonymous.voices.av@gmail.com"><p>anonymous.voices.av@gmail.com</p></a>
          
          <p className="mt-4">
            Thank you for believing in our mission and for helping us create a
            space where everyone feels heard and valued.
          </p>
        </div>

        {/* Thank You Message */}
        {/* <div className="rounded-xl p-6 text-muted-foreground bg-soft-paste-light-hover leading-relaxed text-md">
          Thank you for your generous donation to Anonymous Voices. Your support
          is invaluable in our mission to promote mental health awareness and
          provide essential resources to those in need. With your contribution,
          we can continue to make a meaningful impact in our community and
          beyond, offering hope and support to individuals facing mental health
          challenges. Together, we are creating a brighter future for mental
          well-being. Thank you once again for your kindness and generosity.
        </div> */}
      </div>
    </section>
  );
}
