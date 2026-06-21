import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, MessageSquare, Zap, Activity, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const AIAssistant = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const user = localStorage.getItem('user');
        if (!user) {
            navigate('/login', { state: { initialMessage: inputValue } });
            return;
        }

        navigate('/ai-chat', { state: { initialMessage: inputValue } });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleQuickQuestion = (question) => {
        const user = localStorage.getItem('user');
        if (!user) {
            navigate('/login', { state: { initialMessage: question } });
            return;
        }
        navigate('/ai-chat', { state: { initialMessage: question } });
    };

    return (
        <section id="ai-assistant" className="py-24 bg-linear-to-br from-primary to-blue-800 text-white overflow-hidden relative">
            {/* Decorative patterns */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 border-4 border-white rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 border-8 border-white rounded-full opacity-20"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6">
                            <Bot size={20} />
                            <span className="text-sm font-bold uppercase tracking-wider">AI Integration</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-extrabold mb-8 leading-tight">
                            AI-Powered Symptoms Analysis
                        </h2>
                        <div className="space-y-6">
                            {[
                                { icon: MessageSquare, title: "Chat with AI", desc: "Instantly describe your symptoms to our intelligent assistant." },
                                { icon: Zap, title: "Quick Results", desc: "Get immediate preliminary analysis and recommendations." },
                                { icon: Activity, title: "24/7 Availability", desc: "Our AI is always ready to help you, anytime." }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="bg-white/10 p-3 rounded-xl h-fit">
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                                        <p className="text-blue-100">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Questions */}
                        <div className="mt-8">
                            <p className="text-blue-100 mb-3">Try asking:</p>
                            <div className="flex flex-wrap gap-2">
                                {['Headache for 2 days', 'Fever and cough', 'Stomach pain', 'Skin rash'].map((question, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleQuickQuestion(question)}
                                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="relative"
                    >

                        <div className="glass p-6 rounded-3xl shadow-2xl relative z-10 flex flex-col h-[500px]">
                            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-200">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                                    <Bot size={28} className="text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">As'alny Assistant</h4>
                                    <p className="text-xs text-slate-500">Always online</p>
                                </div>
                            </div>

                            {/* Messages Container */}
                            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                                <div className="flex justify-start">
                                    <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none max-w-[80%] text-slate-700">
                                        <p className="text-sm">Hello! I'm As'alny AI Assistant. How can I help you today? Describe your symptoms and I'll help you find the right doctor.</p>
                                    </div>
                                </div>
                            </div>


                            {/* Input Area */}
                            <div className="flex gap-2 pt-4 border-t border-slate-200">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Describe your symptoms..."
                                    className="flex-1 px-4 py-3 rounded-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim()}
                                    className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                        {/* Glowing orb */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AIAssistant;
