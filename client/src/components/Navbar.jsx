import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const navLinks = [
    { label: "HOME", href: "/" },
    { label: "DASHBOARD", href: "/dashboard" },
    { label: "BROWSE", href: "/browse" },
    { label: "HOW IT WORKS", href: "/how-it-work" },
    { label: "ABOUT", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "CONTACT", href: "/contact" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        setOpen(false);
        toast.success("Logged out successfully");
        navigate("/auth");
    };

    return (
        <nav className="text-white absolute top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
                {/* Logo */}
                <div className="text-2xl font-extrabold tracking-widest">
                    <span className="text-[#FF2E7E]">FIND</span>
                    <span className="text-white">IT</span>
                </div>

                {/* CENTER GLASS NAV */}
                <div className="hidden md:flex flex-1 justify-center">
                    <div className="flex items-center gap-6 px-6 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                        {navLinks.filter(link => link.label !== "DASHBOARD" || token).map((link) => (
                            <Link
                                key={link.label}
                                to={link.href}
                                className="text-gray-200 hover:text-white text-sm tracking-widest transition duration-200 relative group"
                            >
                                {link.label}
                                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#FF2E7E] transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* RIGHT BUTTONS */}
                <div className="hidden md:flex items-center gap-3">
                    {token ? (
                        <button
                            onClick={handleLogout}
                            className="h-8 px-3 border border-white/20 text-gray-300 text-xs tracking-widest uppercase hover:border-[#FF2E7E] hover:text-white transition duration-300 flex items-center"
                        >
                            LOGOUT
                        </button>
                    ) : (
                        <Link
                            to="/auth"
                            className="h-8 px-3 border border-white/20 text-gray-300 text-xs tracking-widest uppercase hover:border-[#FF2E7E] hover:text-white transition duration-300 flex items-center"
                        >
                            SIGN IN
                        </Link>
                    )}

                    <Link
                        to="/report-item"
                        className="h-8 px-3 bg-[#FF2E7E] text-black text-xs font-bold tracking-widest uppercase hover:bg-pink-600 transition duration-300 flex items-center gap-2"
                    >
                        REPORT ITEM
                    </Link>
                </div>

                {/* MOBILE BUTTON */}
                <div className="md:hidden">
                    <button onClick={() => setOpen(!open)}>
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor">
                            {open ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            {open && (
                <div className="md:hidden px-4 pb-4 space-y-2 bg-black/95 backdrop-blur-xl border-t border-white/10">
                    {navLinks.filter(link => link.label !== "DASHBOARD" || token).map((link) => (
                        <Link
                            key={link.label}
                            to={link.href}
                            className="block text-gray-200 hover:text-white py-2 tracking-widest"
                            onClick={() => setOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {token ? (
                        <button
                            onClick={handleLogout}
                            className="w-full mt-2 h-8 border border-white/20 text-gray-300 text-xs uppercase"
                        >
                            LOGOUT
                        </button>
                    ) : (
                        <Link
                            to="/auth"
                            className="w-full mt-2 h-8 border border-white/20 text-gray-300 text-xs uppercase flex items-center justify-center"
                            onClick={() => setOpen(false)}
                        >
                            SIGN IN
                        </Link>
                    )}

                    <Link
                        to="/report-item"
                        className="block w-full mt-2 h-8 bg-[#FF2E7E] text-black text-xs font-bold uppercase flex items-center justify-center"
                        onClick={() => setOpen(false)}
                    >
                        REPORT ITEM
                    </Link>
                </div>
            )}
        </nav>
    );
}