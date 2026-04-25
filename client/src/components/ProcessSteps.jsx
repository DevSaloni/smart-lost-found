import React from "react";

const steps = [
  {
    icon: (
      <svg width="42" height="42" fill="none" viewBox="0 0 24 24" className="text-[#FF2E7E] mb-3">
        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 3v4a1 1 0 0 0 1 1h4M4 7v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2Zm3 3h7m-7 4h4" />
      </svg>
    ),
    title: "Report it",
    desc: "Describe your item, upload a photo, and pin the location. Takes 60 seconds.",
  },
  {
    icon: (
      <svg width="42" height="42" fill="none" viewBox="0 0 24 24" className="text-[#FF2E7E] mb-3">
        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />
      </svg>
    ),
    title: "AI matches",
    desc: "Our engine uses text + image embeddings to rank every report by similarity score.",
  },
  {
    icon: (
      <svg width="42" height="42" fill="none" viewBox="0 0 24 24" className="text-[#FF2E7E] mb-3">
        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" />
      </svg>
    ),
    title: "Connect safely",
    desc: "Chat anonymously inside FindIt. Zero personal info shared until you choose.",
  },
  {
    icon: (
      <svg width="42" height="42" fill="none" viewBox="0 0 24 24" className="text-[#FF2E7E] mb-3">
        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    title: "Return it",
    desc: "Verify the handoff with a one-time OTP code. Case closed. Item home.",
  },
];

export default function ProcessSteps() {
  return (
    <section className="bg-black py-20 w-full">
      <div className="max-w-6xl mx-auto px-4">

        {/* Heading */}
        <div className="mb-12 text-left">
          <span className="text-[#FF2E7E] font-mono tracking-widest text-xs">
            01 — PROCESS
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white leading-tight">
            FOUR STEPS.<br className="hidden md:block" />ONE THING BACK.
          </h2>
        </div>

        {/* Grid */}
        <div className="rounded-2xl bg-[#111] grid grid-cols-1 md:grid-cols-4 overflow-hidden border border-[#232323] divide-y md:divide-y-0 md:divide-x divide-[#232323]">

          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="group flex flex-col items-start text-left px-6 md:px-10 py-10 md:py-14 transition"
            >

              {/* Number */}
              <span className="text-5xl md:text-6xl font-bold text-[#232323] mb-4 transition-colors duration-300 group-hover:text-[#FF2E7E]">
                {String(idx + 1).padStart(2, "0")}
              </span>

              {/* Icon */}
              {step.icon}

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-300 text-sm md:text-base mt-1 leading-relaxed">
                {step.desc}
              </p>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}