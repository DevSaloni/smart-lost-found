import React, { useState } from "react";
import { Link } from "react-router-dom";

const quickFilters = ["ALL", "LOST", "FOUND", "WALLET", "PHONE", "KEYS", "BAG", "JEWELLERY", "PET", "DOCUMENTS"];

const sortOptions = ["Latest first", "Oldest first", "Top matches"];

const reports = [
    {
        id: 1,
        status: "FOUND",
        type: "found",
        title: "Blue leather wallet",
        location: "Shivajinagar",
        date: "Apr 4",
        icon: "💼",
    },
    {
        id: 2,
        status: "LOST",
        type: "lost",
        title: "Samsung Galaxy S24",
        location: "FC Road",
        date: "Apr 3",
        icon: "📱",
    },
    {
        id: 3,
        status: "FOUND",
        type: "found",
        title: "Honda car keys",
        location: "Koregaon Park",
        date: "Apr 2",
        icon: "🔑",
    },
    {
        id: 4,
        status: "LOST",
        type: "lost",
        title: "Black backpack",
        location: "Pune Station",
        date: "Apr 1",
        icon: "🎒",
    },
    {
        id: 5,
        status: "LOST",
        type: "lost",
        title: "Golden Retriever, Bruno",
        location: "Baner",
        date: "Mar 31",
        icon: "🐕",
    },
    {
        id: 6,
        status: "MATCHED",
        type: "matched",
        title: "Sony WH-1000XM5",
        location: "Viman Nagar",
        date: "Mar 28",
        icon: "🎧",
    },
];

