import React from "react";

const safetyFeatures = [
  {
    title: "Anonymous until you choose",
    desc: "Your real name, phone, and email are never shared with another user. Full stop.",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-[#FF2E7E] mr-3"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.418 0-8 2.239-8 5v3h16v-3c0-2.761-3.582-5-8-5Z" /></svg>
    ),
  },
  {
    title: "End-to-end anonymous chat",
    desc: "All conversations happen inside FindIt. We assign anonymous labels — 'User A', 'User B'.",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-[#FF2E7E] mr-3"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" /></svg>
    ),
  },
  {
    title: "OTP-verified handoffs",
    desc: "Every exchange is confirmed with a single-use code. Nobody gets the item without it.",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-[#FF2E7E] mr-3"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
    ),
  },
];

const chatMessages = [
  { text: "Hi, I think I found your wallet near Shivajinagar station!", from: "other" },
  { text: "Really?! Can you describe what's inside?", from: "me" },
  { text: "Blue bifold, transit card and some IDs. Small scratch on the back corner?", from: "other" },
  { text: "That's definitely mine. How do we meet?", from: "me" },
  { text: "Public place — I'll confirm via FindIt OTP when we're there.", from: "other" },
];

export default function SafetySection() {
  return (
    <section className="bg-black py-16 w-full">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">        {/* Left: Safety Features */}
        <div>
          <span className="text-[#FF2E7E] font-mono tracking-widest text-xs">03 — SAFETY</span>
          <h2 className="mt-2 text-3xl md:text-5xl font-bold text-white leading-tight">YOUR PRIVACY IS THE PRODUCT.</h2>
          <p className="mt-4 text-gray-300 max-w-xl">We designed FindIt so that strangers can connect and trust each other — without ever putting anyone at risk. Every safety feature is baked into the core, not bolted on after.</p>
          <div className="mt-8 flex flex-col gap-4">
            {safetyFeatures.map((f, i) => (
              <div key={f.title} className="flex items-start bg-[#111] border border-[#232323] rounded-xl p-5 text-white">
                {f.icon}
                <div>
                  <h4 className="font-bold text-base mb-1 text-white">{f.title}</h4>
                  <p className="text-gray-300 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Right: Chat UI */}
        <div className="bg-[#111] border border-[#232323] rounded-2xl p-6 flex flex-col h-full w-full">          <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-white">Secure conversation</span>
          <span className="bg-[#FF2E7E] text-white text-xs font-bold px-3 py-1 rounded-full">ANONYMOUS</span>
        </div>
          <div className="flex-1 flex flex-col gap-3 mb-4">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${msg.from === 'me' ? 'self-end bg-[#FF2E7E] text-white' : 'self-start bg-[#232323] text-gray-100'}`}>{msg.text}</div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-auto">
            <input type="text" className="flex-1 bg-[#232323] text-white rounded-lg px-3 py-2 text-sm outline-none border border-[#232323] focus:border-[#FF2E7E]" placeholder="Type a message..." disabled />
            <button className="bg-[#FF2E7E] p-2 rounded-none text-white hover:bg-pink-600 transition-colors duration-200" disabled>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M22 2 11 13" /><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m22 2-7 20-4-9-9-4 20-7Z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
