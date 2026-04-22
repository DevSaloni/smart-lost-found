import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import BASE_URL from "../config.js";
import toast from "react-hot-toast";

export default function ItemDetails() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [matches, setMatches] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/reports/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setItem(data.report);
                    // Also fetch matches for this item
                    const token = localStorage.getItem("token");
                    if (token) {
                        const matchesRes = await fetch(`${BASE_URL}/api/matches/user-matches`, {
                            headers: { "Authorization": `Bearer ${token}` }
                        });
                        const matchesData = await matchesRes.json();
                        if (matchesRes.ok) {
                            const filteredMatches = matchesData.matches.filter(m => m.my_report_id === parseInt(id) || m.matched_report_id === parseInt(id));
                            setMatches(filteredMatches);
                        }
                    }
                } else {
                    toast.error("Item not found");
                    navigate("/browse");
                }
            } catch (error) {
                console.error("Fetch error:", error);
                toast.error("Failed to load details");
            } finally {
                setLoading(false);
            }
        };

        fetchItemDetails();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#FF2E7E]/20 border-t-[#FF2E7E] rounded-full animate-spin"></div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[4px]">Syncing Archive...</p>
                </div>
            </div>
        );
    }

    if (!item) return null;

    return (
        <div className="bg-[#050505] text-[#F5F0EB] min-h-screen pt-32 pb-24 px-4 md:px-8 font-['Inter']">
            <div className="max-w-7xl mx-auto">
                {/* Navigation Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
                    <div className="space-y-4">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[3px] text-gray-500 hover:text-[#FF2E7E] transition-all group"
                        >
                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[#FF2E7E]/10 transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            </div>
                            Return to Previous
                        </button>
                        <h1 className="text-6xl md:text-8xl font-black text-white leading-none uppercase tracking-tighter italic">
                            {item.item_name}
                        </h1>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                         <div className={`px-6 py-3 rounded-2xl text-[12px] font-black uppercase tracking-[4px] ${item.type === 'found' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'} border`}>
                            Protocol: {item.type}
                        </div>
                        <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest text-right">
                           Asset ID: #{String(item.id).padStart(6, '0')} <br/>
                           Registered {new Date(item.created_at).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Visual Evidence Section */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-[#0d0d0d] border border-white/5 rounded-[56px] overflow-hidden relative group shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
                            <div className="aspect-[1/1.2]">
                                {item.image_url ? (
                                    <img 
                                        src={`${BASE_URL}/uploads/${item.image_url}`} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms]" 
                                        alt={item.item_name}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-white/[0.01] opacity-20">
                                        <div className="text-9xl mb-6">📦</div>
                                        <div className="text-[12px] font-black uppercase tracking-[10px]">No Visual Data</div>
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 p-12 flex flex-col justify-end">
                                <span className="text-[11px] font-black text-[#FF2E7E] uppercase tracking-[5px] mb-2">Original Capture</span>
                                <p className="text-gray-400 font-medium">Secured evidence from point of discovery.</p>
                            </div>
                        </div>

                         <div className="bg-white/[0.01] border border-white/5 p-10 rounded-[48px] space-y-8">
                            <div>
                                <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[5px] mb-6">Tactile Markers</h4>
                                <div className="flex flex-wrap gap-2">
                                    {item.identifiers ? item.identifiers.split(',').map((tag, i) => (
                                        <span key={i} className="px-5 py-3 bg-white/5 border border-white/5 rounded-2xl text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-white hover:border-[#FF2E7E]/30 transition-all cursor-default">{tag.trim()}</span>
                                    )) : <span className="text-gray-600 italic">No specific marks cataloged.</span>}
                                </div>
                            </div>
                            <div className="pt-4 border-t border-white/5 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Alert Method</span>
                                    <span className="text-[12px] font-bold text-white uppercase italic">{item.alert_method || 'System Internal'}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                    <span>Sync Status</span>
                                    <span className="text-green-500">Encrypted</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Report Analytics Section */}
                    <div className="lg:col-span-7 space-y-12">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[40px] hover:bg-white/[0.03] transition-all">
                                <div className="w-12 h-12 bg-[#FF2E7E]/10 rounded-2xl flex items-center justify-center text-[#FF2E7E] mb-8 border border-[#FF2E7E]/10">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[4px] mb-3">Discovery Zone</h4>
                                <div className="text-2xl font-bold text-white leading-tight">{item.location}</div>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[40px] hover:bg-white/[0.03] transition-all">
                                <div className="w-12 h-12 bg-[#FF2E7E]/10 rounded-2xl flex items-center justify-center text-[#FF2E7E] mb-8 border border-[#FF2E7E]/10">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[4px] mb-3">Timeline Log</h4>
                                <div className="text-2xl font-bold text-white leading-tight">{new Date(item.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                            </div>
                        </div>

                        <div className="bg-white/[0.01] border border-white/5 p-12 rounded-[56px] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF2E7E]/5 blur-[120px] -mr-48 -mt-48 rounded-full"></div>
                            <div className="relative z-10">
                                <h3 className="text-[12px] font-black uppercase tracking-[6px] text-[#FF2E7E] mb-8">Asset Description</h3>
                                <p className="text-2xl text-gray-300 font-medium leading-relaxed max-w-3xl italic">
                                    "{item.description || "No supplemental discovery logs provided for this recovery asset."}"
                                </p>
                            </div>
                        </div>

                        {/* Matches Hub */}
                        <div className="bg-white/[0.01] border border-white/5 p-12 rounded-[56px]">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 bg-[#FF2E7E] rounded-full shadow-[0_0_15px_#FF2E7E]"></div>
                                    <h3 className="text-[14px] font-bold uppercase tracking-[6px] text-white">Neural Correlates</h3>
                                </div>
                                <span className="text-[10px] font-black text-gray-700 uppercase tracking-[4px] italic">Active Scan: {matches.length} hits</span>
                            </div>

                            <div className="space-y-6">
                                {matches.length === 0 ? (
                                    <div className="py-24 border border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center text-center">
                                        <div className="text-6xl opacity-10 mb-6 animate-pulse">🛰️</div>
                                        <p className="text-[12px] font-black text-gray-700 uppercase tracking-[4px]">System searching for semantic similarities...</p>
                                    </div>
                                ) : (
                                    matches.map((match, i) => (
                                        <div key={i} className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] hover:border-[#FF2E7E]/40 transition-all flex flex-col md:flex-row items-center justify-between gap-10 group overflow-hidden relative">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-[#FF2E7E] opacity-0 group-hover:opacity-100 transition-all"></div>
                                            <div className="flex items-center gap-8">
                                                <div className="w-24 h-24 bg-black rounded-3xl overflow-hidden border border-white/10 group-hover:scale-105 transition-transform duration-700 shadow-2xl">
                                                    {match.matched_image ? <img src={`${BASE_URL}/uploads/${match.matched_image}`} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl opacity-20">📦</div>}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-[10px] font-black text-[#FF2E7E] uppercase tracking-widest">{match.similarity_score}% Confidence</span>
                                                        <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
                                                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{match.matched_location}</span>
                                                    </div>
                                                    <h5 className="text-2xl font-black text-white group-hover:text-[#FF2E7E] transition-colors uppercase">{match.matched_item}</h5>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => navigate("/dashboard", { state: { activeTab: 'chat' } })}
                                                className="px-10 py-5 bg-[#FF2E7E] text-white rounded-[24px] text-[12px] font-black uppercase tracking-[3px] hover:scale-[1.05] active:scale-95 transition-all shadow-[0_15px_30px_rgba(255,46,126,0.3)]"
                                            >
                                                Initiate Relay
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Page Footer Actions */}
                        <div className="flex gap-4 pt-4">
                            <button onClick={() => window.print()} className="flex-1 py-6 bg-white/5 border border-white/10 rounded-[28px] text-[11px] font-black uppercase tracking-[5px] text-gray-500 hover:text-white hover:bg-white/10 transition-all">Export Secure Log (PDF)</button>
                            <Link to="/report-item" className="flex-1 py-6 bg-white/5 border border-white/10 rounded-[28px] text-[11px] font-black uppercase tracking-[5px] text-gray-500 hover:text-white hover:bg-white/10 transition-all text-center">Modify Discovery Entry</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
