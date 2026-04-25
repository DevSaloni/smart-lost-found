import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import BASE_URL from "../config.js";
import toast from "react-hot-toast";

export default function MatchDetails() {
    const { matchId } = useParams();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMatch = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`${BASE_URL}/api/matches/${matchId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setMatch(data.match);
                else toast.error(data.error);
            } catch (err) {
                toast.error("Failed to load match details");
            } finally {
                setLoading(false);
            }
        };
        fetchMatch();
    }, [matchId]);

    const handleStartChat = () => {
        navigate("/dashboard", { state: { activeTab: "chat", matchId: match.match_id } });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-[#FF2E7E] font-bold uppercase tracking-widest animate-pulse">
                Verifying Comparison...
            </div>
        );
    }

    if (!match) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-bold">Match not found.</div>;

    return (
        <div className="bg-black text-white min-h-screen pt-30 pb-20 px-4 font-['Inter'] relative overflow-hidden">
            {/* Background Aesthetic */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[#FF2E7E]/10 to-transparent blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 mb-10 text-gray-500 hover:text-[#FF2E7E] transition-all uppercase text-[10px] font-bold tracking-[3px] group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Dashboard
                </button>

                <div className="flex flex-col lg:flex-row items-end justify-between gap-10 mb-16">
                    <div className="max-w-2xl">
                        <div className="inline-block px-4 py-1 bg-[#FF2E7E]/10 border border-[#FF2E7E]/20 rounded-full text-[10px] font-black text-[#FF2E7E] uppercase tracking-widest mb-6">
                            Verified Match Found
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight mb-6">
                            Match <span className="text-[#FF2E7E]">Comparison</span>
                        </h1>
                        <p className="text-gray-400 text-lg font-medium leading-relaxed">
                            Our system has identified a high-probability match between the following reports. Please review the details carefully to confirm if this is your item.
                        </p>
                    </div>

                    <div className="flex items-center gap-8 p-8 bg-[#111] border border-[#232323] rounded-[32px] shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#FF2E7E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="text-right relative z-10">
                            <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Similarity Score</span>
                            <span className="text-5xl font-black text-[#FF2E7E] tracking-tighter">{match.similarity_score}%</span>
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-[#FF2E7E] flex items-center justify-center text-black shadow-[0_0_30px_#FF2E7E] relative z-10">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                </div>

                {/* COMPARISON GRID */}
                <div className="grid lg:grid-cols-2 gap-8 items-stretch relative">
                    <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black border-2 border-[#232323] rounded-full items-center justify-center z-20">
                        <span className="text-gray-600 font-black text-xl italic">VS</span>
                    </div>

                    {/* LOST ITEM PANEL */}
                    <div className="bg-[#111] border border-[#232323] rounded-[40px] p-10 transition-all hover:border-[#FF2E7E]/30 relative group overflow-hidden">
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-[9px] font-black uppercase tracking-widest">LOST REPORT</span>
                            </div>
                            <h2 className="text-3xl font-black uppercase text-white mb-6 group-hover:text-[#FF2E7E] transition-colors">{match.lost_item}</h2>
                            <div className="aspect-video rounded-2xl bg-black border border-white/5 overflow-hidden shadow-2xl mb-8">
                                {match.lost_img ? <img src={`${BASE_URL}/uploads/${match.lost_img}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">📦</div>}
                            </div>
                            <p className="text-gray-400 text-base leading-relaxed mb-8 italic">"{match.lost_desc}"</p>
                            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                                <div>
                                    <span className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Location</span>
                                    <span className="text-sm font-bold text-white uppercase">{match.lost_loc}</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Date</span>
                                    <span className="text-sm font-bold text-white">{new Date(match.lost_date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FOUND ITEM PANEL */}
                    <div className="bg-[#111] border border-[#232323] rounded-[40px] p-10 transition-all hover:border-[#FF2E7E]/30 relative group overflow-hidden">
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-[9px] font-black uppercase tracking-widest">FOUND REPORT</span>
                            </div>
                            <h2 className="text-3xl font-black uppercase text-white mb-6 group-hover:text-[#FF2E7E] transition-colors">{match.found_item}</h2>
                            <div className="aspect-video rounded-2xl bg-black border border-white/5 overflow-hidden shadow-2xl mb-8">
                                {match.found_img ? <img src={`${BASE_URL}/uploads/${match.found_img}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">📦</div>}
                            </div>
                            <p className="text-gray-400 text-base leading-relaxed mb-8 italic">"{match.found_desc}"</p>
                            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                                <div>
                                    <span className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Location</span>
                                    <span className="text-sm font-bold text-white uppercase">{match.found_loc}</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Date</span>
                                    <span className="text-sm font-bold text-white">{new Date(match.found_date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ACTION CARD */}
                <div className="mt-16 bg-[#111] border border-[#232323] rounded-[40px] p-12 flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 text-center md:text-left">
                        <h4 className="text-2xl font-black uppercase text-white mb-4">Confirm this match?</h4>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
                            If these items appear to be the same, you can initiate a secure chat with the other party. We recommend verifying specific details during your conversation before arranging a handoff.
                        </p>
                    </div>
                    <button
                        onClick={handleStartChat}
                        className="px-12 py-5 bg-[#FF2E7E] text-white font-black uppercase text-[11px] tracking-[4px] rounded-2xl shadow-xl hover:bg-pink-600 transition-all whitespace-nowrap"
                    >
                        Initiate Contact
                    </button>
                </div>
            </div>
        </div>
    );
}
