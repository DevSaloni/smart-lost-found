import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useGoogleLogin } from '@react-oauth/google';
import BASE_URL from "../config.js";

export default function AuthPage() {
    const [tab, setTab] = useState("signup");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
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

    const [showPhoneInput, setShowPhoneInput] = useState(false);
    const [tempToken, setTempToken] = useState("");

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userInfo = await userInfoRes.json();

                const response = await fetch(`${BASE_URL}/api/auth/google`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: userInfo.email,
                        name: userInfo.name,
                        googleId: userInfo.sub,
                        isAccessToken: true
                    })
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.error || "Google login failed");

                if (result.requiresPhone) {
                    setTempToken(result.token);
                    setShowPhoneInput(true);
                    toast.success("Welcome! Please provide your phone number to continue.");
                } else {
                    localStorage.setItem("token", result.token);
                    toast.success("Login successful!");
                    setTimeout(() => { window.location.href = "/"; }, 2000);
                }
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        },
        onError: () => toast.error("Google login failed. Please try again."),
    });

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePhone = (phone) => {
        return /^[0-9]{10}$/.test(phone);
    };

    const handlePhoneSubmit = async (e) => {
        e.preventDefault();
        if (!formData.phone) {
            toast.error("Phone number is required");
            return;
        }

        if (!validatePhone(formData.phone)) {
            toast.error("Please enter a valid 10-digit phone number");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/auth/update-phone`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tempToken}`
                },
                body: JSON.stringify({ phone: formData.phone })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Failed to save phone number");

            localStorage.setItem("token", tempToken);
            toast.success("Account setup complete!");
            setTimeout(() => { window.location.href = "/"; }, 2000);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation for signup
        if (tab === "signup") {
            if (!formData.name || !formData.email || !formData.phone || !formData.password) {
                toast.error("All fields are required");
                return;
            }
            if (!validateEmail(formData.email)) {
                toast.error("Please enter a valid email address");
                return;
            }
            if (!validatePhone(formData.phone)) {
                toast.error("Phone number must be exactly 10 digits");
                return;
            }
            if (formData.password.length < 6) {
                toast.error("Password must be at least 6 characters long");
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }
        } else {
            // Validation for signin
            if (!formData.email || !formData.password) {
                toast.error("Email and password are required");
                return;
            }
            if (!validateEmail(formData.email)) {
                toast.error("Please enter a valid email address");
                return;
            }
        }

        setLoading(true);

        const endpoint = tab === "signup" ? "/api/auth/signup" : "/api/auth/login";
        console.log(`DEBUG - Auth Submitting: ${tab} to ${BASE_URL}${endpoint}`);
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            console.log("DEBUG - Auth Response Status:", response.status);
            const result = await response.json();
            console.log("DEBUG - Auth Response Data:", result);

            if (!response.ok) {
                throw new Error(result.error || result.message || "An error occurred");
            }

            if (tab === "signup") {
                toast.success(result.message, { duration: 5000 });
                setFormData({ name: "", email: "", password: "", phone: "", confirmPassword: "" });
            } else {
                localStorage.setItem("token", result.token);
                toast.success("Login successful! Redirecting...");
                setTimeout(() => { window.location.href = "/"; }, 2000);
            }
        } catch (err) {
            console.error("DEBUG - Auth Error:", err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-start px-4 relative pt-30 pb-20">

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
                    {!showPhoneInput && (
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
                    )}

                    {showPhoneInput ? (
                        <div className="animate-fade-in">
                            <h2 className="text-xl font-bold text-white mb-2">One last step!</h2>
                            <p className="text-gray-400 text-xs mb-6">We need your phone number to send you alerts about your lost items.</p>

                            <form onSubmit={handlePhoneSubmit} className="space-y-4">
                                <div>
                                    <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1234567890"
                                        className="w-full mt-1.5 p-2.5 bg-black border border-white/5 rounded-lg text-white text-sm focus:border-[#FF2E7E] outline-none"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3 mt-2 bg-[#FF2E7E] text-black text-[11px] font-bold tracking-widest rounded-lg shadow-[0_4px_15px_rgba(255,46,126,0.2)] hover:bg-pink-600 transition uppercase ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    {loading ? "SAVING..." : "COMPLETE ACCOUNT"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPhoneInput(false)}
                                    className="w-full text-[10px] text-gray-500 hover:text-white transition uppercase font-bold tracking-widest mt-2"
                                >
                                    Cancel
                                </button>
                            </form>
                        </div>
                    ) : (
                        <>
                            {/* Google Button */}
                            <button
                                onClick={() => loginWithGoogle()}
                                className="w-full flex items-center justify-center gap-3 py-3 bg-white text-black text-[11px] font-bold tracking-widest rounded-lg hover:bg-gray-200 transition mb-4 uppercase"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                    />
                                </svg>
                                {tab === "signup" ? "Sign up with Google" : "Sign in with Google"}
                            </button>

                            <div className="text-center text-gray-500 text-[10px] mb-4">or</div>
                        </>
                    )}

                    {/* FORM */}
                    {!showPhoneInput && (
                        <>
                            <form onSubmit={handleSubmit} className="space-y-4">

                                <div className={tab === "signup" ? "grid md:grid-cols-2 gap-4" : "space-y-4"}>
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
                                </div>

                                <div className={tab === "signup" ? "grid md:grid-cols-2 gap-4" : "space-y-4"}>
                                    {tab === "signup" && (
                                        <div>
                                            <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+1234567890"
                                                className="w-full mt-1.5 p-2.5 bg-black border border-white/5 rounded-lg text-white text-sm focus:border-[#FF2E7E] outline-none"
                                            />
                                        </div>
                                    )}

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
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}