export default function Browse() {
    const [activeQuickFilter, setActiveQuickFilter] = useState("ALL");
    const [sortOpen, setSortOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState(sortOptions[0]);

    return (
        <div className="bg-black text-white min-h-screen pt-12 pb-17 px-4">
            <div className="max-w-6xl mx-auto pt-10">

                {/* Header Section */}
                <div className="mb-12">
                    <span className="text-[#FF2E7E] font-bold tracking-[0.2em] text-[10px] uppercase block mb-4">
                        EXPLORE REPORTS
                    </span>
                    <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-tight leading-none mb-10">
                        ALL REPORTS NEAR YOU
                    </h1>

                    {/* Search Bar */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="flex-1 relative group">
                            <input
                                type="text"
                                placeholder="Search lost or found items..."
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-3 text-white outline-none focus:border-[#FF2E7E]/50 focus:bg-white/[0.05] transition-all"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                        </div>
                        <button className="px-10 py-3 bg-[#FF2E7E] text-black font-extrabold uppercase tracking-widest text-xs rounded-2xl shadow-[0_10px_20px_rgba(255,46,126,0.2)] hover:bg-pink-600 hover:scale-[1.02] transition-all duration-300">
                            SEARCH
                        </button>
                    </div>

                    {/* Quick Filters */}
                    <div className="flex flex-wrap gap-2">
                        {quickFilters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveQuickFilter(filter)}
                                className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-widest border transition-all duration-300 ${activeQuickFilter === filter ? 'border-[#FF2E7E] text-[#FF2E7E] bg-[#FF2E7E]/5' : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-white'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">

                    {/* SIDEBAR FILTERS */}
                    <div className="lg:col-span-3 space-y-8">

                        {/* Category Filter */}
                        <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-8">
                            <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#FF2E7E] uppercase mb-6">CATEGORY</h3>
                            <div className="space-y-4">
                                {["All categories", "Wallet / Purse", "Phone", "Keys", "Bag / Backpack", "Jewellery"].map((cat, i) => (
                                    <label key={cat} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${i === 0 ? 'bg-[#FF2E7E] border-[#FF2E7E]' : 'border-white/20 group-hover:border-white/40'}`}>
                                                {i === 0 && <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>}
                                            </div>
                                            <span className={`text-sm transition-colors ${i === 0 ? 'text-white font-medium' : 'text-gray-500 group-hover:text-gray-300'}`}>{cat}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-600 font-bold">{[115, 34, 28, 19, 15, 11][i]}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Date Range Filter */}
                        <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-8">
                            <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#FF2E7E] uppercase mb-6">DATE RANGE</h3>
                            <div className="space-y-4">
                                {["All time", "Today", "This week", "This month"].map((time, i) => (
                                    <label key={time} className="flex items-center gap-3 group cursor-pointer">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${i === 0 ? 'bg-pink-500/20 border-[#FF2E7E]' : 'border-white/20 group-hover:border-white/40'}`}>
                                            {i === 0 && <div className="w-1.5 h-1.5 bg-[#FF2E7E] rounded-sm" />}
                                        </div>
                                        <span className={`text-sm transition-colors ${i === 0 ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>{time}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-8">
                            <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#FF2E7E] uppercase mb-6">STATUS</h3>
                            <div className="space-y-4">
                                {["Active", "Matched", "Returned"].map((status, i) => (
                                    <label key={status} className="flex items-center gap-3 group cursor-pointer">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${i === 0 ? 'bg-[#FF2E7E] border-[#FF2E7E]' : 'border-white/20 group-hover:border-white/40'}`}>
                                            {i === 0 && <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>}
                                        </div>
                                        <span className={`text-sm transition-colors ${i === 0 ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>{status}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* RESULTS GRID */}
                    <div className="lg:col-span-9">
                        <div className="flex items-center justify-between mb-8 px-2">
                            <p className="text-gray-500 text-sm font-medium">115 reports found</p>

                            {/* THEMED CUSTOM DROPDOWN */}
                            <div className="flex items-center gap-4 relative">
                                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Sort by:</span>
                                <div
                                    onClick={() => setSortOpen(!sortOpen)}
                                    className={`flex items-center gap-3 px-4 py-2 bg-white/[0.03] border ${sortOpen ? 'border-[#FF2E7E]' : 'border-white/10'} rounded-lg cursor-pointer transition-all min-w-[140px] justify-between`}
                                >
                                    <span className="text-sm font-bold text-white">{selectedSort}</span>
                                    <svg className={`w-3 h-3 text-[#FF2E7E] transition-transform ${sortOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                </div>

                                {sortOpen && (
                                    <div className="absolute top-[calc(100%+8px)] right-0 w-full bg-[#111] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl min-w-[160px]">
                                        {sortOptions.map((opt) => (
                                            <div
                                                key={opt}
                                                onClick={() => { setSelectedSort(opt); setSortOpen(false); }}
                                                className="px-5 py-3 text-sm text-gray-400 hover:text-white hover:bg-[#FF2E7E]/10 cursor-pointer transition-colors"
                                            >
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reports.map((report) => (
                                <Link
                                    key={report.id}
                                    to={`/item/${report.id}`}
                                    className="group bg-[#0c0c0c] border border-white/10 rounded-[32px] p-6 hover:border-[#FF2E7E]/30 transition-all duration-500 cursor-pointer flex flex-col relative overflow-hidden"
                                >
                                    {/* Action Button on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8 z-10">
                                        <div className="px-6 py-2.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
                                            View Details
                                        </div>
                                    </div>

                                    {/* Tag */}
                                    <div className="flex mb-6 text-left">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${report.type === 'found' ? 'bg-green-500/10 text-green-500' :
                                            report.type === 'lost' ? 'bg-orange-500/10 text-orange-500' :
                                                'bg-blue-500/10 text-blue-500'
                                            }`}>
                                            {report.status}
                                        </span>
                                    </div>

                                    {/* Icon Placeholder */}
                                    <div className="flex-1 flex items-center justify-center py-8 group-hover:scale-110 transition-transform duration-500">
                                        <span className="text-6xl drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{report.icon}</span>
                                    </div>

                                    {/* Text Content */}
                                    <div className="mt-6 pt-6 border-t border-white/5 text-left">
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FF2E7E] transition-colors">{report.title}</h3>
                                        <div className="flex items-center justify-between text-xs text-gray-500 font-medium tracking-tight">
                                            <span>{report.location}</span>
                                            <span className="w-1.5 h-1.5 bg-white/10 rounded-full" />
                                            <span>{report.date}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            <div className="h-20" />
        </div>
    );
}
