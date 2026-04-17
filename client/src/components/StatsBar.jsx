import React from "react";

const stats = [
  { value: "94%", label: "Match accuracy" },
  { value: "12K+", label: "Items returned" },
  { value: "<4H", label: "Average match time" },
  { value: "0", label: "Personal data shared" },
];

export default function StatsBar() {
  return (
    <section className="bg-black py-16 w-full relative overflow-hidden">

      {/* 🔥 FULL WIDTH GLOW (NO SPACING) */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[700px] h-[250px] bg-[#FF2E7E] opacity-10 blur-[140px]" />
      </div>

      {/* 🔥 FULL WIDTH GLASS BAR */}
      <div className="relative w-full">
        <div className="flex flex-col md:flex-row items-center justify-between 
        w-full bg-white/5 backdrop-blur-xl border-y border-white/10 ">

          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`flex-1 flex flex-col items-center justify-center py-10 px-4 text-center
              ${idx !== stats.length - 1 ? "border-b md:border-b-0 md:border-r border-white/10" : ""}`}
            >

              {/* value */}
              <span className="text-4xl md:text-5xl font-bold text-[#FF2E7E] 
             ">
                {stat.value}
              </span>

              {/* label */}
              <span className="mt-2 text-sm text-gray-400 tracking-wide">
                {stat.label}
              </span>

            </div>
          ))}
        </div>
      </div>

    </section>
  );
}