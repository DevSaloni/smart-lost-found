import React from "react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="bg-black min-h-[85vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">


      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 py-10 max-w-4xl">

        <div className="px-5 py-2 rounded-full 
bg-white/10 backdrop-blur-md border border-white/20 
text-xs tracking-widest text-gray-300 uppercase 
shadow-[0_0_15px_rgba(255,255,255,0.1)]">

          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#FF2E7E] rounded-full"></span>
            AI-Powered Lost & Found
          </span>

        </div>
        {/* 🔥 Heading */}
        <h1 className="text-[clamp(4rem,9vw,5.9rem)] font-bold leading-[1.05] tracking-tight">
          <span className="block text-[#FF2E7E]">Lost Something?</span>
          <span className="block text-white">We'll Find It.</span>
        </h1>

        {/* ✨ Subheading */}
        <p className="text-base md:text-[16px] text-gray-400 max-w-xl leading-relaxed">
          Report lost or found items instantly and connect with people nearby in seconds.
          Our smart system ensures secure, anonymous matching — making recovery faster, safer, and stress-free.        </p>

        {/* 🚀 Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">

          {/* PRIMARY CTA */}
          <Link to="/report-item" className="px-10 py-3 rounded-full bg-[#FF2E7E] text-white font-bold text-sm tracking-wide
         hover:bg-pink-600 transition duration-300 flex items-center justify-center">
            I LOST SOMETHING
          </Link>

          {/* SECONDARY */}
          <Link to="/report-item" className="px-10 py-3 rounded-full border border-white/20 text-white text-sm font-semibold tracking-wide
          backdrop-blur-md bg-white/5 hover:border-[#FF2E7E] hover:text-[#FF2E7E] transition duration-300 flex items-center justify-center">
            I FOUND SOMETHING
          </Link>

          {/* TERTIARY */}
          <Link to="/browse" className="px-10 py-3 rounded-full border border-white/20 text-white text-sm font-semibold tracking-wide
          backdrop-blur-md bg-white/5 hover:border-[#FF2E7E] hover:text-[#FF2E7E] transition duration-300 flex items-center justify-center">
            BROWSE ALL
          </Link>

        </div>

      </div>
    </section>
  );
}