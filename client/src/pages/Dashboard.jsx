import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import BASE_URL from "../config.js";
import toast from "react-hot-toast";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [user, setUser] = useState(null);
    const [userReports, setUserReports] = useState([]);
    const [userMatches, setUserMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    // Chat states
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [handoffCode, setHandoffCode] = useState(null);
    const [inputCode, setInputCode] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/auth");
            return;
        }

        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }

        const fetchData = async () => {
            try {
                const profileRes = await fetch(`${BASE_URL}/api/auth/profile`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const profileData = await profileRes.json();
                if (profileRes.ok) {
                    setUser(profileData.user);
                } else {
                    localStorage.removeItem("token");
                    navigate("/auth");
                    return;
                }

                const reportsRes = await fetch(`${BASE_URL}/api/reports/my-reports`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const reportsData = await reportsRes.json();
                if (reportsRes.ok) setUserReports(reportsData.reports);

                const matchesRes = await fetch(`${BASE_URL}/api/matches/user-matches`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const matchesData = await matchesRes.json();
                if (matchesRes.ok) setUserMatches(matchesData.matches);

            } catch (error) {
                console.error("Dashboard error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate, location.state]);

    useEffect(() => {
        let interval;
        if (activeTab === "chat" && selectedMatch) {
            const fetchMsgs = async () => {
                const token = localStorage.getItem("token");
                try {
                    const res = await fetch(`${BASE_URL}/api/interactions/messages/${selectedMatch.match_id}`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (res.ok) setChatMessages(data.messages);
                } catch (error) {
                    console.error("Msg fetch error:", error);
                }
            };
            fetchMsgs();
            interval = setInterval(fetchMsgs, 3000);
        }
        return () => clearInterval(interval);
    }, [activeTab, selectedMatch]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!newMessage.trim() && !selectedFile) || !selectedMatch || !user) return;

        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("match_id", selectedMatch.match_id);
        formData.append("receiver_id", selectedMatch.owner_user_id === user.id ? selectedMatch.finder_user_id : selectedMatch.owner_user_id);
        formData.append("message", newMessage);
        if (selectedFile) formData.append("file", selectedFile);

        try {
            const res = await fetch(`${BASE_URL}/api/interactions/messages`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });
            if (res.ok) {
                setNewMessage("");
                setSelectedFile(null);
            }
        } catch (error) {
            toast.error("Failed to send");
        }
    };

    const handleGenerateCode = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${BASE_URL}/api/interactions/handoff/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ match_id: selectedMatch.match_id })
            });
            const data = await res.json();
            if (res.ok) setHandoffCode(data.code);
            else toast.error(data.error);
        } catch (err) {
            toast.error("Process failed");
        }
    };

    const handleVerifyCode = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${BASE_URL}/api/interactions/handoff/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ match_id: selectedMatch.match_id, code: inputCode })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Verified!");
                setIsVerifying(false);
                setHandoffCode(null);
                navigate(0);
            } else {
                toast.error(data.error);
            }
        } catch (err) {
            toast.error("Verify failed");
        }
    };


    return (
        <div className="bg-[#050505] text-[#F5F0EB] min-h-screen pt-24 pb-20 px-4 md:px-8 font-['Inter']">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-6 h-[750px]">

                    {/* Sidebar */}
                    <div className="lg:w-[280px] bg-[#0d0d0d] border border-white/10 rounded-3xl p-6 flex flex-col">
                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-gradient-to-tr from-[#FF2D6B] to-[#FF6B35] rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl font-black">
                                {user?.name?.substring(0, 2).toUpperCase() || "??"}
                            </div>
                            <h2 className="text-xl font-bold">{user?.name || "User"}</h2>
                            <p className="text-sm text-gray-500 font-medium lowercase mt-0.5">{user?.email}</p>
                            <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-2">Verified Hub</p>
                        </div>

                        <nav className="flex-1 space-y-2">
                            {[
                                { id: "dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
                                { id: "matches", label: "My matches", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
                                { id: "chat", label: "Messages", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" }
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[15px] font-bold transition-all ${activeTab === item.id ? "bg-white/[0.03] text-[#FF2E7E]" : "text-gray-500 hover:text-white"}`}
                                >
                                    <svg className={`w-4 h-4 ${activeTab === item.id ? "text-[#FF2E7E]" : "text-gray-600"}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        <div className="pt-6 border-t border-white/5 mt-auto">
                            <div className="bg-white/[0.02] p-3 rounded-xl flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">System Online</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 bg-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
                        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">

                            {/* Dashboard Tab */}
                            {activeTab === "dashboard" && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <header>
                                        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                                        <p className="text-gray-500 text-sm mt-1">Recovery logs for {user?.name}</p>
                                    </header>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { label: "Active reports", value: userReports.length },
                                            { label: "Matches found", value: userMatches.length },
                                            { label: "Successfully Return", value: userMatches.filter(m => m.match_status === 'resolved').length }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-8">
                                                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-white/[0.01] border border-white/5 rounded-3xl overflow-hidden shadow-inner">
                                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                                            <h3 className="text-[11px] font-bold uppercase tracking-[4px] text-gray-500">Your Reports</h3>
                                            <Link to="/report-item" className="bg-[#FF2E7E] px-4 py-2  text-[13px] font-bold shadow-lg">+ New Report</Link>
                                        </div>
                                        <div className="divide-y divide-white/5">
                                            {userReports.length === 0 ? <div className="p-16 text-center text-gray-700">No reports in cache.</div> : userReports.map((report, i) => (
                                                <div key={i} className="p-8 flex items-center justify-between hover:bg-white/[0.02] transition-all group">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-14 h-14 bg-white/5 rounded-2xl overflow-hidden border border-white/5 shadow-inner">
                                                            {report.image_url ? <img src={`${BASE_URL}/uploads/${report.image_url}`} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-bold text-white mb-0.5">{report.item_name}</h4>
                                                            <div className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">{report.type} • {report.location}</div>
                                                        </div>
                                                    </div>
                                                    <Link to={`/item/${report.id}`} state={{ context: 'dashboard' }} className="px-4 py-2 border border-white/10 rounded-xl text-[10px] font-black text-gray-500 hover:text-white transition-all uppercase tracking-widest">Details</Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* My Matches Tab */}
                            {activeTab === "matches" && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <h2 className="text-2xl font-bold">My Matches</h2>
                                    <div className="grid gap-6">
                                        {userMatches.length === 0 ? <div className="p-24 text-center text-gray-700">Awaiting match verification.</div> : userMatches.map((match, i) => (
                                            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-10 group hover:border-[#FF2E7E]/40 transition-all">
                                                <div className="w-32 h-32 bg-white/5 rounded-2xl overflow-hidden shadow-2xl relative border border-white/5">
                                                    {match.matched_image ? <img src={`${BASE_URL}/uploads/${match.matched_image}`} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>}
                                                </div>
                                                <div className="flex-1 text-center md:text-left">
                                                    <h3 className="text-xl font-bold mb-1 text-white">{match.matched_item}</h3>
                                                    <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest font-bold">{match.matched_type} • {match.matched_location}</p>
                                                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                                                        <div className="h-full bg-[#FF2E7E]" style={{ width: `${match.similarity_score}%` }} />
                                                    </div>
                                                    <div className="text-[10px] font-bold text-gray-500 mt-2 uppercase tracking-widest">Similarity Factor: {match.similarity_score}%</div>
                                                </div>
                                                <div className="flex gap-4">
                                                    <button onClick={() => { setSelectedMatch(match); setActiveTab('chat'); }} disabled={match.match_status === 'resolved'} className={`px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${match.match_status === 'resolved' ? "bg-gray-800 text-gray-400" : "bg-[#FF2E7E] text-white hover:bg-[#C30052]"}`}>Relay</button>
                                                    <Link to={`/item/${match.matched_report_id}`} state={{ context: 'match', matchData: match }} className="px-6 py-3 border border-white/10 text-xs font-bold uppercase rounded-xl hover:text-white transition-all text-center">Details</Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Chat Tab - Messages */}
                            {activeTab === "chat" && (
                                <div className="h-full flex flex-col animate-in zoom-in-95 duration-500 bg-white/[0.01] rounded-[28px] border border-white/5 overflow-hidden">
                                    <div className="flex flex-1 overflow-hidden h-full">
                                        <div className="w-47 border-r border-white/5 hidden md:flex flex-col bg-white/[0.01]">
                                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Channels</span>
                                                <span className="text-[9px] font-bold px-2 py-1 bg-white/5 rounded-lg">{userMatches.length}</span>
                                            </div>
                                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                                {userMatches.map(m => (
                                                    <div key={m.match_id} onClick={() => setSelectedMatch(m)} className={`p-8 cursor-pointer border-l-4 transition-all ${selectedMatch?.match_id === m.match_id ? "bg-[#FF2D6B]/5 border-[#FF2E7E] text-white font-bold" : "border-transparent text-gray-500 hover:bg-white/5"}`}>
                                                        <h4 className="text-sm tracking-tight mb-1">{m.matched_item}</h4>
                                                        <div className="text-[9px] font-bold opacity-50 uppercase">Ref ID: {String(m.match_id).substring(0, 8)}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col relative bg-gradient-to-b from-white/[0.01] to-transparent">
                                            {selectedMatch ? (
                                                <>
                                                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF2D6B] to-[#FF6B35] flex items-center justify-center font-black text-white text-xs">
                                                                {selectedMatch.matched_item.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-[15px] uppercase tracking-wide text-white leading-tight">{selectedMatch.matched_item}</h4>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Encrypted Relay</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => setIsVerifying(true)} disabled={selectedMatch.match_status === 'resolved'} className={`px-4 py-2 border border-white/10 rounded-xl text-[10px] font-bold uppercase transition-all ${selectedMatch.match_status === 'resolved' ? "opacity-30" : "text-[#FF2E7E] hover:bg-[#FF2E7E] hover:text-black border-[#FF2E7E]/30"}`}>
                                                            {selectedMatch.match_status === 'resolved' ? "Closed" : "Handoff Token"}
                                                        </button>
                                                    </div>

                                                    <div className="flex-1 p-8 overflow-y-auto space-y-6 custom-scrollbar bg-black/20 relative">
                                                        {selectedMatch.match_status === 'resolved' && (
                                                            <div className="mx-auto max-w-sm text-center p-8 bg-green-500/5 border border-green-500/20 rounded-[32px] mb-8">
                                                                <div className="text-green-500 text-[10px] font-black uppercase tracking-widest mb-1 leading-none">Success</div>
                                                                <h4 className="text-white font-bold text-lg">Inventory Recovered</h4>
                                                            </div>
                                                        )}

                                                        {chatMessages?.map((msg, i) => (
                                                            <div key={i} className={`flex flex-col gap-2 ${msg.sender_id === user?.id ? "items-end" : "items-start"}`}>
                                                                {msg.file_url && (
                                                                    <div className={`max-w-[70%] border border-white/5 rounded-2xl overflow-hidden shadow-2xl bg-[#111] p-1 ${msg.sender_id === user?.id ? "rounded-tr-none" : "rounded-tl-none"}`}>
                                                                        {msg.file_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                                                            <img src={`${BASE_URL}/uploads/chat_files/${msg.file_url}`} className="max-w-full max-h-[350px] object-cover rounded-xl" />
                                                                        ) : (
                                                                            <a href={`${BASE_URL}/uploads/chat_files/${msg.file_url}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-8 bg-white/5 text-[10px] font-bold uppercase text-white hover:text-[#FF2E7E]">
                                                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">📂</div>
                                                                                <span>Download Asset</span>
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                {msg.message && (
                                                                    <div className={`p-4 rounded-[22px] text-[14px] font-medium leading-relaxed max-w-[80%] shadow-lg ${msg.sender_id === user?.id ? "bg-[#FF2E7E] text-white rounded-tr-none shadow-md" : "bg-[#181818] text-[#F5F0EB] border border-white/5 rounded-tl-none"}`}>
                                                                        <p>{msg.message}</p>
                                                                    </div>
                                                                )}
                                                                <span className="text-[8px] text-gray-700 font-bold uppercase mt-1">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            </div>
                                                        ))}

                                                        {isVerifying && (
                                                            <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-10 z-50">
                                                                <div className="max-w-xs w-full bg-[#111] border border-[#FF2E7E]/30 p-12 rounded-[56px] text-center shadow-2xl relative">
                                                                    <h3 className="text-xl font-bold uppercase tracking-[8px] text-white mb-8 leading-none">Trust Token</h3>
                                                                    {user?.id === selectedMatch.owner_user_id ? (
                                                                        <div className="space-y-10">
                                                                            <p className="text-[11px] text-gray-600 font-bold uppercase tracking-wider">Provide this to the finder</p>
                                                                            {handoffCode ? (
                                                                                <div className="text-5xl font-black text-[#FF2E7E] bg-white/5 py-8 rounded-[32px] tracking-[5px] animate-pulse">{handoffCode}</div>
                                                                            ) : (
                                                                                <button onClick={handleGenerateCode} className="w-full py-5 bg-[#FF2E7E] text-white font-bold uppercase tracking-widest text-[11px] rounded-[32px] shadow-2xl">Generate Code</button>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="space-y-10">
                                                                            <p className="text-[11px] text-gray-600 font-bold uppercase tracking-wider">Enter owner's token</p>
                                                                            <input type="text" maxLength="6" value={inputCode} onChange={e => setInputCode(e.target.value)} className="w-full bg-black border border-white/10 rounded-[32px] py-8 text-center text-4xl font-black outline-none focus:border-[#FF2E7E] text-white tracking-[15px]" placeholder="000000" />
                                                                            <button onClick={handleVerifyCode} className="w-full py-5 bg-[#FF2E7E] text-white font-black uppercase tracking-widest text-[11px] rounded-[32px] shadow-2xl">Authorise Relay</button>
                                                                        </div>
                                                                    )}
                                                                    <button onClick={() => { setIsVerifying(false); setHandoffCode(null); }} className="mt-10 text-[9px] font-bold text-gray-700 uppercase tracking-[6px] hover:text-white">Abort Relay</button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="p-6 bg-white/[0.02] border-t border-white/5">
                                                        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-4 p-2.5 bg-[#050505] border border-white/10 rounded-[32px] focus-within:border-[#FF2E7E]/50 transition-all group items-center">
                                                            <label className="w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-white/5 rounded-2xl transition-all flex-shrink-0">
                                                                <input type="file" className="hidden" onChange={e => setSelectedFile(e.target.files[0])} />
                                                                <svg className={`w-5 h-5 transition-colors ${selectedFile ? 'text-[#FF2E7E]' : 'text-gray-500'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                            </label>
                                                            <input className="flex-1 bg-transparent px-2 text-[15px] outline-none placeholder:text-gray-700 font-medium h-full" placeholder="Transmit secure message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} />
                                                            <button type="submit" className="w-12 h-12 flex items-center justify-center bg-gradient-to-tr from-[#FF2E7E] to-[#FF4B8B] text-white rounded-2xl shadow-[0_4px_15px_rgba(255,46,126,0.3)] hover:shadow-[0_6px_20px_rgba(255,46,126,0.4)] hover:scale-105 active:scale-95 transition-all flex-shrink-0 border border-white/10">
                                                                <svg className="w-5 h-5 transform rotate-45 -mt-0.5 -mr-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M22 2 11 13" /><path d="m22 2-7 20-4-9-9-4 20-7z" /></svg>
                                                            </button>
                                                        </form>
                                                        {selectedFile && <div className="mt-3 ml-20 text-[9px] font-bold text-[#FF2E7E] uppercase tracking-widest flex items-center gap-2">Ready for relay: {selectedFile.name} <button onClick={() => setSelectedFile(null)} className="text-gray-600 hover:text-white">✕</button></div>}
                                                    </div>
                                                </>
                                            ) : <div className="flex-1 flex items-center justify-center text-gray-800 text-xs font-black uppercase tracking-[15px] p-20 text-center animate-pulse">Select a relay channel</div>}
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

