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
        // We can pass state to navigate or use localstorage
        navigate("/dashboard", { state: { activeTab: "chat" } });
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#FF2E7E] font-black uppercase tracking-widest animate-pulse">Analysing Match Protocol...</div>;
    if (!match) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-bold">Match not found.</div>;

    return (
        <div className="bg-[#050505] text-[#F5F0EB] min-h-screen pt-32 pb-20 px-4 md:px-8 font-inter overflow-hidden relative">
            {/* Background Aesthetic */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[#FF2E7E]/10 to-transparent blur-[120px] pointer-events-none" />
            <div className="absolute top-[20%] -left-20 w-80 h-80 bg-[#FF2E7E]/5 blur-[100px] rounded-full" />

            <div className="max-w-6xl mx-auto relative z-10">
                <Link to="/dashboard" className="inline-flex items-center gap-3 mb-10 text-gray-500 hover:text-[#FF2E7E] transition-all uppercase text-[10px] font-black tracking-[3px] group">
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Return Hub
                </Link>

                <div className="flex flex-col lg:flex-row items-end justify-between gap-10 mb-16">
                    <div className="max-w-2xl">
                        <div className="inline-block px-4 py-1.5 bg-[#FF2E7E]/10 border border-[#FF2E7E]/20 rounded-full text-[10px] font-black text-[#FF2E7E] uppercase tracking-widest mb-6">
                            Deep Scan Match Found
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none mb-6">Match <span className="text-[#FF2E7E]">Intelligence</span></h1>
                        <p className="text-gray-400 text-lg font-medium leading-relaxed">Our neural matching algorithm has identified a potential connection between your report and a discovery near your location. Review the side-by-side evidence below.</p>
                    </div>
                    
                    <div className="flex items-center gap-8 p-8 bg-white/[0.03] border border-white/10 rounded-[32px] backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#FF2E7E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="text-right relative z-10">
                            <span className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Confidence Level</span>
                            <span className="text-5xl font-black text-[#FF2E7E] tracking-tighter">{match.similarity_score}%</span>
                        </div>
                        <div className="w-20 h-20 rounded-2xl bg-[#FF2E7E] flex items-center justify-center text-black shadow-[0_0_40px_#FF2E7E] relative z-10 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                             <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg>
                        </div>
                    </div>
                </div>

                {/* COMPARISON ENGINE */}
                <div className="grid lg:grid-cols-2 gap-8 items-stretch relative">
                    <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#050505] border-2 border-[#FF2E7E] rounded-full items-center justify-center z-20 shadow-[0_0_30px_#FF2E7E]">
                        <span className="text-[#FF2E7E] font-black text-2xl group-hover:scale-125 transition-transform italic">VS</span>
                    </div>

                    {/* OWNER PANEL */}
                    <div className="bg-[#0d0d0d] border border-white/10 rounded-[48px] p-12 transition-all hover:border-[#FF2E7E]/40 relative group overflow-hidden">
                        <div className="absolute top-12 right-12 text-[10px] font-black text-gray-600 uppercase tracking-widest">Protocol: LOST</div>
                        <div className="mb-12">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-1 bg-[#FF2E7E] rounded-full" />
                                <h3 className="text-[12px] font-black text-white uppercase tracking-[4px]">Original Report</h3>
                            </div>
                            <h2 className="text-4xl font-black uppercase text-white mb-6 group-hover:text-[#FF2E7E] transition-colors">{match.lost_item}</h2>
                            <div className="aspect-video rounded-3xl bg-black border border-white/5 overflow-hidden shadow-2xl mb-8 relative">
                                {match.lost_img ? <img src={`${BASE_URL}/uploads/${match.lost_img}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" /> : <div className="w-full h-full flex items-center justify-center text-8xl grayscale opacity-30">💼</div>}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-6 left-6 flex gap-2">
                                    <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-widest text-[#FF2E7E]">Verified Original</span>
                                </div>
                            </div>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8">{match.lost_desc}</p>
                            <div className="grid grid-cols-2 gap-8 py-8 border-t border-white/5">
                                <div className="space-y-1">
                                    <span className="block text-[10px] font-black text-gray-600 uppercase">Primary Location</span>
                                    <span className="text-base font-bold text-white uppercase tracking-tight">{match.lost_loc}</span>
                                </div>
                                <div className="space-y-1 text-right">
                                    <span className="block text-[10px] font-black text-gray-600 uppercase">Timestamp</span>
                                    <span className="text-base font-bold text-white uppercase tracking-tight">{new Date(match.lost_date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FINDER PANEL */}
                    <div className="bg-[#0d0d0d] border border-white/10 rounded-[48px] p-12 transition-all hover:border-[#FF2E7E]/40 relative group overflow-hidden">
                        <div className="absolute top-12 right-12 text-[10px] font-black text-gray-600 uppercase tracking-widest">Protocol: FOUND</div>
                        <div className="mb-12">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-1 bg-[#FF2E7E] rounded-full" />
                                <h3 className="text-[12px] font-black text-white uppercase tracking-[4px]">Detection Result</h3>
                            </div>
                            <h2 className="text-4xl font-black uppercase text-white mb-6 group-hover:text-[#FF2E7E] transition-colors">{match.found_item}</h2>
                            <div className="aspect-video rounded-3xl bg-black border border-white/5 overflow-hidden shadow-2xl mb-8 relative">
                                {match.found_img ? <img src={`${BASE_URL}/uploads/${match.found_img}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" /> : <div className="w-full h-full flex items-center justify-center text-8xl grayscale opacity-30">🔍</div>}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-6 left-6 flex gap-2">
                                    <span className="px-3 py-1 bg-[#FF2E7E]/10 border border-[#FF2E7E]/30 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-widest text-[#FF2E7E]">Live Detection</span>
                                </div>
                            </div>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8">{match.found_desc}</p>
                            <div className="grid grid-cols-2 gap-8 py-8 border-t border-white/5">
                                <div className="space-y-1">
                                    <span className="block text-[10px] font-black text-gray-600 uppercase">Discovery Hub</span>
                                    <span className="text-base font-bold text-white uppercase tracking-tight">{match.found_loc}</span>
                                </div>
                                <div className="space-y-1 text-right">
                                    <span className="block text-[10px] font-black text-gray-600 uppercase">Detection Date</span>
                                    <span className="text-base font-bold text-white uppercase tracking-tight">{new Date(match.found_date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CALL TO ACTION */}
                <div className="mt-20 flex flex-col items-center">
                    <div className="p-10 bg-white/[0.02] border border-white/10 rounded-[40px] max-w-4xl w-full flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="text-2xl font-black uppercase text-white mb-2 tracking-tight">Ready to verify with the finder?</h4>
                            <p className="text-gray-400 font-medium">Initiating contact will create a secure, encrypted bridge between you and the finder. No personal information is shared until you verify the handoff.</p>
                        </div>
                        <button 
                            onClick={handleStartChat}
                            className="px-10 py-5 bg-[#FF2E7E] text-black font-black uppercase text-[11px] tracking-[4px] rounded-2xl shadow-[0_20px_50px_rgba(255,46,126,0.3)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                        >
                            Open Secure Link
                        </button>
                    </div>
                    
                    <div className="mt-12 flex items-center gap-8 grayscale opacity-20">
                        <span className="text-[10px] font-black uppercase tracking-[5px] text-white">Trust Partner Protocol v2.4</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
