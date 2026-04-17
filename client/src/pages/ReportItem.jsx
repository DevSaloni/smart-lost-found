import React, { useState } from "react";

const categories = [
    "Wallet / Purse",
    "Electronics",
    "Documents / IDs",
    "Keys",
    "Bags / Luggage",
    "Pets",
    "Other",
];

const tips = [
    { num: "01", text: "Upload a photo — this is the single biggest boost to AI match accuracy" },
    { num: "02", text: "Describe what's inside bags or wallets — finders describe contents" },
    { num: "03", text: "Include any unique marks — scratches, stickers, engravings" },
    { num: "04", text: "Be as specific as possible about the location — neighbourhood or landmark" },
    { num: "05", text: "Enable push notifications so you're alerted the moment a match is found" },
];

export default function ReportItem() {
    const [reportType, setReportType] = useState("found"); // lost or found
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [alertMethod, setAlertMethod] = useState("push");

    return (
        <div className="bg-black text-white min-h-screen pt-17 pb-17 px-4">
            <div className="max-w-6xl mx-auto pt-4">

                {/* Header Section */}
                <div className="mb-10">
                    <span className="text-[#FF2E7E] font-bold tracking-[0.2em] text-[10px] uppercase block mb-4">
                        FILE A REPORT
                    </span>
                    <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-tight leading-none mb-8">
                        WHAT HAPPENED?
                    </h1>

                    {/* Report Type Tabs */}
                    <div className="inline-flex bg-white/5 p-1 rounded-xl border border-white/10">
                        <button
                            onClick={() => setReportType("lost")}
                            className={`px-8 py-2.5 rounded-lg text-xs font-bold tracking-widest transition-all ${reportType === "lost" ? 'bg-[#FF2E7E] text-black shadow-lg shadow-[#FF2E7E]/20' : 'text-gray-400 hover:text-white'}`}
                        >
                            LOST SOMETHING
                        </button>
                        <button
                            onClick={() => setReportType("found")}
                            className={`px-8 py-2.5 rounded-lg text-xs font-bold tracking-widest transition-all ${reportType === "found" ? 'bg-[#FF2E7E] text-black shadow-lg shadow-[#FF2E7E]/20' : 'text-gray-400 hover:text-white'}`}
                        >
                            FOUND SOMETHING
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">

                    {/* LEFT SIDE: Form */}
                    <div className="lg:col-span-7 space-y-8">

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Item Name */}
                            <div>
                                <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase block mb-2.5">ITEM NAME *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Blue leather wallet"
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm outline-none focus:border-[#FF2E7E] focus:bg-white/[0.05] transition"
                                />
                            </div>

                            {/* Category Dropdown */}
                            <div className="relative">
                                <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase block mb-2.5">CATEGORY *</label>
                                <div
                                    onClick={() => setCategoryOpen(!categoryOpen)}
                                    className={`w-full bg-white/[0.03] border ${categoryOpen ? 'border-[#FF2E7E]' : 'border-white/5'} rounded-xl px-5 py-3.5 text-white text-sm cursor-pointer flex items-center justify-between transition-all`}
                                >
                                    <span>{selectedCategory}</span>
                                    <svg className={`w-4 h-4 text-[#FF2E7E] transition-transform ${categoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                                {categoryOpen && (
                                    <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#111] border border-white/10 rounded-xl overflow-hidden z-20 shadow-2xl">
                                        {categories.map((cat) => (
                                            <div
                                                key={cat}
                                                onClick={() => { setSelectedCategory(cat); setCategoryOpen(false); }}
                                                className="px-5 py-3 text-sm text-gray-400 hover:text-white hover:bg-[#FF2E7E]/10 cursor-pointer transition-colors"
                                            >
                                                {cat}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Location */}
                            <div>
                                <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase block mb-2.5">LOCATION *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Shivajinagar Metro, Pune"
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm outline-none focus:border-[#FF2E7E] transition"
                                />
                            </div>

                            {/* Date */}
                            <div>
                                <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase block mb-2.5">DATE *</label>
                                <input
                                    type="date"
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm outline-none focus:border-[#FF2E7E] transition appearance-none"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase block mb-2.5">DESCRIPTION *</label>
                            <textarea
                                rows="3"
                                placeholder="Describe color, size, brand, unique marks, what's inside (for bags/wallets)..."
                                className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm outline-none focus:border-[#FF2E7E] transition resize-none"
                            />
                        </div>

                        {/* Unique Identifiers */}
                        <div>
                            <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase block mb-2.5">UNIQUE IDENTIFIERS</label>
                            <input
                                type="text"
                                placeholder="Serial number, engraving, stickers, damage..."
                                className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-3.5 text-white text-sm outline-none focus:border-[#FF2E7E] transition"
                            />
                        </div>

                        {/* Photo Upload area */}
                        <div>
                            <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase block mb-2.5">PHOTO</label>
                            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center bg-white/[0.01] hover:border-[#FF2E7E]/50 hover:bg-white/[0.03] transition-all cursor-pointer group">
                                <svg className="w-10 h-10 text-gray-500 group-hover:text-[#FF2E7E] mb-3 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className="text-sm text-gray-400">
                                    Drag & drop or <span className="text-[#FF2E7E] font-bold">click to upload</span>
                                </p>
                                <p className="text-[10px] text-gray-600 mt-2 uppercase tracking-widest font-bold">JPG, PNG, WEBP — MAX 10MB</p>
                            </div>
                        </div>

                        {/* Alert Selection */}
                        <div>
                            <label className="text-[10px] text-[#FF2E7E] tracking-widest font-bold uppercase block mb-2.5">ALERT ME VIA</label>
                            <div className="grid grid-cols-3 gap-4">
                                {["PUSH", "EMAIL", "SMS"].map((method) => (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() => setAlertMethod(method.toLowerCase())}
                                        className={`py-3.5 rounded-xl border font-bold text-[10px] tracking-[0.2em] transition-all ${alertMethod === method.toLowerCase() ? 'bg-[#FF2E7E]/10 border-[#FF2E7E] text-[#FF2E7E]' : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/20'}`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button className="w-full py-5 bg-[#FF2E7E] text-black font-extrabold uppercase tracking-[0.2em] text-xs rounded-xl shadow-[0_10px_40px_rgba(255,46,126,0.3)] hover:bg-pink-600 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-3">
                            SUBMIT REPORT & FIND MATCHES
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>

                    </div>

                    {/* RIGHT SIDE: Info Boxes */}
                    <div className="lg:col-span-5 space-y-8">

                        {/* Tips Card */}
                        <div className="bg-[#080808] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="px-8 py-5 border-b border-white/10 bg-white/[0.02] flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-[#FF2E7E] rounded-full shadow-[0_0_8px_#FF2E7E]" />
                                <span className="text-[10px] font-bold tracking-[0.2em] text-[#FF2E7E] uppercase">TIPS FOR BETTER MATCHES</span>
                            </div>
                            <div className="p-8 space-y-6">
                                {tips.map((tip) => (
                                    <div key={tip.num} className="flex gap-6">
                                        <span className="text-xs font-bold text-[#FF2E7E] opacity-50">{tip.num}</span>
                                        <p className="text-sm text-gray-400 leading-relaxed">{tip.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* What Happens Next Card */}
                        <div className="bg-[#080808] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="px-8 py-5 border-b border-white/10 bg-white/[0.02] flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_green]" />
                                <span className="text-[10px] font-bold tracking-[0.2em] text-green-500 uppercase">WHAT HAPPENS NEXT</span>
                            </div>
                            <div className="p-8 space-y-6">
                                {[
                                    "Your report is stored and the AI scans all existing reports immediately",
                                    "You see your top matches ranked by confidence score",
                                    "You get alerted whenever new matches appear — even days later"
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-4">
                                        <span className="text-green-500 text-xs">→</span>
                                        <p className="text-sm text-gray-400 leading-relaxed">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            <div className="h-20" />
        </div>
    );
}
