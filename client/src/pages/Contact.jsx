import React, { useState } from "react";
import { toast } from "react-hot-toast";
import BASE_URL from "../config.js";

const socialLinks = [
    {
        icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" />
            </svg>
        ),
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
        ),
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H2.771C1.242 0 0 1.242 0 2.771v18.454C0 22.758 1.242 24 2.771 24h19.454C23.758 24 25 22.758 25 21.225V2.771C25 1.242 23.758 0 22.225 0z" />
            </svg>
        ),
    },
];

const topics = [
    "General question",
    "Help with a match",
    "Safety concern",
    "Bug report",
    "Feedback",
    "Partnership",
];

export default function Contact() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(topics[0]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !message) {
            toast.error("Please fill in all fields.");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/api/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    topic: selectedTopic,
                    message,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "Message sent successfully!");
                setName("");
                setEmail("");
                setMessage("");
                setSelectedTopic(topics[0]);
            } else {
                toast.error(data.error || "Failed to send message.");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-black text-white min-h-screen flex flex-col items-center justify-start px-4 relative pt-17 pb-17 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF2E7E] opacity-[0.05] blur-[120px] rounded-full" />

            <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-16 lg:gap-24 relative z-10 pt-3">

                {/* LEFT SIDE: Info */}
                <div className="flex flex-col justify-start">
                    <span className="text-[#FF2E7E] font-bold tracking-[0.2em] text-[10px] uppercase block mb-6">
                        CONNECT WITH US
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight leading-none mb-8">
                        TALK TO THE <br /> FINDIT TEAM
                    </h1>
                    <p className="text-gray-400 text-[16px] leading-relaxed mb-12 max-w-md">
                        Whether it's a question, a bug, a safety concern, or genuine feedback — we're listening.
                        We're a small team that genuinely cares about this product and its community.
                    </p>

                    {/* Horizontal Social Icons */}
                    <div className="flex gap-4">
                        {socialLinks.map((link, idx) => (
                            <div key={idx} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/5 text-[#FF2E7E] hover:bg-[#FF2E7E] hover:text-black hover:scale-110 transition-all duration-300 cursor-pointer">
                                {link.icon}
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT SIDE: Form */}
                <div className="bg-[#0c0c0c] border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl relative">
                    {/* Glow inside card */}
                    <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#FF2E7E] opacity-[0.03] blur-[80px] pointer-events-none" />

                    <span className="text-[#FF2E7E] font-bold tracking-[0.2em] text-[10px] uppercase block mb-10">
                        SEND A MESSAGE
                    </span>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase block mb-2">Name</label>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-4 text-white text-sm outline-none focus:border-[#FF2E7E] focus:bg-white/[0.05] transition"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase block mb-2">Email</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-4 text-white text-sm outline-none focus:border-[#FF2E7E] focus:bg-white/[0.05] transition"
                                />
                            </div>
                        </div>

                        {/* CUSTOM DROPDOWN */}
                        <div className="relative">
                            <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase block mb-2">Topic</label>

                            <div
                                onClick={() => setIsOpen(!isOpen)}
                                className={`w-full bg-white/[0.03] border ${isOpen ? 'border-[#FF2E7E]' : 'border-white/5'} rounded-xl px-5 py-4 text-white text-sm cursor-pointer flex items-center justify-between group transition-all duration-300`}
                            >
                                <span className={selectedTopic ? 'text-white' : 'text-gray-500'}>{selectedTopic}</span>
                                <svg
                                    className={`w-4 h-4 text-[#FF2E7E] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {isOpen && (
                                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#111] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                                    {topics.map((topic) => (
                                        <div
                                            key={topic}
                                            onClick={() => {
                                                setSelectedTopic(topic);
                                                setIsOpen(false);
                                            }}
                                            className="px-5 py-3.5 text-sm text-gray-400 hover:text-white hover:bg-[#FF2E7E]/10 cursor-pointer transition-colors"
                                        >
                                            {topic}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase block mb-2">Message</label>
                            <textarea
                                rows="5"
                                placeholder="Write your message here..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-4 text-white text-sm outline-none focus:border-[#FF2E7E] focus:bg-white/[0.05] transition resize-none"
                            />
                        </div>

                        <button disabled={loading} type="submit" className={`w-full py-5 bg-[#FF2E7E] text-black font-extrabold uppercase tracking-widest text-xs rounded-xl shadow-[0_10px_30px_rgba(255,46,126,0.2)] hover:bg-pink-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {loading ? "SENDING..." : "SEND MESSAGE"}
                            {!loading && (
                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            )}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
