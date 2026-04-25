import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useSocket } from "../contexts/SocketContext";

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
    const [notifOpen, setNotifOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");
    const { unreadCount, notifications, markAsRead, clearNotifications } = useSocket();

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
                <div className="text-2xl font-extrabold tracking-widest cursor-pointer" onClick={() => navigate("/")}>
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
                                className={`text-sm tracking-widest transition duration-200 relative group ${location.pathname === link.href ? 'text-[#FF2E7E]' : 'text-gray-300 hover:text-white'}`}
                            >
                                {link.label}
                                <span className={`absolute left-0 -bottom-1 h-[2px] bg-[#FF2E7E] transition-all duration-300 ${location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* RIGHT BUTTONS */}
                <div className="hidden md:flex items-center gap-6">
                    {token && (
                        <div className="relative">
                            <button 
                                onClick={() => { setNotifOpen(!notifOpen); if(!notifOpen) markAsRead(); }}
                                className="relative group p-2 hover:bg-white/5 rounded-full transition"
                            >
                                <svg className={`w-6 h-6 transition ${unreadCount > 0 ? 'text-[#FF2E7E]' : 'text-gray-400 group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 bg-[#FF2E7E] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_10px_#FF2E7E]">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* NOTIFICATION DROPDOWN */}
                            {notifOpen && (
                                <div className="absolute right-0 mt-4 w-80 bg-white/[0.08] backdrop-blur-3xl border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF2E7E]">Notifications</h3>
                                        <button onClick={(e) => { e.stopPropagation(); clearNotifications(); }} className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest transition">Clear All</button>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                        {notifications.length === 0 ? (
                                            <div className="py-12 text-center">
                                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                                </div>
                                                <p className="text-[11px] text-gray-500 font-medium uppercase tracking-widest">No unread alerts</p>
                                            </div>
                                        ) : (
                                            notifications.map(notif => (
                                                <div 
                                                    key={notif.id} 
                                                    onClick={() => {
                                                        setNotifOpen(false);
                                                        const targetTab = notif.type === 'message' ? 'chat' : 'matches';
                                                        navigate("/dashboard", { state: { activeTab: targetTab, matchId: notif.match_id } });
                                                    }}
                                                    className={`px-6 py-5 border-b border-white/5 hover:bg-white/10 cursor-pointer transition-all duration-300 relative group ${!notif.read ? 'bg-white/[0.02]' : ''}`}
                                                >
                                                    {!notif.read && <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FF2E7E] rounded-full blur-[2px]" />}
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded ${notif.type === 'message' ? 'bg-blue-500/20 text-blue-400' : 'bg-[#FF2E7E]/20 text-[#FF2E7E]'}`}>
                                                            {notif.type === 'message' ? 'New Message' : 'Match Found'}
                                                        </span>
                                                        <span className="text-[9px] text-gray-500 font-bold">{notif.time}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-300 leading-relaxed font-medium group-hover:text-white transition-colors">{notif.message}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="p-4 bg-white/5 text-center border-t border-white/10">
                                        <button 
                                            onClick={() => { navigate("/dashboard"); setNotifOpen(false); }} 
                                            className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#FF2E7E] transition-all duration-300"
                                        >
                                            View Recovery Center
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {token ? (
                        <button
                            onClick={handleLogout}
                            className="h-8 px-4 border border-white/20 text-gray-300 text-[11px] font-bold tracking-widest uppercase hover:border-[#FF2E7E] hover:text-[#FF2E7E] transition duration-300 flex items-center rounded-lg"
                        >
                            LOGOUT
                        </button>
                    ) : (
                        <Link
                            to="/auth"
                            className="h-8 px-4 border border-white/20 text-gray-300 text-[11px] font-bold tracking-widest uppercase hover:border-[#FF2E7E] hover:text-[#FF2E7E] transition duration-300 flex items-center rounded-lg"
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