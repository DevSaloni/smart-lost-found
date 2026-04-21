import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import BASE_URL from "../config.js";
import toast from "react-hot-toast";

export default function ItemDetails() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/reports/${id}`);
                const data = await res.json();
                if (res.ok) setItem(data.report);
                else toast.error(data.error);
            } catch (err) {
                toast.error("Failed to load item details");
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#FF2E7E] font-black uppercase tracking-widest animate-pulse">Scanning Database...</div>;
    if (!item) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Item not found.</div>;

    return (
        <div className="bg-[#050505] text-[#F5F0EB] min-h-screen pt-32 pb-20 px-4 md:px-8 font-inter overflow-hidden relative">
            {/* Background Aesthetic */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF2E7E]/5 blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FF2E7E]/3 blur-[150px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header Nav */}
                <div className="flex items-center justify-between mb-16">
                    <Link to="/browse" className="inline-flex items-center gap-3 text-gray-500 hover:text-white transition-all uppercase text-[10px] font-black tracking-[3px] group">
                        <span className="group-hover:-translate-x-1 transition-all">←</span> Back to Explore
                    </Link>
                    <div className="px-4 py-1.5 bg-[#FF2E7E]/10 border border-[#FF2E7E]/30 rounded-full text-[10px] font-black text-[#FF2E7E] uppercase tracking-widest">
                        Protocol: {item.type.toUpperCase()}
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* LEFT: INFO */}
                    <div className="lg:col-span-7 space-y-12">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Case ID: {item.id}</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-[#FF2E7E] animate-pulse" />
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none mb-8">{item.item_name}</h1>
                            <p className="text-lg text-gray-400 leading-relaxed max-w-xl font-medium">{item.description}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 py-12 border-y border-white/5">
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Location</h3>
                                <p className="text-base font-bold text-white">{item.location}</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Discovery Date</h3>
                                <p className="text-base font-bold text-white">{new Date(item.date).toLocaleDateString()}</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Current Status</h3>
                                <p className="text-base font-bold text-[#FF2E7E] uppercase tracking-tight">{item.status || 'Active'}</p>
                            </div>
                        </div>

                        <div className="space-y-6 bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
                            <h3 className="text-[10px] font-black text-[#FF2E7E] uppercase tracking-widest">Advanced Details</h3>
                            <p className="text-gray-400 font-medium italic">"No additional identifiers provided. Secure chat is recommended for verification of specific marks or contents."</p>
                        </div>
                    </div>

                    {/* RIGHT: PHOTO & ACTION */}
                    <div className="lg:col-span-5 sticky top-32">
                        <div className="relative group mb-10">
                            <div className="absolute -inset-2 bg-gradient-to-tr from-[#FF2E7E] to-transparent opacity-20 blur-3xl rounded-[48px] group-hover:opacity-40 transition-opacity" />
                            <div className="relative aspect-square rounded-[40px] bg-black border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
                                {item.image_url ? (
                                    <img src={`${BASE_URL}/uploads/${item.image_url}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                                ) : (
                                    <span className="text-[120px] drop-shadow-[0_0_50px_rgba(255,46,126,0.3)]">{item.item_name.toLowerCase().includes('wallet') ? '💼' : '📦'}</span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <button className="w-full py-6 bg-[#FF2E7E] text-black font-black uppercase tracking-[4px] text-xs rounded-2xl shadow-[0_20px_50px_rgba(255,46,126,0.25)] hover:bg-pink-600 hover:-translate-y-1 transition-all active:scale-95">
                                {item.type === 'found' ? 'Confirm This Is Mine' : 'I Have Found This'}
                            </button>
                            <div className="text-center">
                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Secured By Neural Link Protocol</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secure Recovery Guide */}
                <div className="mt-40 pt-20 border-t border-white/5 grid md:grid-cols-3 gap-20">
                    <div>
                        <div className="text-4xl font-black text-white/10 mb-6 tracking-tighter italic">Phase 01</div>
                        <h4 className="text-xs font-black text-[#FF2E7E] uppercase tracking-[4px] mb-4">Neural Scanner</h4>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">Our system detects overlaps in geometry, location, and description between Lost & Found reports.</p>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-white/10 mb-6 tracking-tighter italic">Phase 02</div>
                        <h4 className="text-xs font-black text-[#FF2E7E] uppercase tracking-[4px] mb-4">Secure Relay</h4>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">Verified users can initiate a private bridge to exchange proof without leaking sensitive data.</p>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-white/10 mb-6 tracking-tighter italic">Phase 03</div>
                        <h4 className="text-xs font-black text-[#FF2E7E] uppercase tracking-[4px] mb-4">Physical Trust</h4>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">The cycle closes with a unique visual OTP handoff, marking the item as officially returned.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
