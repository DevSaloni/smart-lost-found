import React from "react";
import { Link } from "react-router-dom";

export default function DashboardPreview() {
    return (
        <section className="py-24 px-4 bg-black relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF2D6B]/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Text Side */}
                    <div>
                        <span className="text-[#FF2D6B] font-bold tracking-[0.3em] text-xs uppercase block mb-6">
                            SMART HUB
                        </span>
                        <h2 className="text-4xl md:text-8xl font-black uppercase tracking-tight leading-[0.9] mb-8 font-['Syne']">
                            EVERYTHING <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">IN ONE PLACE.</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-10 max-w-lg font-medium leading-relaxed">
                            A powerful, unified dashboard to track your lost reports, manage matches with 99% accuracy, and communicate securely with finders.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/dashboard" className="px-10 py-5 bg-[#FF2D6B] text-white font-black text-xs uppercase tracking-[0.2em] rounded-none hover:scale-105 active:scale-95 transition-all shadow-[0_15px_30px_rgba(255,45,107,0.3)] text-center">
                                ENTER YOUR DASHBOARD
                            </Link>
                        </div>
                    </div>

                    {/* Dashboard Illustration Side (Replicating index_2 layout) */}
                    <div className="relative">
                        <div className="bg-[#0d0d0d] border border-white/5 rounded-[40px] p-6 shadow-2xl relative z-10">

                            <div className="flex gap-4">
                                {/* Small Sidebar Mock */}
                                <div className="hidden sm:flex flex-col gap-3 w-12 pt-10">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className={`w-10 h-10 rounded-xl ${i === 1 ? 'bg-[#FF2D6B]/10 border border-[#FF2D6B]/20' : 'bg-white/5 border border-white/5'}`} />
                                    ))}
                                </div>

                                {/* Main Body Mock */}
                                <div className="flex-1 space-y-6">
                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-4 pt-10">
                                        <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
                                            <div className="w-8 h-2 bg-[#FF2D6B]/50 rounded mb-2" />
                                            <div className="w-5 h-5 bg-white rounded" />
                                        </div>
                                        <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
                                            <div className="w-8 h-2 bg-blue-500/50 rounded mb-2" />
                                            <div className="w-5 h-5 bg-white rounded" />
                                        </div>
                                    </div>

                                    {/* Reports */}
                                    <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 space-y-4">
                                        {[1, 2].map((i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-[#FF2D6B]' : 'bg-[#00E5A0]'}`} />
                                                    <div className="space-y-1">
                                                        <div className="w-24 h-2 bg-white/30 rounded" />
                                                        <div className="w-16 h-1.5 bg-white/10 rounded" />
                                                    </div>
                                                </div>
                                                <div className={`w-12 h-5 rounded-full ${i === 1 ? 'bg-[#FF2D6B]/10 border border-[#FF2D6B]/20' : 'bg-[#00E5A0]/10 border border-[#00E5A0]/20'}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Abstract glow */}
                        <div className="absolute -inset-10 bg-[#FF2D6B] opacity-[0.05] blur-[100px] rounded-full pointer-events-none" />
                    </div>

                </div>
            </div>
        </section>
    );
}
