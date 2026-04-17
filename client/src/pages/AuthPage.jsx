import React, { useState } from "react";

export default function AuthPage() {
    const [tab, setTab] = useState("signup"); // Default to signup as shown in image

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-start px-4 relative pt-17 pb-17">

            {/* Background Glow */}
            <div className="absolute w-[400px] h-[600px] bg-[#FF2E7E] opacity-10 blur-[140px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            <div className="relative w-full max-w-6xl grid md:grid-cols-2 gap-10 items-start">

                {/* LEFT SIDE */}
                <div className="text-white hidden md:block mt-1">
                    <p className="text-[#FF2E7E] tracking-widest text-[10px] font-semibold ">
                        WELCOME BACK
                    </p>

                    <h1 className="text-5xl font-bold mt-2 leading-tight">
                        SIGN IN TO FINDIT.
                    </h1>

                    <p className="text-gray-400 mt-4 text-[16px] max-w-sm">
                        Track your reports, see your matches, and chat with finders — all in one place.
                    </p>

                    <ul className="mt-8 space-y-4 text-[13px]  text-gray-300">
                        {[
                            "AI-powered match results",
                            "Real-time notifications",
                            "Anonymous secure chat",
                            "OTP-verified handoffs",
                            "Community trust score",
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-[#FF2E7E] rounded-full shadow-[0_0_8px_#FF2E7E]" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* RIGHT SIDE CARD */}
                <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-7 shadow-2xl">

                    {/* Tabs */}
                    <div className="flex border-b border-white/10 mb-6 font-bold">
                        <button
                            onClick={() => setTab("signin")}
                            className={`flex-1 py-3 text-[10px] tracking-[0.2em] transition ${tab === "signin"
                                ? "text-[#FF2E7E] border-b-2 border-[#FF2E7E]"
                                : "text-gray-500"
                                }`}
                        >
                            SIGN IN
                        </button>
                        <button
                            onClick={() => setTab("signup")}
                            className={`flex-1 py-3 text-[10px] tracking-[0.2em] transition ${tab === "signup"
                                ? "text-[#FF2E7E] border-b-2 border-[#FF2E7E]"
                                : "text-gray-500"
                                }`}
                        >
                            CREATE ACCOUNT
                        </button>
                    </div>

                    {/* Google Button */}
                    <button className="w-full flex items-center justify-center gap-3 py-2.5 border border-white/10 bg-white/5 text-white rounded-lg mb-4 hover:border-[#FF2E7E] transition text-sm">
                        <svg width="18" height="18" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.34 30.28 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.1 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.4c-.54 2.9-2.18 5.37-4.64 7.04l7.19 5.59C43.98 37.2 46.1 31.35 46.1 24.5z" />
                            <path fill="#FBBC05" d="M10.54 28.09c-1.01-2.98-1.01-6.2 0-9.18l-7.98-6.19C.96 16.1 0 19.95 0 24s.96 7.9 2.56 11.28l7.98-7.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.81l-7.19-5.59c-2.01 1.36-4.6 2.17-8.71 2.17-6.26 0-11.57-4.22-13.46-9.91l-7.98 7.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="text-center text-gray-500 text-[10px] mb-4">or</div>

                    {/* FORM */}
                    <div className="space-y-4">

                        {tab === "signup" && (
                            <div>
                                <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold">FULL NAME</label>
                                <input
                                    type="text"
                                    placeholder="Your full name"
                                    className="w-full mt-1.5 p-2.5  border border-white/5 rounded-lg text-white text-sm focus:border-[#FF2E7E] outline-none"
                                />
                            </div>
                        )}

                        <div>
                            <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold">EMAIL</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full mt-1.5 p-2.5 border border-white/5 rounded-lg text-white text-sm focus:border-[#FF2E7E] outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold">PASSWORD</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full mt-1.5 p-2.5 border border-white/5 rounded-lg text-white text-sm focus:border-[#FF2E7E] outline-none"
                            />
                        </div>

                        {tab === "signup" && (
                            <div>
                                <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold">CONFIRM PASSWORD</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full mt-1.5 p-2.5 border border-white/5 rounded-lg text-white text-sm focus:border-[#FF2E7E] outline-none"
                                />
                            </div>
                        )}

                        <button className="w-full py-3 mt-2 bg-[#FF2E7E] text-black text-xs font-bold tracking-widest rounded-lg shadow-[0_4px_15px_rgba(255,46,126,0.2)] hover:bg-pink-600 transition">
                            {tab === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
                        </button>
                    </div>

                    <div className="text-center mt-5">
                        {tab === "signup" ? (
                            <p className="text-xs text-gray-400">
                                Already have an account?{" "}
                                <button onClick={() => setTab("signin")} className="text-[#FF2E7E] font-semibold hover:underline">
                                    Sign in
                                </button>
                            </p>
                        ) : (
                            <p className="text-xs text-gray-400">
                                Don't have an account?{" "}
                                <button onClick={() => setTab("signup")} className="text-[#FF2E7E] font-semibold hover:underline">
                                    Sign up free
                                </button>
                            </p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}