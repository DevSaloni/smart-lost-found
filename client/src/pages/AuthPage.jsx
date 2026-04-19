import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { GoogleLogin } from '@react-oauth/google';
import BASE_URL from "../config.js";

export default function AuthPage() {
    const [tab, setTab] = useState("signup");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("verified") === "true") {
            toast.success("Email verified successfully! You can now sign in.");
            setTab("signin");
        } else if (params.get("verified") === "false") {
            toast.error("Email verification failed or token expired.");
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: credentialResponse.credential })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Google login failed");

            localStorage.setItem("token", result.token);
            toast.success("Login successful with Google!");
            setTimeout(() => { window.location.href = "/"; }, 2000);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        toast.error("Google login failed. Please try again.");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validation for signup
        if (tab === "signup") {
            if (!formData.name || !formData.email || !formData.password) {
                toast.error("All fields are required");
                setLoading(false);
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                toast.error("Passwords do not match");
                setLoading(false);
                return;
            }
        } else {
            // Validation for signin
            if (!formData.email || !formData.password) {
                toast.error("Email and password are required");
                setLoading(false);
                return;
            }
        }

        try {
            const endpoint = tab === "signup" ? "/api/auth/signup" : "/api/auth/login";
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || result.message || "An error occurred");
            }

            if (tab === "signup") {
                toast.success(result.message, { duration: 5000 });
                setFormData({ name: "", email: "", password: "", confirmPassword: "" });
            } else {
                localStorage.setItem("token", result.token);
                toast.success("Login successful! Redirecting...");
                setTimeout(() => { window.location.href = "/"; }, 2000);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

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
                        {tab === "signup" ? "JOIN FINDIT." : "SIGN IN TO FINDIT."}
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
                            onClick={() => { setTab("signin"); }}
                            className={`flex-1 py-3 text-[10px] tracking-[0.2em] transition ${tab === "signin"
                                ? "text-[#FF2E7E] border-b-2 border-[#FF2E7E]"
                                : "text-gray-500"
                                }`}
                        >
                            SIGN IN
                        </button>
                        <button
                            onClick={() => { setTab("signup"); }}
                            className={`flex-1 py-3 text-[10px] tracking-[0.2em] transition ${tab === "signup"
                                ? "text-[#FF2E7E] border-b-2 border-[#FF2E7E]"
                                : "text-gray-500"
                                }`}
                        >
                            CREATE ACCOUNT
                        </button>
                    </div>

                    {/* Google Button */}
                    <div className="flex justify-center mb-4 overflow-hidden rounded-lg">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            theme="filled_black"
                            width="100%"
                            text="continue_with"
                        />
                    </div>

                    <div className="text-center text-gray-500 text-[10px] mb-4">or</div>

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {tab === "signup" && (
                            <div>
                                <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                    className="w-full mt-1.5 p-2.5 bg-black border border-white/5 rounded-lg text-white text-sm focus:border-[#FF2E7E] outline-none"
                                />
                            </div>
                        )}

                        <div>
                            <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full mt-1.5 p-2.5 bg-black border border-white/5 rounded-lg text-white text-sm focus:border-[#FF2E7E] outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full mt-1.5 p-2.5 bg-black border border-white/5 rounded-lg text-white text-sm focus:border-[#FF2E7E] outline-none"
                            />
                        </div>

                        {tab === "signup" && (
                            <div>
                                <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full mt-1.5 p-2.5 bg-black border border-white/5 rounded-lg text-white text-sm focus:border-[#FF2E7E] outline-none"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 mt-2 bg-[#FF2E7E] text-black text-[11px] font-bold tracking-widest rounded-lg shadow-[0_4px_15px_rgba(255,46,126,0.2)] hover:bg-pink-600 transition uppercase ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {loading ? "PROCESSING..." : (tab === "signin" ? "SIGN IN" : "CREATE ACCOUNT")}
                        </button>
                    </form>

                    <div className="text-center mt-5">
                        {tab === "signup" ? (
                            <p className="text-[11px] text-gray-400">
                                Already have an account?{" "}
                                <button onClick={() => { setTab("signin"); }} className="text-[#FF2E7E] font-bold uppercase hover:underline">
                                    Sign in
                                </button>
                            </p>
                        ) : (
                            <p className="text-[11px] text-gray-400">
                                Don't have an account?{" "}
                                <button onClick={() => { setTab("signup"); }} className="text-[#FF2E7E] font-bold uppercase hover:underline">
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