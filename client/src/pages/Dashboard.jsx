import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");

    const reports = [
        { name: "Blue leather wallet", meta: "LOST • SHIVAJINAGAR • APR 3", status: "7 matches", statusType: "matched", dotColor: "var(--lost)" },
        { name: "House keys (Honda keychain)", meta: "LOST • BANER • APR 1", status: "Searching", statusType: "searching", dotColor: "var(--lost)" },
        { name: "Samsung phone (found & returned)", meta: "FOUND • FC ROAD • MAR 28", status: "Returned", statusType: "returned", dotColor: "var(--found)" },
    ];

    const stats = [
        { label: "Active reports", value: "3" },
        { label: "New matches", value: "7" },
        { label: "Items returned", value: "2" },
    ];

    const matches = [
        { id: 101, title: "Blue bifold wallet", meta: "FOUND • SHIVAJINAGAR STATION • REPORTED APR 4", score: 91, icon: "💼" },
        { id: 102, title: "Leather wallet, dark blue", meta: "FOUND • FC ROAD • REPORTED APR 3", score: 74, icon: "👛" },
        { id: 103, title: "Navy wallet with ID cards", meta: "FOUND • KOREGAON PARK • REPORTED APR 2", score: 58, icon: "📒" },
    ];

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: <rect x="3" y="3" width="7" height="7" /> },
        { id: "matches", label: "My matches", icon: <><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></> },
        { id: "chat", label: "Messages", icon: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /> },
        { id: "profile", label: "Profile", icon: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></> },
        { id: "notifications", label: "Notifications", icon: <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></> },
    ];

    const messages = [
        { id: 1, sender: "Anonymous Finder", text: "Hi, I think I found your wallet near Shivajinagar station!", time: "10:30 AM", type: "them" },
        { id: 2, sender: "Me", text: "Really?! Can you describe what's inside?", time: "10:32 AM", type: "me" },
        { id: 3, sender: "Anonymous Finder", text: "Blue bifold, transit card and some IDs. Small scratch on the back corner?", time: "10:35 AM", type: "them" },
        { id: 4, sender: "Me", text: "That's definitely mine. How do we meet?", time: "10:36 AM", type: "me" },
    ];

    return (
        <div className="bg-[#050505] text-[#F5F0EB] min-h-screen pt-24 pb-20 px-4 md:px-8 font-['Inter']">
            <div className="max-w-6xl mx-auto">

                <div className="flex flex-col lg:flex-row gap-6 items-stretch h-[800px] font-['Inter']">
                    {/* Sidebar Panel */}
                    <div className="lg:w-[280px] flex flex-col bg-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all hover:border-white/20">
                        {/* User Block */}
                        <div className="p-8 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#FF2D6B] to-[#FF6B35] flex items-center justify-center text-2xl font-black mb-5 shadow-[0_0_30px_rgba(255,45,107,0.3)] transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                                    PK
                                </div>
                                <h2 className="text-xl font-bold tracking-tight font-['Inter']">Priya Kulkarni</h2>
                                <p className="text-[12px] text-gray-500 mb-5 font-['JetBrains_Mono'] uppercase tracking-[2px]">ID: 8429-PX</p>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF2D6B]/10 border border-[#FF2D6B]/20 rounded-full text-[11px] font-bold text-[#FF2E7E] uppercase tracking-widest font-['Inter']">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E7E] animate-pulse" />
                                    PRO MEMBER
                                </div>
                            </div>
                        </div>

                        {/* Dash Nav */}
                        <div className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                            <div className="px-5 py-3 text-[11px] font-bold text-gray-600 uppercase tracking-[4px] mb-2 font-['Inter']">Menu</div>
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-4 px-6 py-3 rounded-2xl text-[14px] font-semibold transition-all duration-300 relative group ${activeTab === item.id
                                        ? "bg-white/[0.03] text-[#FF2E7E] shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]"
                                        : "text-gray-500 hover:text-white hover:bg-white/[0.02]"
                                        }`}
                                >
                                    {activeTab === item.id && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-[#FF2E7E] rounded-r-full shadow-[0_0_20px_#FF2E7E]" />
                                    )}
                                    <div className={`transition-transform group-hover:scale-110 ${activeTab === item.id ? "text-[#FF2E7E]" : "text-gray-600"}`}>
                                        {item.id === 'dashboard' && (
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></svg>
                                        )}
                                        {item.id === 'matches' && (
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 21l-4.35-4.35M19 11a8 8 0 11-16 0 8 8 0 0116 0zM11 8v6M8 11h6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        )}
                                        {item.id === 'chat' && (
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-7.6-11.7 8.38 8.38 0 013.8.9L22 4l-1.5 6.5z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        )}
                                        {item.id === 'profile' && (
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        )}
                                        {item.id === 'notifications' && (
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        )}
                                    </div>
                                    <span className="font-['Inter'] tracking-tight">{item.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Sidebar Footer */}
                        <div className="p-6 border-t border-white/5 bg-white/[0.01]">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest font-['Inter']">System Protocol Online</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col bg-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative transition-all hover:border-white/20 h-full">
                        {/* Tab Header Decoration */}
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-white">
                            <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                                <circle cx="150" cy="50" r="100" stroke="currentColor" strokeWidth="1" strokeDasharray="10 10" />
                            </svg>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 md:p-10 custom-scrollbar h-full">
                            {/* 1. OVERVIEW TAB */}
                            {activeTab === "dashboard" && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
                                    <header>
                                        <h2 className="text-2xl font-bold tracking-tight mb-2 font-['Inter']">Activity Hub</h2>
                                        <p className="text-gray-400 text-[15px] leading-relaxed font-['Inter']">Welcome back, Priya. Here's what's happening today.</p>
                                    </header>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {stats.map((stat) => (
                                            <div key={stat.label} className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 transition-all hover:border-[#FF2E7E]/40 hover:bg-white/[0.04] group relative overflow-hidden">
                                                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#FF2E7E]/5 rounded-full blur-3xl group-hover:bg-[#FF2E7E]/10 transition-colors" />
                                                <div className="text-5xl font-black mb-3  group-hover:text-[#FF2E7E] transition-colors relative z-10">{stat.value}</div>
                                                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest relative z-10 font-['Inter'] leading-relaxed">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-white/[0.01] border border-white/5 rounded-3xl overflow-hidden shadow-sm">
                                        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.02]">
                                            <div className="flex items-center gap-4">
                                                <div className="w-1.5 h-8 bg-[#FF2E7E] rounded-full" />
                                                <h3 className="text-base font-bold uppercase tracking-wider font-['Inter']">Active Reports</h3>
                                            </div>
                                            <Link to="/report-item" className="px-5 py-2.5 bg-[#FF2D6B] text-white text-[12px] font-bold uppercase tracking-wide rounded-xl hover:bg-[#C30052] transition-all hover:scale-105 active:scale-95 shadow-[0_10px_20px_rgba(255,45,107,0.2)] font-['Inter']">
                                                + Create Report
                                            </Link>
                                        </div>
                                        <div className="divide-y divide-white/5">
                                            {reports.map((report, i) => (
                                                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 hover:bg-white/[0.03] transition-all group cursor-pointer border-l-4 border-transparent hover:border-l-[#FF2E7E]">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">
                                                            {report.name.toLowerCase().includes('wallet') ? '💼' : report.name.toLowerCase().includes('keys') ? '🔑' : '🔍'}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-bold mb-1 group-hover:text-[#FF2E7E] transition-colors leading-tight font-['Inter']">{report.name}</h4>
                                                            <div className="text-[12px] font-black text-gray-500 uppercase tracking-[2px] font-['JetBrains_Mono'] opacity-70 leading-relaxed font-['Inter']">{report.meta}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <span className={`px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-[2px] border transition-all font-['Inter'] ${report.statusType === 'matched' ? 'bg-[#FF2E7E]/10 text-[#FF2E7E] border-[#FF2E7E]/30 shadow-[0_0_15px_rgba(255,46,126,0.1)]' :
                                                            report.statusType === 'searching' ? 'bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/30 shadow-[0_0_15px_rgba(255,107,53,0.1)]' :
                                                                'bg-[#00E5A0]/10 text-[#00E5A0] border-[#00E5A0]/30 shadow-[0_0_15px_rgba(0,229,160,0.1)]'
                                                            }`}>
                                                            {report.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 2. MATCHES TAB */}
                            {activeTab === "matches" && (
                                <div className="space-y-8 animate-in slide-in-from-right-4 duration-700">
                                    <header className="flex items-center justify-between mb-10">
                                        <div>
                                            <h2 className="text-2xl font-bold tracking-tight mb-2 font-['Inter']">Smart Matches</h2>
                                            <p className="text-gray-400 text-[15px] leading-relaxed font-['Inter']">We've found these items that match your reports. Review similarity scores below.</p>
                                        </div>
                                        <div className="p-4 bg-[#FF2E7E]/10 rounded-2xl border border-[#FF2E7E]/20 flex items-center gap-3">
                                            <span className="text-xl animate-bounce">⚡</span>
                                            <span className="text-[11px] font-black text-[#FF2E7E] uppercase tracking-widest font-['Inter']">AI Assisted</span>
                                        </div>
                                    </header>

                                    <div className="grid gap-6">
                                        {matches.map((item) => (
                                            <div key={item.id} className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-10 group hover:border-[#FF2E7E]/40 transition-all hover:bg-white/[0.04]">
                                                <div className="w-32 h-32 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform shadow-2xl relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#FF2E7E]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    {item.icon}
                                                </div>
                                                <div className="flex-1 text-center md:text-left">
                                                    <div className="inline-block px-3 py-1 bg-[#FF2E7E]/10 rounded-full text-[10px] font-black text-[#FF2E7E] uppercase tracking-widest mb-3 font-['Inter'] shadow-[0_0_10px_rgba(255,46,126,0.1)]">Verified Spot</div>
                                                    <h4 className="text-xl font-bold mb-2 group-hover:text-[#FF2E7E] transition-colors leading-tight font-['Inter']">{item.title}</h4>
                                                    <div className="text-[11px] font-black text-gray-500 uppercase tracking-[2px] mb-6 leading-relaxed font-['Inter']">{item.meta}</div>
                                                    <div className="w-full max-w-md mx-auto md:mx-0">
                                                        <div className="flex justify-between items-end mb-2">
                                                            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-['Inter']">Match Quality</div>
                                                            <div className="text-lg font-black text-[#FF2E7E] ">{item.score}%</div>
                                                        </div>
                                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                                                            <div className="h-full bg-gradient-to-r from-[#FF2E7E]/50 to-[#FF2E7E] rounded-full transition-all duration-1000 shadow-[0_0_10px_#FF2E7E]" style={{ width: `${item.score}%` }} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-3 min-w-[200px]">
                                                    <button className="w-full py-3 bg-[#FF2D6B] text-white text-[12px] font-bold uppercase tracking-wide rounded-2xl hover:bg-[#C30052] transition-all hover:shadow-[0_10px_20px_rgba(255,45,107,0.3)] hover:-translate-y-1 font-['Inter']">Connect Now</button>
                                                    <button className="w-full py-3 border border-white/10 text-gray-400 text-[12px] font-bold uppercase tracking-wide rounded-2xl hover:border-white hover:text-white transition-all bg-white/[0.01] font-['Inter']">Full Details</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 3. CHAT TAB */}
                            {activeTab === "chat" && (
                                <div className="h-full flex flex-col animate-in zoom-in-95 duration-700 bg-white/[0.01] rounded-3xl border border-white/5 shadow-inner overflow-hidden">
                                    <div className="flex flex-1 overflow-hidden">
                                        {/* Chat Sidebar */}
                                        <div className="w-64 border-r border-white/5 hidden md:flex flex-col bg-white/[0.01]">
                                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                                <span className="font-black uppercase text-[12px] tracking-[4px] text-gray-500 font-['Inter']">Inbox</span>
                                                <span className="px-2 py-1 bg-white/5 rounded-lg text-[11px] text-[#FF2E7E] font-bold font-['Inter'] border border-[#FF2E7E]/20">2</span>
                                            </div>
                                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                                <div className="p-6 bg-[#FF2D6B]/5 border-l-4 border-[#FF2E7E] cursor-pointer relative group transition-all">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="text-[14px] font-bold  tracking-tight">Anonymous Finder</div>
                                                        <span className="w-2 h-2 bg-[#FF2E7E] rounded-full shadow-[0_0_10px_#FF2E7E]" />
                                                    </div>
                                                    <p className="text-[12px] text-gray-400 font-medium truncate mb-1 font-['Inter'] leading-relaxed">I found your wallet near Shivajinagar...</p>
                                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest font-['Inter']">Updated 2m ago</span>
                                                </div>
                                                <div className="p-6 hover:bg-white/[0.03] cursor-pointer border-l-4 border-transparent transition-all opacity-50 gray-scale hover:grayscale-0 hover:opacity-100">
                                                    <div className="text-[14px] font-bold  tracking-tight mb-2">Community Guide</div>
                                                    <p className="text-[12px] text-gray-500 font-medium truncate mb-1 font-['Inter'] leading-relaxed">Matched 3 days ago...</p>
                                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest font-['Inter']">3 days ago</span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Chat Area */}
                                        <div className="flex-1 flex flex-col bg-gradient-to-b from-white/[0.01] to-transparent">
                                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF2D6B] to-[#FF6B35] flex items-center justify-center font-black text-sm text-white shadow-lg">AF</div>
                                                    <div>
                                                        <div className="text-[15px] font-semibold uppercase tracking-wide font-['Inter'] text-white leading-tight">Anonymous Finder</div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                            <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase font-['Inter']">Encryption Active</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="px-4 py-2 border border-white/10 rounded-xl text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-white hover:border-white transition-all font-['Inter']">Report User</button>
                                            </div>
                                            <div className="flex-1 p-8 overflow-y-auto space-y-6 custom-scrollbar">
                                                {messages.map((msg) => (
                                                    <div key={msg.id} className={`flex ${msg.type === 'me' ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`max-w-[70%] p-5 rounded-2xl text-[14px] font-medium leading-relaxed shadow-xl transform transition-transform hover:scale-[1.02] ${msg.type === 'me' ? 'bg-[#FF2E7E] text-white rounded-tr-none shadow-[0_10px_30px_rgba(255,46,126,0.2)]' : 'bg-[#1c1c1c] text-white border border-white/5 rounded-tl-none'
                                                            }`}>
                                                            <p className="font-['Inter'] leading-relaxed">{msg.text}</p>
                                                            <div className={`text-[10px] mt-3 opacity-50 font-bold tracking-widest font-['Inter'] ${msg.type === 'me' ? 'text-right' : 'text-left'}`}>{msg.time}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="p-8 bg-white/[0.02] border-t border-white/5">
                                                <div className="flex gap-4 p-2.5 bg-[#050505] border border-white/10 rounded-2xl focus-within:border-[#FF2E7E] transition-all">
                                                    <input className="flex-1 bg-transparent px-4 text-[14px] outline-none placeholder:text-gray-600 font-['Inter']" placeholder="Type a message privately..." />
                                                    <button className="p-3 bg-[#FF2E7E] text-white rounded-xl shadow-[0_5px_15px_rgba(255,45,107,0.3)] hover:scale-105 active:scale-95 transition-all">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                                            <path d="M22 2 11 13" /><path d="m22 2-7 20-4-9-9-4 20-7z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 4. PROFILE TAB */}
                            {activeTab === "profile" && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
                                    <header>
                                        <h2 className="text-2xl font-bold mb-2 font-['Inter']">My Profile</h2>
                                        <p className="text-gray-400 text-[15px] leading-relaxed font-['Inter']">Manage your personal identity and security settings.</p>
                                    </header>

                                    <div className="bg-gradient-to-r from-[#FF2D6B]/10 to-[#FF6B35]/10 border border-white/10 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10">
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#FF2D6B] to-[#FF6B35] flex items-center justify-center text-3xl font-black shadow-[0_15px_40px_rgba(255,45,107,0.4)] relative z-10 text-white">
                                                PK
                                            </div>
                                        </div>

                                        <div className="text-center md:text-left">
                                            <h2 className="text-xl font-bold mb-1 font-['Inter']">Priya Kulkarni</h2>
                                            <p className="text-[13px] text-gray-500 font-black uppercase tracking-[3px] mb-6 font-['Inter'] font-semibold leading-relaxed">Pune, India • Joined Jan 2025</p>

                                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[11px] font-bold text-[#FF2E7E] uppercase tracking-widest flex items-center gap-2 font-['Inter'] shadow-sm">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E7E]" />
                                                    4.8 Trust Score
                                                </div>
                                                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[11px] font-bold text-green-400 uppercase tracking-widest flex items-center gap-2 font-['Inter'] shadow-sm">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                                    Identity Verified
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:border-[#FF2E7E]/40 transition-all group">
                                            <div className="flex items-center gap-4 mb-8 text-white">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">🛡️</div>
                                                <h3 className="text-[13px] font-bold uppercase tracking-widest text-gray-400 font-['Inter']">Security</h3>
                                            </div>
                                            <div className="space-y-4">
                                                {[
                                                    { label: "Email Verification", val: "Verified", color: "text-green-400" },
                                                    { label: "Phone Auth", val: "Setup Pending", color: "text-yellow-400" },
                                                    { label: "Two-Factor Auth", val: "Disabled", color: "text-red-400" }
                                                ].map((row, i) => (
                                                    <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 border-white/5 font-['Inter']">
                                                        <span className="text-[14px] font-bold text-gray-500">{row.label}</span>
                                                        <span className={`text-[12px] font-black uppercase tracking-widest ${row.color}`}>{row.val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:border-[#FF2E7E]/40 transition-all group">
                                            <div className="flex items-center gap-4 mb-8 text-white">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">👤</div>
                                                <h3 className="text-[13px] font-bold uppercase tracking-widest text-gray-400 font-['Inter']">Account Details</h3>
                                            </div>
                                            <div className="space-y-4">
                                                {[
                                                    { label: "Legal Name", val: "Priya Kulkarni" },
                                                    { label: "Public Handle", val: "@priya_k" },
                                                    { label: "Primary Email", val: "priya@example.com" }
                                                ].map((row, i) => (
                                                    <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 border-white/5 font-['Inter']">
                                                        <span className="text-[14px] font-bold text-gray-500">{row.label}</span>
                                                        <span className="text-[14px] font-black text-white">{row.val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4 mt-8">
                                        <button className="px-6 py-3 border border-white/10 rounded-2xl text-[12px] font-bold uppercase tracking-wide hover:border-white transition-all font-['Inter']">Edit Details</button>
                                        <button className="px-6 py-3 bg-[#FF2D6B] text-white text-[12px] font-bold uppercase tracking-wide rounded-2xl shadow-xl hover:bg-[#C30052] transition-all font-['Inter']">Save Changes</button>
                                    </div>
                                </div>
                            )}

                            {/* 5. NOTIFICATIONS TAB */}
                            {activeTab === "notifications" && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700 font-['Inter']">
                                    <header>
                                        <h2 className="text-2xl font-bold tracking-tight mb-2 font-['Inter']">Notification Hub</h2>
                                        <p className="text-gray-400 text-[15px] leading-relaxed">Control how and when you receive matches and updates.</p>
                                    </header>

                                    <div className="bg-white/[0.01] border border-white/5 rounded-3xl divide-y divide-white/5 overflow-hidden">
                                        {[
                                            { label: "Intelligent Matches", desc: "Get notified immediately when highly probable matches are detected." },
                                            { label: "Direct Messages", desc: "Alerts for new messages from finders or owners." },
                                            { label: "Status Updates", desc: "Track progress of your reported items in real-time." },
                                            { label: "Marketing Alerts", desc: "Updates about platform features and local safety news.", off: true }
                                        ].map((opt, i) => (
                                            <div key={i} className="p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:bg-white/[0.02] transition-all">
                                                <div>
                                                    <h4 className="font-bold text-lg mb-2 group-hover:text-[#FF2E7E] transition-colors font-['Inter'] leading-none">{opt.label}</h4>
                                                    <p className="text-[14px] text-gray-400 font-medium tracking-wide max-w-md leading-relaxed">{opt.desc}</p>
                                                </div>
                                                <div className={`w-16 h-8 rounded-full p-1.5 cursor-pointer transition-all duration-300 relative ${opt.off ? 'bg-white/5' : 'bg-[#FF2E7E]'}`}>
                                                    <div className={`w-5 h-5 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-transform duration-300 ${opt.off ? '' : 'translate-x-8'}`} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-8 bg-[#FF2E7E]/5 border border-[#FF2E7E]/20 rounded-3xl flex flex-col md:flex-row gap-6 items-center">
                                        <div className="w-16 h-16 rounded-2xl bg-[#FF2E7E]/10 flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">🔔</div>
                                        <div>
                                            <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#FF2E7E] mb-2 font-['Inter'] leading-tight">Push Notification Engine</h4>
                                            <p className="text-[14px] text-gray-400 font-medium leading-relaxed font-['Inter']">Our real-time notification engine ensures you never miss a match. We recommend keeping "Intelligent Matches" enabled for the fastest recovery of your belongings.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
