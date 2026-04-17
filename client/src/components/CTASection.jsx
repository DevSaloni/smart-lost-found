import React from "react";

export default function CTASection() {
  return (
    <section className="bg-black py-24 w-full text-center">
      <div className="max-w-6xl mx-auto px-4">
        <span className="text-[#FF2E7E] font-mono tracking-widest text-xs">— START NOW —</span>

        {/* ✅ ONLY CHANGE HERE */}
        <h2 className="text-center text-white text-4xl md:text-6xl font-bold leading-tight max-w-5xl mx-auto">
          SOMEONE OUT THERE FOUND YOUR THING.
        </h2>
        <p className="mt-4 text-gray-200 text-sm">
          Report it in 60 seconds. It's completely free.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 rounded-md bg-[#FF2E7E] text-white font-bold text-base shadow-lg hover:bg-pink-600 transition-colors duration-200">
            REPORT LOST ITEM
          </button>

          <button className="px-8 py-3 rounded-md bg-black border-2 border-[#FF2E7E] text-white font-bold text-base shadow hover:bg-[#FF2E7E]/10 transition-colors duration-200">
            BROWSE FOUND ITEMS
          </button>
        </div>
      </div>
    </section>
  );
}