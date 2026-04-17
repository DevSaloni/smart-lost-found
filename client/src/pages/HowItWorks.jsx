import React from "react";

const steps = [
    {
        number: "01",
        title: "Report in 60 seconds",
        desc: "Fill in the item name, description, and category. Add a photo if you have one — it dramatically improves matching accuracy. Pin the location on a map and select the date. That's it. Your report is live in under a minute.",
    },
    {
        number: "02",
        title: "AI scans everything instantly",
        desc: "The moment you submit, our AI converts your description and photo into mathematical embeddings — unique fingerprints. We compare these against every found-item report in our database using cosine similarity. Every match gets a confidence score from 0–100%. You see the top matches ranked by score, not by date or keyword.",
    },
    {
        number: "03",
        title: "Connect anonymously",
        desc: "When you spot a strong match, you initiate a connection request. Both users communicate through FindIt's built-in chat. You're assigned anonymous labels — neither party ever sees the other's real name, phone number, or email unless both of you explicitly choose to share. No data ever leaks by default.",
    },
    {
        number: "04",
        title: "Verify and return safely",
        desc: "Once you've agreed to meet in person — always in a public place — FindIt generates a one-time 6-digit OTP code. The finder enters that code in the app to confirm the handoff. The case is marked as resolved. Both users are invited to rate each other, building trust scores over time.",
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="bg-black pt-17 w-full border-t border-white/5">
            <div className="max-w-6xl mx-auto px-4">

                {/* Header Section */}
                <div className="mb-20">
                    <span className="text-[#FF2E7E] font-bold tracking-[0.2em] text-[10px] uppercase">
                        THE PROCESS
                    </span>
                    <h2 className="mt-4 text-4xl md:text-7xl font-bold text-white uppercase tracking-tight leading-none">
                        HOW FINDIT WORKS
                    </h2>
                    <p className="mt-6 text-gray-400 text-lg max-w-2xl leading-relaxed">
                        Transparent, safe, and designed for real people in real situations.
                        No friction. Just results.
                    </p>
                </div>

                {/* Steps List */}
                <div className="space-y-0">
                    {steps.map((step, idx) => (
                        <div
                            key={step.number}
                            className={`group relative flex flex-col md:flex-row items-start gap-8 md:gap-20 py-16 border-t border-white/5 last:border-b transition-all duration-500`}
                        >
                            {/* Glowing Number */}
                            <div className="flex-shrink-0">
                                <span className="text-[57px] md:text-[70px] font-bold text-[#FF2E7E] leading-none tracking-tighter transition-all duration-300 ">
                                    {step.number}
                                </span>
                                {idx !== steps.length - 1 && (
                                    <div className="hidden md:block absolute left-[40px] top-[140px] w-[1px] h-[calc(100%-80px)] bg-gradient-to-b from-[#FF2E7E]/30 to-transparent"></div>
                                )}
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 mt-2 md:mt-4">
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
                                    {step.title}
                                </h3>
                                <p className="text-gray-400 text-sm md:text-[15px] leading-relaxed max-w-3xl">
                                    {step.desc}
                                </p>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
