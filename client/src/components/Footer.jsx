import React from "react";

const links = ["Privacy", "Terms", "Support"];

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-10 w-full">

      <div className="max-w-6xl mx-auto px-4 flex flex-col gap-8">

        {/* Top */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Logo + Tagline */}
          <div className="text-center md:text-left">
            <div className="text-2xl font-bold tracking-widest">
              <span className="text-[#FF2E7E]">FIND</span>
              <span className="text-white">IT</span>
            </div>
            <p className="text-gray-400 text-sm mt-2 max-w-sm">
              Helping people reconnect with what they’ve lost — safely, quickly, and intelligently.
            </p>
          </div>

          {/* Minimal Links */}
          <div className="flex gap-6">
            {links.map((link) => (
              <a
                key={link}
                href="#"
                className="text-gray-400 text-sm hover:text-white transition duration-300"
              >
                {link}
              </a>
            ))}
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-white/10"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">

          <span>© 2026 FindIt. All rights reserved.</span>

          <span className="text-gray-400">
            Built with precision.
          </span>

        </div>

      </div>
    </footer>
  );
}