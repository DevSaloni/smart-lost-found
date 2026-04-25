import React from "react";
import { Link } from "react-router-dom";
import ctaBg from "../assets/cta-bg.png";

export default function CTASection() {
  return (
    <section className="relative py-24 md:py-32 w-full text-center overflow-hidden bg-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={ctaBg} 
          className="w-full h-full object-cover opacity-50" 
          alt="Discovery background" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <span className="text-[#FF2E7E] font-mono tracking-[0.3em] text-[10px] uppercase block mb-6">— START NOW —</span>

        <h2 className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight max-w-5xl mx-auto uppercase">
          <span className="block">SOMEONE OUT THERE</span>
          <span className="block">FOUND YOUR THING.</span>
        </h2>
        
        <p className="mt-6 text-gray-300 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
          Our AI is scanning reports right now. Join the community and get your items back safely.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center">
          <Link to="/report-item" state={{ reportType: "lost" }} className="px-10 py-4 rounded-none bg-[#FF2E7E] text-white font-black text-xs tracking-[0.2em] shadow-[0_10px_30px_rgba(255,46,126,0.3)] hover:bg-pink-600 transition-all duration-300 hover:scale-105 flex items-center justify-center">
            REPORT LOST ITEM
          </Link>

          <Link to="/browse" className="px-10 py-4 rounded-none bg-white/5 backdrop-blur-md border border-white/20 text-white font-black text-xs tracking-[0.2em] hover:bg-white/10 transition-all duration-300 hover:border-[#FF2E7E] flex items-center justify-center">
            BROWSE FOUND ITEMS
          </Link>
        </div>
      </div>
    </section>
  );
}