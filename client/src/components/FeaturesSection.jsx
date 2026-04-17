import React from "react";

const features = [
  {
    title: "AI-POWERED MATCHING ENGINE",
    desc: "AI matches lost and found items using smart text and image analysis — fast, accurate, and reliable.",
  },
  {
    title: "LOCATION PINNING",
    desc: "Drop a precise pin where you lost or found it. Geo-filtered matches only show reports near you.",
  },
  {
    title: "REAL-TIME ALERTS",
    desc: "The moment a new match appears — you’ll know instantly.",
  },
  {
    title: "OTP VERIFIED HANDOFF",
    desc: "A one-time code confirms the exchange. Secure and safe.",
  },
  {
    title: "COMMUNITY TRUST SCORES",
    desc: "Two-way ratings build a trustworthy community of users.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-black py-20 w-full">
      <div className="max-w-6xl mx-auto px-4">

        {/* Heading */}
        <div className="mb-16 text-left">
          <span className="text-[#FF2E7E] text-xs tracking-widest">
            02 — FEATURES
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white uppercase">
            Built to actually work.
          </h2>
        </div>

        {/* TIMELINE */}
        <div className="relative">

          {/* Horizontal Line */}
          <div className="hidden md:block absolute top-6 left-0 right-0 h-[2px] bg-white/10"></div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

            {features.map((feature, idx) => (
              <div key={feature.title} className="flex flex-col items-center group">

                {/* NUMBER CIRCLE */}
                <div className="z-10 w-12 h-12 flex items-center justify-center 
                rounded-full bg-[#111] border border-white/20 text-gray-400 font-bold
                transition-all duration-300 group-hover:bg-[#FF2E7E] group-hover:text-white">
                  {String(idx + 1).padStart(2, "0")}
                </div>

                {/* MOBILE CONNECTOR */}
                {idx !== features.length - 1 && (
                  <div className="md:hidden w-[2px] h-10 bg-white/10"></div>
                )}

                {/* CONTENT BOX (EQUAL HEIGHT) */}
                <div className="mt-6 w-full h-full flex flex-col 
                bg-[#111] border border-[#232323] rounded-xl p-6 
                hover:border-[#FF2E7E] transition duration-300">

                  {/* TITLE */}
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-3">
                    {feature.title}
                  </h3>

                  {/* DESCRIPTION (flex grow for equal height) */}
                  <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                    {feature.desc}
                  </p>

                </div>

              </div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}