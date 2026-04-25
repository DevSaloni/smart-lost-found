import React from "react";

const values = [
    {
        number: "01",
        title: "Safety first, always",
        desc: "Anonymity isn't a feature. It's the foundation. We designed the entire system so that two strangers can connect and trust each other without either person ever being at risk.",
    },
    {
        number: "02",
        title: "AI that actually helps",
        desc: "We use real AI — not keyword search. Embeddings and cosine similarity mean the system understands that 'azure bifold' and 'blue wallet' are the same thing.",
    },
    {
        number: "03",
        title: "Community-powered",
        desc: "Every person who returns an item makes the community stronger. Trust scores, ratings, and verified handoffs build a network of honest people.",
    },
];

export default function About() {
    return (
        <div className="bg-black text-white min-h-screen">
            {/* Hero Section */}
            <section className="pt-30 pb-17 px-4 relative overflow-hidden">
                {/* Background Watermark Text "FIND IT" */}
                <div className="absolute right-[-100px] top-[10%] select-none pointer-events-none opacity-[0.03]">
                    <h2 className="text-[200px] md:text-[350px] font-extrabold text-white leading-none tracking-tighter"
                        style={{ WebkitTextStroke: '2px white', color: 'transparent' }}>
                        FIND IT
                    </h2>
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <span className="text-[#FF2E7E] font-bold tracking-[0.2em] text-[10px] uppercase block mb-6">
                        OUR STORY
                    </span>

                    <h2 className="mt-4 text-4xl md:text-7xl font-bold text-white uppercase tracking-tight leading-none">
                        WE BELIEVE LOST THINGS <br />
                        DESERVE TO COME HOME.
                    </h2>

                    <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-3xl mt-16">
                        FindIt was built because losing something important is one of the most helpless feelings in the world.
                        And the current solution — posting on WhatsApp groups, hoping someone saw your Facebook post — isn't good enough.
                        We combined AI matching with safe, anonymous connection to create something that actually works.
                    </p>
                </div>
            </section>

            {/* Why We Built This Section (Matching Image) */}
            <section className="py-24 px-4 relative">
                {/* Subtle horizontal line like in image */}
                <div className="max-w-6xl mx-auto flex items-center gap-4 mb-16">
                    <span className="text-[#FF2E7E] font-bold tracking-[0.2em] text-[10px] uppercase whitespace-nowrap">
                        WHY WE BUILT THIS
                    </span>
                    <div className="h-[1px] w-full bg-white/5" />
                </div>

                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
                    {values.map((value) => (
                        <div
                            key={value.number}
                            className="group bg-[#0c0c0c] border border-white/10 p-10 rounded-2xl hover:border-[#FF2E7E]/30 transition-all duration-500 relative overflow-hidden flex flex-col min-h-[400px]"
                        >
                            {/* Number from image */}
                            <span className="text-7xl font-bold text-[#FF2E7E]/10 block mb-8 group-hover:text-[#FF2E7E]/20 transition-colors tracking-tighter">
                                {value.number}
                            </span>

                            <h3 className="text-2xl font-bold mb-6 tracking-tight text-white/90">
                                {value.title}
                            </h3>

                            <p className="text-gray-400 text-[15px] leading-relaxed group-hover:text-gray-300 transition-colors">
                                {value.desc}
                            </p>

                            {/* Subtle bottom accent */}
                            <div className="mt-auto pt-8">
                                <div className="h-[2px] w-0 bg-[#FF2E7E] group-hover:w-full transition-all duration-700" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer-like spacing */}
            <div className="h-20" />
        </div>
    );
}
