import React, { useState } from "react";
import { Link } from "react-router-dom";

const faqs = [
    {
        question: "Is FindIt free to use?",
        answer: "Yes — completely. Reporting lost or found items, browsing all listings, getting AI matches, and chatting with finders is 100% free. We may offer premium features in the future, but the core service will always remain free.",
    },
    {
        question: "How does the AI matching actually work?",
        answer: "We convert your item description and photo into mathematical embeddings — think of them as unique fingerprints made of numbers. We then compare your fingerprint to every found-item report in our database using cosine similarity, which measures how close two fingerprints are. The result is a percentage match score. This works even when descriptions use completely different words.",
    },
    {
        question: "Is my personal information safe?",
        answer: "Completely. We never share your real name, phone number, or email address with another user. All communication happens inside FindIt's anonymous chat system. You stay anonymous until you personally and deliberately choose to share your details — and even then, only with people you've specifically chosen."
    },
    {
        question: "How does the OTP handoff work?",
        answer: "When you've agreed to meet in person, FindIt generates a 6-digit one-time code that's only valid for 30 minutes. The person returning the item enters this code into the app to confirm the exchange took place. This prevents fraud and ensures the item goes to the right person. Never hand over an item without the OTP being confirmed in the app first."
    },
    {
        question: "Do I need an account to report a found item?",
        answer: "You'll need a basic account so the owner can reach you securely through our anonymous chat. Registration takes under 30 seconds — just an email and password, or sign in with Google. We keep it minimal on purpose."
    },
];

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className={`border-b border-white/5 transition-all duration-300 ${isOpen ? 'bg-white/[0.02]' : ''}`}>
            <button
                className="w-full py-6 px-8 flex items-center justify-between text-left group"
                onClick={onClick}
            >
                <span className={`text-lg font-bold tracking-tight transition-colors duration-300 ${isOpen ? 'text-[#FF2E7E]' : 'text-gray-300 group-hover:text-white'}`}>
                    {question}
                </span>
                <span className={`text-2xl transition-transform duration-500 ${isOpen ? 'rotate-180 text-[#FF2E7E]' : 'rotate-0 text-gray-500'}`}>
                    ↓
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="px-8 pb-8 text-gray-400 leading-relaxed text-[15px]">
                    {answer}
                </p>
            </div>
        </div>
    );
};

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="bg-black text-white min-h-screen pt-17 border-t border-white/5 relative">
            <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start relative z-10">

                {/* Left Side: Static Info */}
                <div className="lg:sticky lg:top-32">
                    <span className="text-[#FF2E7E] font-bold tracking-[0.2em] text-[10px] uppercase block mb-4">
                        HELP
                    </span>
                    <h2 className="text-4xl md:text-7xl font-bold text-white uppercase tracking-tight leading-none mb-10">
                        FREQUENTLY <br /> ASKED <br /> QUESTIONS
                    </h2>
                    <p className="text-gray-400 text-lg mb-12 max-w-md leading-relaxed">
                        Can't find an answer here? Reach out to our team directly. We're here to help you get your things back.
                    </p>
                    <Link to="/contact" className="inline-block px-8 py-3 mt-0 bg-[#FF2E7E] text-black font-extrabold uppercase tracking-widest text-xs rounded-lg shadow-[0_10px_30px_rgba(255,46,126,0.2)] hover:bg-pink-600 hover:scale-105 transition-all duration-300 text-center">
                        CONTACT US
                    </Link>
                </div>

                {/* Right Side: Accordion */}
                <div className="bg-[#080808] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                        />
                    ))}
                </div>

            </div>

            {/* Background Decorative Glow */}
            <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#FF2E7E] opacity-[0.03] blur-[150px] pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#FF2E7E] opacity-[0.02] blur-[150px] pointer-events-none" />
        </div>
    );
}
