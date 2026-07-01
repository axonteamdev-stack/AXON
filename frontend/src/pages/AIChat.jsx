import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Bot, Send, ArrowLeft, MoreVertical, Trash2,
    User, Plus, MessageSquare, Shield, Menu, X,
    Activity, Zap, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { askQuestion, getConversations, getMessages } from '../api/chatbot';

const AIChat = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const location = useLocation();
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);
    const [mobileConvOpen, setMobileConvOpen] = useState(false);
    const messagesEndRef = useRef(null);

    // Load conversations on mount
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const result = await getConversations();
                const list = result.data?.conversations || [];
                setConversations(list);
            } catch (err) {
                console.error('Failed to load conversations:', err);
            } finally {
                setIsLoadingConversations(false);
            }
        };
        fetchConversations();
    }, []);

    // Load messages when a conversation is selected
    useEffect(() => {
        if (!currentConversationId) {
            setMessages([]);
            return;
        }
        const fetchMessages = async () => {
            try {
                const result = await getMessages(currentConversationId);
                const list = result.data?.messages || [];
                setMessages(
                    list.map((m) => ({
                        id: m._id || m.id,
                        text: m.content,
                        sender: m.role === 'user' ? 'user' : 'ai',
                    })),
                );
            } catch (err) {
                console.error('Failed to load messages:', err);
            }
        };
        fetchMessages();
    }, [currentConversationId]);

    useEffect(() => {
        if (location.state?.initialMessage) {
            handleSend(location.state.initialMessage);
            window.history.replaceState({}, document.title);
        }
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            const saved = localStorage.getItem('user');
            if (saved) setUser(JSON.parse(saved));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (text = inputValue) => {
        const query = typeof text === 'string' ? text : inputValue;
        if (!query.trim()) return;

        const userMessage = { id: Date.now(), text: query, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            const result = await askQuestion(query, currentConversationId);
            const reply = result.data?.reply || '';
            const newConversationId = result.data?.conversationId;

            setMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, text: reply, sender: 'ai' },
            ]);

            if (newConversationId && newConversationId !== currentConversationId) {
                setCurrentConversationId(newConversationId);
                // Refresh conversations list
                try {
                    const convResult = await getConversations();
                    setConversations(convResult.data?.conversations || []);
                } catch {}
            }
        } catch (err) {
            const fallback = isRtl
                ? 'عذراً، تعذر الاتصال بالمساعد الذكي. يرجى المحاولة لاحقاً.'
                : 'Sorry, the AI assistant is unavailable. Please try again later.';
            setMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, text: fallback, sender: 'ai' },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleNewChat = () => {
        setCurrentConversationId(null);
        setMessages([]);
        setInputValue('');
    };

    const handleSelectConversation = (convId) => {
        setCurrentConversationId(convId);
    };

    const renderConversationsList = () => (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-slate-100/50">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-500 hover:text-primary transition-all duration-300 mb-8 group"
                >
                    <div className="p-2 rounded-lg group-hover:bg-primary/10 transition-colors">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="font-semibold text-sm">{isRtl ? 'العودة للرئيسية' : 'Back to Home'}</span>
                </button>
                <button
                    onClick={handleNewChat}
                    className="w-full bg-linear-to-r from-primary to-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 active:scale-95"
                >
                    <Plus size={20} />
                    {isRtl ? 'محادثة جديدة' : 'New Chat'}
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {isLoadingConversations ? (
                    <div className="flex justify-center py-8">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : conversations.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-8">
                        {isRtl ? 'لا توجد محادثات سابقة' : 'No previous conversations'}
                    </p>
                ) : (
                    conversations.map((conv) => (
                        <button
                            key={conv._id}
                            onClick={() => { handleSelectConversation(conv._id); setMobileConvOpen(false); }}
                            className={`w-full text-left p-4 rounded-2xl transition-all duration-200 ${
                                currentConversationId === conv._id
                                    ? 'bg-primary/10 border border-primary/20'
                                    : 'hover:bg-slate-50 border border-transparent'
                            }`}
                        >
                            <p className="text-sm font-bold text-slate-900 truncate">
                                {conv.title || (isRtl ? 'محادثة' : 'Conversation')}
                            </p>
                            <p className="text-xs text-slate-400 mt-1 truncate">
                                {conv.lastMessage}
                            </p>
                        </button>
                    ))
                )}
            </div>
            <div className="p-6 border-t border-slate-100/50 space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                    <div className="w-11 h-11 rounded-xl bg-linear-to-br from-primary/20 to-blue-500/20 flex items-center justify-center text-primary shadow-inner">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-xl object-cover" />
                        ) : (
                            <User size={22} />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{user?.name || user?.firstName || 'User Account'}</p>
                        <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest truncate">
                            {user?.role === 'doctor' ? (isRtl ? 'طبيب' : 'Doctor') : (isRtl ? 'مريض' : 'Patient')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#F0F4F8] overflow-hidden font-['Inter',sans-serif]" dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Mobile backdrop */}
            {mobileConvOpen && (
                <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileConvOpen(false)} />
            )}

            {/* Mobile sidebar */}
            <aside
                className={`fixed inset-y-0 ${isRtl ? 'right-0' : 'left-0'} z-50 w-80 bg-white/95 backdrop-blur-xl border-slate-200 flex flex-col shrink-0 transform transition-transform duration-200 ease-out lg:hidden ${isRtl ? 'border-l' : 'border-r'} ${mobileConvOpen ? 'translate-x-0' : isRtl ? 'translate-x-full' : '-translate-x-full'}`}
            >
                <div className="p-4 flex justify-end">
                    <button onClick={() => setMobileConvOpen(false)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100">
                        <X size={20} />
                    </button>
                </div>
                {renderConversationsList()}
            </aside>

            {/* Desktop sidebar */}
            <aside className="hidden lg:flex w-80 bg-white/70 backdrop-blur-xl border-x border-slate-200/50 flex-col shrink-0 relative z-20">
                {renderConversationsList()}
            </aside>

            {/* Mobile header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <button onClick={() => setMobileConvOpen(true)} className="p-2 rounded-lg text-slate-600 hover:bg-slate-100">
                    <Menu size={22} />
                </button>
                <h1 className="text-sm font-bold text-primary">As'alny AI</h1>
                <button onClick={() => navigate('/')} className="p-2 rounded-lg text-slate-600 hover:bg-slate-100">
                    <ArrowLeft size={22} />
                </button>
            </div>

            <main className="flex-1 flex flex-col relative z-10 bg-transparent pt-14 lg:pt-0">
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 pt-20 sm:pt-32 space-y-6 sm:space-y-10 custom-scrollbar relative">
                    <AnimatePresence>
                        {messages.length === 0 && !isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center h-full text-center py-20"
                            >
                                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
                                    <Bot size={40} className="text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                    {isRtl ? 'مساعد As\'alny الذكي' : 'As\'alny AI Assistant'}
                                </h2>
                                <p className="text-slate-500 max-w-md">
                                    {isRtl
                                        ? 'اطرح سؤالك الطبي للحصول على معلومات صحية عامة'
                                        : 'Ask your medical question for general health information'}
                                </p>
                            </motion.div>
                        )}
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex gap-5 max-w-2xl ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${message.sender === 'user'
                                        ? 'bg-primary text-white shadow-primary/20'
                                        : 'bg-white text-primary border border-slate-100 shadow-slate-200/50'
                                        }`}>
                                        {message.sender === 'user' ? (
                                            user?.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-2xl object-cover" />
                                            ) : (
                                                <User size={24} />
                                            )
                                        ) : (
                                            <Bot size={24} />
                                        )}
                                    </div>
                                    <div className="relative group">
                                        <div className={`p-6 rounded-[2rem] shadow-sm transition-shadow hover:shadow-md ${message.sender === 'user'
                                            ? 'bg-linear-to-br from-primary to-blue-700 text-white rounded-tr-none'
                                            : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                                            }`}>
                                            <p className="leading-relaxed whitespace-pre-wrap font-medium text-sm sm:text-base">
                                                {message.text}
                                            </p>
                                        </div>
                                        <div className={`absolute top-0 ${message.sender === 'user' ? 'right-0 -translate-y-6' : 'left-0 -translate-y-6'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-start"
                        >
                            <div className="flex gap-5 max-w-2xl">
                                <div className="w-12 h-12 rounded-2xl bg-white text-primary border border-slate-100 flex items-center justify-center shadow-sm">
                                    <Bot size={24} />
                                </div>
                                <div className="bg-white p-6 rounded-[2rem] rounded-tl-none border border-slate-100 shadow-sm">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 bg-primary/20 rounded-full animate-bounce"></div>
                                        <div className="w-3 h-3 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-3 h-3 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>

                <div className="p-4 sm:p-8 bg-linear-to-t from-white via-white/80 to-transparent relative z-20">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative group p-1">
                            <div className="absolute -inset-1.5 bg-linear-to-r from-primary/30 via-blue-400/30 to-primary/30 rounded-[2.5rem] blur opacity-0 group-focus-within:opacity-100 transition duration-1000 group-focus-within:duration-500 animate-gradient"></div>
                            <div className="relative flex items-end gap-4 bg-white/80 backdrop-blur-2xl border border-slate-200/60 p-4 rounded-[2.2rem] shadow-2xl shadow-slate-200/50">
                                <textarea
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    placeholder={isRtl ? "اكتب رسالتك هنا..." : "Send a message to As'alny..."}
                                    className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-slate-900 placeholder-slate-400 py-4 px-6 resize-none max-h-48 min-h-[64px] font-medium text-base scrollbar-hide"
                                    rows={1}
                                />
                                <div className="flex gap-2 p-2">
                                    <button
                                        onClick={() => handleSend()}
                                        disabled={!inputValue.trim() || isTyping}
                                        className="w-14 h-14 bg-linear-to-br from-primary to-blue-600 text-white rounded-2xl hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-30 disabled:grayscale shrink-0 flex items-center justify-center transform hover:scale-105 active:scale-95"
                                    >
                                        <Send size={26} className={isRtl ? 'rotate-180' : ''} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-4 opacity-50">
                            <span className="h-px w-12 bg-slate-300"></span>
                            <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black text-center">
                                {isRtl ? 'تنبيه طبي هام: استشر طبيبك دائماً' : 'Medical Advisory: Always seek professional diagnosis'}
                            </p>
                            <span className="h-px w-12 bg-slate-300"></span>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E2E8F0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #CBD5E1;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
            `}</style>
        </div>
    );
};

export default AIChat;
