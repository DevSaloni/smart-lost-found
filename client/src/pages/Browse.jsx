import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BASE_URL from "../config.js";

const quickFilters = ["ALL", "WALLET", "PHONE", "KEYS", "BAG", "JEWELLERY", "PET", "DOCUMENTS"];

const sortOptions = ["Latest first", "Oldest first", "Top matches"];

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

export default function Browse() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeQuickFilter, setActiveQuickFilter] = useState("ALL");
    const [sortOpen, setSortOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState(sortOptions[0]);

    // Sidebar filters
    const [selectedCategory, setSelectedCategory] = useState("All categories");
    const [selectedDateRange, setSelectedDateRange] = useState("All time");
    const [selectedStatus, setSelectedStatus] = useState("Active");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const queryParams = new URLSearchParams();

                // Force Browse page to ONLY show 'lost' items to maintain professional focus
                queryParams.append("type", "lost");

                if (activeQuickFilter !== "ALL") {
                    queryParams.append("category", activeQuickFilter);
                }
                if (selectedCategory !== "All categories") {
                    queryParams.append("category", selectedCategory);
                }

                // Let the backend handle 'All' gracefully if sent, our backend assumes missing means NO filter, or Active filters based on exact string
                // we'll send it if not default, but backend needs to handle "Active" anyway.
                if (selectedStatus && selectedStatus !== 'All statuses') {
                    queryParams.append("status", selectedStatus);
                }

                if (searchQuery.trim()) {
                    queryParams.append("search", searchQuery);
                }
                if (selectedDateRange && selectedDateRange !== 'All time') {
                    queryParams.append("dateRange", selectedDateRange);
                }
                if (selectedSort) {
                    queryParams.append("sort", selectedSort);
                }

                const res = await fetch(`${BASE_URL}/api/reports/browse?${queryParams.toString()}`);
                const data = await res.json();
                if (res.ok) {
                    setReports(data.reports || []);
                }
            } catch (error) {
                console.error("Failed to fetch reports", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [activeQuickFilter, selectedCategory, selectedStatus, selectedSort, searchQuery, selectedDateRange]);

    return (
        <div className="bg-black text-white min-h-screen pt-30 pb-20 px-4">
            <div className="max-w-6xl mx-auto">

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
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
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
                                {["All categories", "Wallet / Purse", "Electronics", "Documents / IDs", "Keys", "Bags / Luggage", "Pets", "Jewellery", "Other"].map((cat, i) => (
                                    <label key={cat} onClick={() => setSelectedCategory(cat)} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedCategory === cat ? 'bg-[#FF2E7E] border-[#FF2E7E]' : 'border-white/20 group-hover:border-white/40'}`}>
                                                {selectedCategory === cat && <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>}
                                            </div>
                                            <span className={`text-sm transition-colors ${selectedCategory === cat ? 'text-white font-medium' : 'text-gray-500 group-hover:text-gray-300'}`}>{cat}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Date Range Filter */}
                        <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-8">
                            <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#FF2E7E] uppercase mb-6">DATE RANGE</h3>
                            <div className="space-y-4">
                                {["All time", "Today", "This week", "This month"].map((time, i) => (
                                    <label key={time} onClick={() => setSelectedDateRange(time)} className="flex items-center gap-3 group cursor-pointer">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedDateRange === time ? 'bg-pink-500/20 border-[#FF2E7E]' : 'border-white/20 group-hover:border-white/40'}`}>
                                            {selectedDateRange === time && <div className="w-1.5 h-1.5 bg-[#FF2E7E] rounded-sm" />}
                                        </div>
                                        <span className={`text-sm transition-colors ${selectedDateRange === time ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>{time}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-8">
                            <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#FF2E7E] uppercase mb-6">STATUS</h3>
                            <div className="space-y-4">
                                {["All statuses", "Active", "Resolved"].map((status, i) => (
                                    <label key={status} onClick={() => setSelectedStatus(status)} className="flex items-center gap-3 group cursor-pointer">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedStatus === status ? 'bg-[#FF2E7E] border-[#FF2E7E]' : 'border-white/20 group-hover:border-white/40'}`}>
                                            {selectedStatus === status && <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>}
                                        </div>
                                        <span className={`text-sm transition-colors ${selectedStatus === status ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>{status}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* RESULTS GRID */}
                    <div className="lg:col-span-9">
                        <div className="flex items-center justify-between mb-8 px-2">
                            <p className="text-gray-500 text-sm font-medium">{reports.length} reports found</p>

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
                            {loading ? (
                                <div className="col-span-full py-20 text-center text-gray-500">Scanning frequency records...</div>
                            ) : reports.length === 0 ? (
                                <div className="col-span-full py-20 text-center text-gray-500">No reports found matching your criteria.</div>
                            ) : reports.map((report) => (
                                <Link
                                    key={report.id}
                                    to={`/item/${report.id}`}
                                    state={{ context: 'browse' }}
                                    className="group bg-[#0c0c0c] border border-white/10 rounded-[32px] p-5 hover:border-[#FF2E7E]/30 transition-all duration-500 cursor-pointer flex flex-col relative overflow-hidden"
                                >
                                    {/* Action Button on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8 z-10">
                                        <div className="px-6 py-2.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
                                            View Details
                                        </div>
                                    </div>

                                    {/* Tag */}
                                    <div className="flex mb-4 text-left">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${report.status === 'active' ? (report.type === 'found' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500') : 'bg-blue-500/10 text-blue-500'}`}>
                                            {report.status === 'returned' || report.status === 'resolved' ? 'RESOLVED' : report.status}
                                        </span>
                                    </div>

                                    {/* Icon Placeholder or Image */}
                                    <div className="flex-1 flex items-center justify-center py-4 group-hover:scale-110 transition-transform duration-500">
                                        {report.image_url ? (
                                            <div className="w-full h-32 rounded-[20px] overflow-hidden border border-white/10 shadow-2xl">
                                                <img src={`${BASE_URL}/uploads/${report.image_url}`} className="w-full h-full object-cover" alt={report.item_name} />
                                            </div>
                                        ) : (
                                            <span className="text-6xl drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{getCategoryIcon(report.category)}</span>
                                        )}
                                    </div>

                                    {/* Text Content */}
                                    <div className="mt-4 pt-4 border-t border-white/5 text-left">
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FF2E7E] transition-colors">{report.item_name}</h3>
                                        <div className="flex items-center justify-between text-xs text-gray-500 font-medium tracking-tight">
                                            <span className="truncate max-w-[60%]">{report.location}</span>
                                            <span className="w-1.5 h-1.5 bg-white/10 rounded-full flex-shrink-0" />
                                            <span className="flex-shrink-0 whitespace-nowrap">{new Date(report.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
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
