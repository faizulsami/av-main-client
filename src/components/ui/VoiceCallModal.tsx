"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function VoiceCallModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [selected, setSelected] = useState<string>("");

  const router = useRouter();

  const handleSubmit = () => {
    if (selected == "yes") {
      setIsOpen(false);
    } else if (selected == "no") {
      // alert("You need an Android or PC browser to use voice call.");
      setIsOpen(false);
      router.push("/");
    } else {
      alert("Please select at least one option.");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(true)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/40 p-5" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-purple-100 p-6 shadow-xl">
          <div className="text-center">
            {/* Logo and URL */}
            <div className="flex items-center justify-between text-sm mb-2">
              <Image
                src="/images/logo.svg"
                alt="Anonymous Voices Logo"
                width={100}
                height={50}
                className="h-10 w-auto rounded"
              />
              <span className="text-gray-500">anonymousvoicesav.com</span>
            </div>

            {/* Title */}
            <div className="flex flex-col items-start my-2">
              <h2 className="text-2xl lg:text-4xl font-extrabold text-gray-900">
                Welcome to our
              </h2>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 flex items-center justify-center -ms-5">
                <Image
                  src={"/images/call-icon.png"}
                  alt="icon"
                  width={80}
                  height={80}
                />
                Voice Call
              </h1>
            </div>

            {/* Important Note */}
            <div className="flex items-stretch gap-0">
              <div className="">
                <div className="border border-purple-300 bg-[#E7DFFF] rounded-xl p-4 mb-4 text-left w-52 lg:w-60">
                  <p className="flex items-center text-black font-semibold mb-2">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Important Note:
                  </p>
                  <p className="text-sm text-gray-700">
                    To use the voice feature, you must have an Android device or
                    PC browser.
                  </p>
                </div>

                {/* Android + PC Icons */}
                <div className="flex items-center justify-start">
                  <img
                    src="/images/android.png"
                    alt="Android"
                    className="w-16 lg:w-24 h-16 lg:h-24"
                  />
                  <img
                    src="/images/pc.png"
                    alt="PC"
                    className="w-20 lg:w-32 h-20 lg:h-32"
                  />
                </div>
              </div>
              {/* men image */}
              <div className="w-full -ms-20">
                <img
                  src={"/images/men.png"}
                  alt="men"
                  className="h-[250px] lg:h-[300px] -mb-5 object-cover "
                />
              </div>
            </div>

            {/* Selection Options */}
            <div className="space-y-2 mb-4 text-left">
              <label className="flex text-white items-center gap-2 cursor-pointer border rounded-2xl bg-[#3E3DA4] p-4">
                <input
                  type="radio"
                  name="device"
                  value="yes"
                  checked={selected === "yes"}
                  onChange={() => setSelected("yes")}
                  className="form-radio text-indigo-600 w-5 h-5 rounded"
                />
                <span className="text-sm">
                  Yes, I have Android device or PC browser
                </span>
              </label>

              <div className="relative">
                <label className="flex items-center gap-2 cursor-pointer p-4 bg-[#E7DFFE] rounded-2xl">
                  <input
                    type="radio"
                    name="device"
                    value="no"
                    checked={selected === "no"}
                    onChange={() => setSelected("no")}
                    className="form-radio text-indigo-600 w-5 h-5"
                  />
                  <span className="text-[13px] pe-20 lg:pe-0">
                    No, I don’t have any of these devices
                  </span>
                </label>

                {/* Submit Button */}
                <div className="w-20 absolute top-0 right-3">
                  <button
                    onClick={handleSubmit}
                    className="bg-[#3E3DA4] hover:bg-indigo-700 text-white px-4 py-6 lg:py-3.5 rounded-2xl font-semibold transition absolute"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
