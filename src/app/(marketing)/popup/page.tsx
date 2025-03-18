"use client"

import { useState } from "react"
import { X } from "lucide-react"

export default function TermsPage() {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <div className=" min-h-screen flex flex-col items-center pt-10">
        <h1 className="text-5xl font-bold text-black mb-16">Get Support For Free</h1>
        <button
          onClick={() => setOpen(true)}
          className="px-6 py-2 bg-[#30a6b7] text-white rounded-md hover:bg-[#2a95a5]"
        >
          Show Terms Popup
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-10">
      <h1 className="text-5xl font-bold text-black mb-16">Get Support For Free</h1>

      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        {/* Modal */}
        <div className="bg-white rounded-lg max-w-md w-full overflow-hidden shadow-xl">
          {/* Header */}
          <div className="bg-[#30a6b7] text-white p-4 flex justify-between items-center">
            <h2 className="text-xl font-medium">Terms And Conditions</h2>
            <button onClick={() => setOpen(false)} className="text-white hover:text-gray-200 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p>
              This chat is intended to provide information of a general nature, aimed at helping people be informed
              about their family and personal life. It does not offer professional medical advice or prescribe the use
              of any particular form of treatment for any specific medical or none medical condition.
            </p>

            <p>
              If you have any concerns at all about your physical, mental, spiritual or emotional health, you should
              immediately seek out the services of a qualified medical practitioner. If you choose to act on any of the
              suggestions made here, which is your right, neither Kinjunxion nor any of the Certified Listeners assume
              any responsibility for your actions.
            </p>

            <p>We are "not" a crisis hotline. If you are in crisis, please call 911.</p>

            {/* Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <button className="px-8 py-2 rounded-full bg-[#30a6b7] text-white hover:bg-[#2a95a5] transition-colors">
                Agree
              </button>
              <button className="px-8 py-2 rounded-full border border-[#30a6b7] text-[#30a6b7] hover:bg-gray-50 transition-colors">
                Disagree
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}