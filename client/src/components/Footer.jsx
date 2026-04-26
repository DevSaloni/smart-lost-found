import React from "react";
import { Link } from "react-router-dom";

const links = ["Privacy", "Terms", "Support"];

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-10 w-full">

      <div className="max-w-6xl mx-auto px-4 flex flex-col gap-8">

        {/* Top */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Logo + Tagline */}
          <div className="text-center md:text-left">
            <div className="logo-text text-2xl justify-center md:justify-start select-none">
                <span className="find">FIND</span>
                <span className="it">IT.</span>
            </div>
            <p className="text-gray-400 text-xs mt-3 max-w-xs leading-relaxed mx-auto md:mx-0">
              The intelligent recovery network. Helping people reconnect with what matters.
            </p>
          </div>

          {/* Minimal Links */}
          <div className="flex gap-6">
            {links.map((link) => (
              <Link
                key={link}
                to={`/${link.toLowerCase()}`}
                className="text-gray-400 text-sm hover:text-white transition duration-300"
              >
                {link}
              </Link>
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