import Image from "next/image";
import Link from "next/link";

export default function ContactInfo() {
  return (
    <div
      className="relative bg-violet text-white p-4 lg:p-8 rounded-2xl bg-cover bg-center pb-10"
      style={{ backgroundImage: "url('/images/contact_info_bg.png')" }}
    >
      <div>
        <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
        <p className="text-sm mb-8">Say something to start a live chat!</p>
      </div>

      <div className="space-y-6 mb-10 mt-6">
        <div className="flex items-center gap-4">
          <Image
            src={"/images/icons/contact/phone-call.png"}
            alt=""
            width={20}
            height={20}
          />
          <p>+1012 3456 789</p>
        </div>
        <div className="flex items-center gap-4">
          <Image
            src={"/images/icons/contact/email.png"}
            alt=""
            width={20}
            height={20}
          />
          <p>anonymous.voices.av@gmail.com</p>
        </div>
        <div className="flex items-start gap-4">
          <Image
            src={"/images/icons/contact/location.png"}
            alt=""
            width={20}
            height={20}
          />
          <p>132 Dartmouth Street Boston, Massachusetts 02156 United States</p>
        </div>
      </div>

      <div className="flex gap-4 bg-white/20 w-fit py-2 px-6 rounded-r-lg absolute bottom-6 left-0">
        <Link href="#" className="hover:opacity-80">
          <Image
            src={"/images/icons/social/facebook.png"}
            alt=""
            width={24}
            height={24}
          />
        </Link>
        <Link href="#" className="hover:opacity-80">
          <Image
            src={"/images/icons/social/instagram.png"}
            alt=""
            width={24}
            height={24}
          />
        </Link>
        <Link href="#" className="hover:opacity-80">
          <Image
            src={"/images/icons/social/linkedin.png"}
            alt=""
            width={24}
            height={24}
          />
        </Link>
      </div>
    </div>
  );
}
