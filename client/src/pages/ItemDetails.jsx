import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import BASE_URL from "../config.js";
import toast from "react-hot-toast";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const getCategoryIcon = (category) => {
    if (!category) return "📦";
    const cat = category.toLowerCase();
    if (cat.includes("wallet") || cat.includes("purse")) return "💼";
    if (cat.includes("phone")) return "📱";
    if (cat.includes("key")) return "🔑";
    if (cat.includes("bag") || cat.includes("backpack")) return "🎒";
    if (cat.includes("pet")) return "🐕";
    if (cat.includes("jewel") || cat.includes("ring")) return "💍";
    if (cat.includes("document")) return "📄";
    return "📦";
};

export default function ItemDetails() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [matches, setMatches] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const context = location.state?.context;

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/reports/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setItem(data.report);
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
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#FF2E7E]/20 border-t-[#FF2E7E] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!item) return null;

    return (
        <div className="bg-black text-white min-h-screen pt-20 md:pt-30 pb-20 px-4 font-['Inter'] selection:bg-[#FF2E7E]/30">
            <div className="max-w-6xl mx-auto">

                {/* Header Navigation */}
                <div className="flex items-center justify-between mb-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[2px] text-gray-500 hover:text-[#FF2E7E] transition-all group"
                    >
                        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                        Back
                    </button>
                    <div className="flex items-center gap-4">
                        <span className={`text-[10px] font-black tracking-[3px] uppercase ${item.type === 'found' ? 'text-green-500' : 'text-[#FF2E7E]'}`}>
                            {item.type} Report
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px]">ID #{String(item.id).padStart(6, '0')}</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">

                    {/* LEFT COLUMN: Visual & Metadata */}
                    <div className="lg:col-span-5 space-y-8 md:space-y-12">
                        <div className="relative group">
                            <div className="relative rounded-[24px] md:rounded-[32px] overflow-hidden bg-[#0a0a0a] border border-white/5 aspect-square sm:aspect-[4/5] shadow-2xl">
                                {item.image_url ? (
                                    <img
                                        src={`${BASE_URL}/uploads/${item.image_url}`}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        alt={item.item_name}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center">
                                        <span className="text-9xl mb-6 opacity-10">{getCategoryIcon(item.category)}</span>
                                        <p className="text-[10px] font-bold uppercase tracking-[6px] text-gray-700">No Image</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Metadata List */}
                        <div className="space-y-6 pt-4">
                            <div className="flex items-center justify-between py-4 border-b border-white/5">
                                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Category</span>
                                <span className="text-xs font-bold text-white uppercase">{item.category}</span>
                            </div>
                            <div className="flex items-center justify-between py-4 border-b border-white/5">
                                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Reported</span>
                                <span className="text-xs font-bold text-white uppercase">{new Date(item.date).toLocaleDateString()}</span>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-6">Identifiers</h4>
                                <div className="flex flex-wrap gap-2">
                                    {item.identifiers ? item.identifiers.split(',').map((tag, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-lg text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                                            {tag.trim()}
                                        </span>
                                    )) : <span className="text-xs text-gray-700 italic">None</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Content & Details */}
                    <div className="lg:col-span-7">
                        <div className="max-w-2xl">
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-8 tracking-tight leading-tight uppercase">
                                {item.item_name}
                            </h1>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 mb-8 py-8 border-y border-white/10">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Location</span>
                                    <span className="text-sm md:text-base font-bold text-white uppercase">{item.location}</span>
                                </div>
                                <div className="hidden sm:block w-px h-8 bg-white/10"></div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Status</span>
                                    <span className={`text-sm md:text-base font-bold uppercase ${item.status === 'resolved' ? 'text-blue-500' : 'text-orange-500'}`}>{item.status || 'Active'}</span>
                                </div>
                            </div>

                            {item.lat && item.lng && (
                                <div className="mb-12 border border-white/5 rounded-xl overflow-hidden shadow-2xl relative z-10" style={{ height: "200px" }}>
                                    <MapContainer center={[item.lat, item.lng]} zoom={14} style={{ height: "100%", width: "100%", zIndex: 10 }}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <Marker position={[item.lat, item.lng]} />
                                    </MapContainer>
                                </div>
                            )}

                            {/* Detailed Description */}
                            <section className="mb-16">
                                <h3 className="text-[10px] font-bold text-[#FF2E7E] uppercase tracking-[4px] mb-6">Description</h3>
                                <p className="text-base md:text-lg text-gray-400 leading-relaxed font-medium">
                                    {item.description || "No specific details provided."}
                                </p>
                            </section>

                            <div className="h-px bg-white/10 w-full mb-16"></div>

                            {/* Matches Hub */}
                            <section className="mb-16">
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="text-[10px] font-bold text-[#FF2E7E] uppercase tracking-[4px]">Potential Matches</h3>
                                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{matches.length} Records Found</span>
                                </div>

                                <div className="space-y-4">
                                    {matches.length === 0 ? (
                                        <p className="text-xs text-gray-600 italic">No matches detected by AI yet.</p>
                                    ) : (
                                        matches.map((match, i) => (
                                            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-b border-white/5 hover:bg-white/[0.01] transition-all px-4 rounded-xl group gap-6">
                                                <div className="flex items-center gap-4 md:gap-6">
                                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden bg-[#111] border border-white/5 shadow-xl flex-shrink-0">
                                                        {match.matched_image ? (
                                                            <img src={`${BASE_URL}/uploads/${match.matched_image}`} className="w-full h-full object-cover" alt="Match" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-xl opacity-10">📦</div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                                            <span className="text-[9px] font-black text-[#FF2E7E] uppercase tracking-widest">{match.similarity_score}% Match</span>
                                                            <span className="text-[9px] text-gray-600 uppercase tracking-widest truncate max-w-[150px]">{match.matched_location}</span>
                                                        </div>
                                                        <h5 className="text-sm font-bold text-white group-hover:text-[#FF2E7E] transition-colors uppercase truncate">{match.matched_item}</h5>
                                                    </div>
                                                </div>
                                                {/* Button Style Matched to Navbar (Pink bg, Black text, rectangular, no rounding) */}
                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <button
                                                        onClick={() => navigate(`/match-details/${match.match_id}`)}
                                                        className="w-full sm:w-auto border border-[#FF2E7E]/30 text-[#FF2E7E] px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#FF2E7E]/10 transition-all"
                                                    >
                                                        VIEW COMPARISON
                                                    </button>
                                                    <button
                                                        onClick={() => navigate("/dashboard", { state: { activeTab: 'chat', matchId: match.match_id } })}
                                                        className="w-full sm:w-auto bg-[#FF2E7E] text-[#0A0A0A] px-6 py-3 text-[10px] font-black uppercase tracking-[0.15em] hover:bg-pink-600 transition-all shadow-[0_0_15px_rgba(255,46,126,0.2)] hover:shadow-[0_0_25px_rgba(255,46,126,0.4)]"
                                                    >
                                                        START CHAT
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>

                            <div className="h-px bg-white/10 w-full mb-16"></div>

                            {/* Safety Guidance - Moved to Bottom */}
                            <section className="mb-20">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_orange]"></div>
                                    <h4 className="text-[10px] font-bold text-white uppercase tracking-[4px]">Safety Guidance</h4>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-xs text-gray-500 leading-relaxed">
                                        <span className="text-[#FF2E7E] font-bold">•</span>
                                        Verify all item details through the secure chat system before arranging any physical meetups.
                                    </li>
                                    <li className="flex items-start gap-3 text-xs text-gray-500 leading-relaxed">
                                        <span className="text-[#FF2E7E] font-bold">•</span>
                                        Handoffs should always take place in public, well-monitored locations during daylight hours.
                                    </li>
                                    <li className="flex items-start gap-3 text-xs text-gray-500 leading-relaxed">
                                        <span className="text-[#FF2E7E] font-bold">•</span>
                                        Use our OTP Verification process to confirm the successful transfer of the item.
                                    </li>
                                </ul>
                            </section>

                            {/* Final Actions */}
                            <div className="flex flex-wrap items-center gap-6 pt-10 border-t border-white/10">
                                {context === 'dashboard' ? (
                                    <button
                                        onClick={() => navigate("/report-item", { state: { editItem: item } })}
                                        className="bg-[#FF2E7E] text-[#050505] px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-pink-600 transition-all hover:-translate-y-0.5 shadow-[0_0_20px_rgba(255,46,126,0.2)] hover:shadow-[0_0_30px_rgba(255,46,126,0.4)]"
                                    >
                                        EDIT REPORT
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => navigate("/report-item", { 
                                            state: { 
                                                reportType: item.type === 'lost' ? 'found' : 'lost',
                                                // Optional: pre-fill some info to make it easier for the finder
                                                initialData: {
                                                    item_name: item.item_name,
                                                    category: item.category
                                                }
                                            } 
                                        })}
                                        className="bg-[#FF2E7E] text-[#050505] px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-pink-600 transition-all hover:-translate-y-0.5 shadow-[0_0_20px_rgba(255,46,126,0.2)] hover:shadow-[0_0_30px_rgba(255,46,126,0.4)]"
                                    >
                                        REPORT ITEM
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        toast.success("Link copied!");
                                    }}
                                    className="border border-[#FF2E7E]/30 text-[#FF2E7E] bg-transparent px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#FF2E7E] hover:text-[#050505] transition-all hover:-translate-y-0.5"
                                >
                                    SHARE LINK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
