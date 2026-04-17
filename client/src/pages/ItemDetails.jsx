import React from "react";
import { useParams, Link } from "react-router-dom";

const reportsMock = [
    {
        id: "1",
        status: "ACTIVE",
        type: "found",
        title: "Blue leather wallet",
        category: "Wallet / Purse",
        location: "Shivajinagar Metro Station, Pune",
        date: "April 4, 2024",
        description: "Found a blue leather wallet near the ticket counter. It contains some cash and a few receipts. No ID was found inside. The brand is 'Hidesign'. The leather is premium blue with a slightly worn texture on the edges, making it unique.",
        identifiers: "Slight scratch on the bottom right corner, 'H' logo in silver.",
        photo: "💼",
        postedBy: "Rahul S.",
        postedTime: "2 hours ago",
        alertPref: "PUSH",
        aiConfidence: "98%"
    },
];

export default function ItemDetails() {
    const { id } = useParams();
    const item = reportsMock.find(r => r.id === id) || reportsMock[0];

    return (
        <div className="bg-black text-white min-h-screen relative overflow-hidden font-inter">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#FF2E7E] opacity-[0.03] blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#FF2E7E] opacity-[0.02] blur-[150px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 pt-12 pb-20 relative z-10">

                {/* Minimal Header */}
                <div className="flex items-center justify-between mb-16">
                    <Link to="/browse" className="group flex items-center gap-3 text-gray-500 hover:text-white transition-all">
                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#FF2E7E] group-hover:bg-[#FF2E7E]/10 transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Back to Explore</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest hidden sm:block">Share this report</span>
                        <div className="flex gap-3">
                            <button className="w-9 h-9 rounded-full border border-white/5 bg-white/[0.03] hover:border-[#FF2E7E] transition-all flex items-center justify-center text-gray-400 hover:text-[#FF2E7E]">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-12 gap-16 items-start">

                    {/* LEFT AREA: Visual & Metadata */}
                    <div className="lg:col-span-12 xl:col-span-7">
                        <div className="flex items-center gap-4 mb-8">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase ${item.type === 'found' ? 'bg-green-500/20 text-green-500 border border-green-500/20' : 'bg-orange-500/20 text-orange-500 border border-orange-500/20'
                                }`}>
                                {item.status}
                            </span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">
                                POSTED {item.postedTime}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tight leading-none mb-10 max-w-2xl font-syne">
                            {item.title}
                        </h1>

                        <div className="space-y-12">
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-bold tracking-[0.3em] text-[#FF2E7E] uppercase">The Story</h3>
                                <p className="text-[16px] text-gray-300 leading-relaxed font-normal">
                                    {item.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-10 py-12 border-y border-white/10">
                                <div className="space-y-2">
                                    <h3 className="text-[10px] font-bold tracking-[0.3em] text-gray-600 uppercase">Location</h3>
                                    <p className="text-[16px] text-gray-400 font-semibold">{item.location}</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-[10px] font-bold tracking-[0.3em] text-gray-600 uppercase">Category</h3>
                                    <p className="text-[16px] text-gray-400 font-semibold">{item.category}</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-[10px] font-bold tracking-[0.3em] text-gray-600 uppercase">Unique ID</h3>
                                    <p className="text-[16px] text-gray-400 font-semibold ">{item.identifiers.split(',')[0]}</p>
                                </div>
                            </div>

                            <div className="pt-2">
                                <h3 className="text-[10px] font-bold tracking-[0.3em] text-[#FF2E7E] uppercase mb-4">Detailed Identifiers</h3>
                                <p className="text-[16px] text-gray-400">
                                    "{item.identifiers}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT AREA: Visual & Action */}
                    <div className="lg:col-span-12 xl:col-span-5 lg:sticky lg:top-24">
                        <div className="relative group mb-10">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-[#FF2E7E] to-transparent opacity-20 blur-2xl rounded-[48px] group-hover:opacity-40 transition-opacity duration-1000" />

                            <div className="relative aspect-square rounded-[40px] bg-[#0c0c0c] border border-white/10 flex items-center justify-center overflow-hidden">
                                <span className="text-[180px] drop-shadow-[0_0_50px_rgba(255,46,126,0.4)] transform group-hover:scale-105 transition-transform duration-1000">
                                    {item.photo}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-8 py-5 rounded-2xl bg-white/[0.03] border border-white/10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">AI Match Confidence</span>
                                    <span className="text-white font-black text-xl tracking-tighter">{item.aiConfidence}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Communication</span>
                                    <span className="text-green-500 font-black text-xs uppercase tracking-widest">{item.alertPref} ALERTS</span>
                                </div>
                            </div>

                            <button className="w-full py-6 bg-[#FF2E7E] text-black font-extrabold uppercase tracking-[0.2em] text-xs rounded-2xl shadow-[0_20px_50px_rgba(255,46,126,0.25)] hover:bg-pink-600 hover:-translate-y-1 transition-all duration-300">
                                {item.type === 'found' ? 'THIS IS MINE — CLAIM NOW' : 'I FOUND THIS — CONTACT OWNER'}
                            </button>

                            <p className="text-center text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                Reported by <span className="text-white">{item.postedBy}</span>
                            </p>
                        </div>
                    </div>

                </div>

                {/* Secure Process Section */}
                <div className="mt-40 pt-20 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-16">
                        <span className="text-[10px] font-bold tracking-[0.3em] text-[#FF2E7E] uppercase">Verification Roadmap</span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-20">
                        <div className="space-y-6">
                            <div className="text-5xl font-syne font-black text-white/5">01</div>
                            <h4 className="text-sm font-bold uppercase tracking-widest italic text-[#FF2E7E]">Digital Match</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">Our AI cross-references metadata, geo-coordinates, and visual descriptors to confirm potential ownership.</p>
                        </div>
                        <div className="space-y-6">
                            <div className="text-5xl font-syne font-black text-white/5">02</div>
                            <h4 className="text-sm font-bold uppercase tracking-widest italic text-[#FF2E7E]">Safe Relay</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">A secure communication bridge is established. Personal details remain hidden until the final verification.</p>
                        </div>
                        <div className="space-y-6">
                            <div className="text-5xl font-syne font-black text-white/5">03</div>
                            <h4 className="text-sm font-bold uppercase tracking-widest italic text-[#FF2E7E]">OTP Receipt</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">A unique verification code secures the physical exchange, ensuring the item reaches the rightful owner.</p>
                        </div>
                    </div>
                </div>

            </div>

            <div className="h-40" />
        </div>
    );
}
