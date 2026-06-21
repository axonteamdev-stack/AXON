import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Bot, Send, ArrowLeft, MoreVertical, Trash2,
    User, Plus, MessageSquare, Shield,
    Activity, Zap, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getMedicalAIResponse = (query, isRtl) => {
    const q = query.toLowerCase();
    const responses = [
        {
            keywords: ['headache', 'head pain', 'migraine', 'صداع', 'ألم الرأس'],
            en: "Headaches can be triggered by stress, dehydration, or poor sleep. For mild headaches, rest and hydration often help.\n\nHowever, seek immediate care if the headache is:\n• Sudden and severe (thunderclap)\n• Accompanied by fever, stiff neck, or vision changes\n• Following a head injury\n\n⚠️ This is general information only — always consult a doctor for proper diagnosis.",
            ar: "يمكن أن يحدث الصداع بسبب التوتر أو الجفاف أو قلة النوم. للصداع الخفيف، تساعد الراحة وشرب الماء.\n\nاطلب رعاية فورية إذا كان الصداع:\n• مفاجئاً وشديداً\n• مصحوباً بحمى أو تصلب الرقبة أو تغييرات في الرؤية\n• بعد إصابة في الرأس\n\n⚠️ هذه معلومات عامة فقط — استشر طبيبك دائماً للتشخيص الصحيح."
        },
        {
            keywords: ['fever', 'temperature', 'high temp', 'حمى', 'حرارة', 'سخانة'],
            en: "Fever is often a sign your body is fighting an infection.\n\nGeneral guidance for adults:\n• Below 38.5°C — Rest, fluids, and monitor\n• 38.5–39°C — Paracetamol may help; consult a doctor\n• Above 39°C — Seek medical attention\n• Above 40°C — Emergency care immediately\n\n⚠️ Always consult a healthcare professional for proper evaluation.",
            ar: "الحمى غالباً علامة على أن جسمك يقاوم عدوى.\n\nإرشادات عامة للبالغين:\n• أقل من 38.5° — الراحة والسوائل والمراقبة\n• 38.5-39° — الباراسيتامول قد يساعد؛ استشر الطبيب\n• فوق 39° — اطلب عناية طبية\n• فوق 40° — رعاية طارئة فوراً\n\n⚠️ استشر دائماً متخصصاً للتقييم الصحيح."
        },
        {
            keywords: ['chest pain', 'chest', 'heart attack', 'cardiac', 'ألم الصدر', 'قلب', 'ضربات القلب'],
            en: "🚨 Chest pain requires immediate medical attention.\n\nCall emergency services NOW if you experience:\n• Severe chest pressure or pain\n• Pain spreading to arm, jaw, or back\n• Shortness of breath\n• Sweating, nausea, or dizziness\n\nDo not wait — these may be signs of a heart attack.\n\n⚠️ Even if the cause turns out to be non-cardiac, chest pain should always be evaluated urgently.",
            ar: "🚨 يستدعي ألم الصدر اهتماماً طبياً فورياً.\n\naتصل بخدمات الطوارئ الآن إذا كنت تعاني من:\n• ضغط أو ألم شديد في الصدر\n• ألم ينتشر إلى الذراع أو الفك أو الظهر\n• ضيق في التنفس\n• تعرق أو غثيان أو دوخة\n\nلا تنتظر — قد تكون هذه علامات نوبة قلبية.\n\n⚠️ حتى لو تبين أن السبب غير قلبي، يجب دائماً تقييم ألم الصدر بشكل عاجل."
        },
        {
            keywords: ['diabetes', 'blood sugar', 'sugar', 'insulin', 'سكري', 'سكر الدم', 'سكر'],
            en: "Diabetes management involves:\n• Regular blood glucose monitoring\n• Balanced diet — low in refined carbs and sugar\n• Regular physical activity (150 min/week)\n• Taking medications/insulin as prescribed\n• Regular HbA1c checks\n\nWarning signs to watch:\n• Excessive thirst or hunger\n• Frequent urination\n• Blurred vision\n• Slow-healing wounds\n\n⚠️ Work closely with your doctor for a personalized treatment plan.",
            ar: "إدارة السكري تشمل:\n• مراقبة منتظمة لمستوى السكر في الدم\n• نظام غذائي متوازن — منخفض الكربوهيدرات المكررة والسكر\n• نشاط بدني منتظم (150 دقيقة/أسبوع)\n• تناول الأدوية/الأنسولين حسب الوصفة\n• فحوصات HbA1c المنتظمة\n\nعلامات تحذيرية يجب مراقبتها:\n• عطش أو جوع مفرط\n• كثرة التبول\n• ضبابية الرؤية\n• بطء التئام الجروح\n\n⚠️ تعاون مع طبيبك للحصول على خطة علاجية شخصية."
        },
        {
            keywords: ['blood pressure', 'hypertension', 'high pressure', 'ضغط الدم', 'ضغط دم', 'ضغط'],
            en: "Blood pressure management tips:\n• Reduce salt intake (under 5g/day)\n• Exercise regularly (30 min/day)\n• Maintain a healthy weight\n• Limit alcohol and avoid smoking\n• Manage stress through relaxation techniques\n• Take prescribed medications consistently\n\nNormal: 120/80 mmHg\nHigh (Hypertension): Above 140/90 mmHg\n\n⚠️ Never stop blood pressure medications without consulting your doctor.",
            ar: "نصائح لإدارة ضغط الدم:\n• تقليل الملح (أقل من 5 جرام/يوم)\n• ممارسة التمارين بانتظام (30 دقيقة/يوم)\n• الحفاظ على وزن صحي\n• تحديد الكحول وتجنب التدخين\n• إدارة التوتر من خلال تقنيات الاسترخاء\n• تناول الأدوية الموصوفة بانتظام\n\nطبيعي: 120/80 ملم زئبق\nمرتفع: فوق 140/90 ملم زئبق\n\n⚠️ لا توقف أدوية ضغط الدم دون استشارة طبيبك."
        },
        {
            keywords: ['cough', 'cold', 'flu', 'influenza', 'respiratory', 'breathing', 'كحة', 'سعال', 'برد', 'انفلونزا', 'تنفس'],
            en: "For coughs and respiratory issues:\n• Stay hydrated with warm fluids\n• Rest adequately\n• Honey and ginger tea can soothe the throat\n• Avoid smoke and air irritants\n\nSee a doctor if:\n• Cough lasts more than 2–3 weeks\n• Blood appears in sputum\n• High fever alongside breathing difficulty\n• Wheezing or chest tightness\n\n⚠️ Seek medical advice for an accurate diagnosis.",
            ar: "للسعال والمشاكل التنفسية:\n• اشرب الكثير من السوائل الدافئة\n• خذ قسطاً كافياً من الراحة\n• شاي العسل والزنجبيل يهدئ الحلق\n• تجنب الدخان والمهيجات الجوية\n\nاستشر الطبيب إذا:\n• استمر السعال لأكثر من 2-3 أسابيع\n• ظهر دم في البلغم\n• حمى عالية مع صعوبة في التنفس\n• أزيز أو ضيق في الصدر\n\n⚠️ اطلب المشورة الطبية للتشخيص الدقيق."
        },
        {
            keywords: ['stomach', 'nausea', 'vomit', 'diarrhea', 'digestive', 'معدة', 'غثيان', 'قيء', 'إسهال', 'هضم', 'بطن'],
            en: "For stomach and digestive issues:\n• Stay hydrated — sip water or oral rehydration solution frequently\n• Eat bland foods: rice, toast, bananas, boiled potatoes\n• Avoid dairy, fatty, or spicy foods temporarily\n• Rest and avoid strenuous activity\n\nSeek immediate care if:\n• Severe or persistent abdominal pain\n• Blood in stool or vomit\n• Signs of dehydration (dark urine, dizziness, dry mouth)\n• Symptoms persist beyond 2 days\n\n⚠️ Consult your doctor for proper evaluation.",
            ar: "لمشاكل المعدة والجهاز الهضمي:\n• حافظ على ترطيب الجسم — اشرب الماء أو محلول إماهة الفم بكميات صغيرة ومتكررة\n• تناول أطعمة خفيفة: أرز، خبز محمص، موز، بطاطس مسلوقة\n• تجنب الألبان والأطعمة الدهنية أو الحارة مؤقتاً\n• استرح وتجنب الأنشطة المجهدة\n\nاطلب رعاية فورية إذا:\n• ألم شديد أو مستمر في البطن\n• دم في البراز أو القيء\n• علامات الجفاف (بول داكن، دوخة، جفاف الفم)\n• الأعراض تستمر أكثر من يومين\n\n⚠️ استشر طبيبك للتقييم الصحيح."
        },
        {
            keywords: ['sleep', 'insomnia', 'tired', 'fatigue', 'exhausted', 'نوم', 'أرق', 'تعب', 'إرهاق'],
            en: "For better sleep and managing fatigue:\n• Keep a consistent sleep schedule (same bedtime/wake time)\n• Avoid screens 1 hour before bed\n• Keep your bedroom cool, dark, and quiet\n• Limit caffeine after 2 PM\n• Try deep breathing or meditation before bed\n• Exercise regularly, but not within 3 hours of sleep\n\n⚠️ Persistent fatigue or insomnia (more than a few weeks) may indicate an underlying condition — see your doctor.",
            ar: "لنوم أفضل وإدارة التعب:\n• الحفاظ على جدول نوم منتظم (نفس وقت النوم والاستيقاظ)\n• تجنب الشاشات لمدة ساعة قبل النوم\n• اجعل غرفة نومك باردة ومظلمة وهادئة\n• تقليل الكافيين بعد الساعة 2 ظهراً\n• جرب التنفس العميق أو التأمل قبل النوم\n• مارس الرياضة بانتظام، ولكن ليس خلال 3 ساعات من النوم\n\n⚠️ قد يشير التعب المستمر أو الأرق لأكثر من بضعة أسابيع إلى حالة كامنة — استشر طبيبك."
        },
        {
            keywords: ['allergy', 'allergic', 'rash', 'itching', 'hives', 'حساسية', 'طفح', 'حكة'],
            en: "For allergic reactions:\n\nMild symptoms (runny nose, sneezing, mild rash):\n• Antihistamines (e.g., cetirizine, loratadine)\n• Avoid known triggers\n• Cold compress for skin irritation\n\n🚨 Severe symptoms — call emergency immediately:\n• Throat swelling or difficulty breathing\n• Sudden widespread rash with dizziness\n• These may indicate anaphylaxis\n\n⚠️ See an allergist to identify and manage your specific triggers.",
            ar: "للحساسية وردود الفعل التحسسية:\n\nأعراض خفيفة (سيلان الأنف، العطس، طفح خفيف):\n• مضادات الهيستامين (مثل سيتيريزين، لوراتادين)\n• تجنب المحفزات المعروفة\n• كمادة باردة لتهيج الجلد\n\n🚨 أعراض شديدة — اتصل بالطوارئ فوراً:\n• تورم الحلق أو صعوبة التنفس\n• طفح جلدي مفاجئ واسع مع دوار\n• قد تكون هذه علامات صدمة تأقية\n\n⚠️ راجع طبيب حساسية لتحديد محفزاتك وإدارتها."
        }
    ];

    for (const response of responses) {
        if (response.keywords.some(kw => q.includes(kw))) {
            return isRtl ? response.ar : response.en;
        }
    }

    return isRtl
        ? "شكراً لسؤالك. بناءً على ما وصفته، أنصحك بالتواصل مع طبيب متخصص للحصول على تشخيص دقيق.\n\nكمساعد ذكاء اصطناعي طبي، يمكنني تقديم معلومات صحية عامة فقط وليس تشخيصاً طبياً.\n\nهل يمكنك وصف أعراضك بمزيد من التفصيل؟"
        : "Thank you for your question. Based on what you've described, I recommend consulting a specialist for an accurate diagnosis.\n\nAs a medical AI assistant, I can provide general health information only — not a medical diagnosis.\n\nCould you describe your symptoms in more detail?";
};

const AIChat = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const location = useLocation();
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const [messages, setMessages] = useState(() => {
        const query = location.state?.initialMessage || '';
        if (query) {
            return [{ id: Date.now(), text: query, sender: 'user' }];
        }
        return [{ id: 1, text: isRtl ? "مرحباً! أنا مساعد As'alny الذكي. كيف يمكنني مساعدتك اليوم؟" : "Hello! I'm As'alny AI Assistant. How can I help you today?", sender: 'ai' }];
    });
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Clear state to prevent re-sending on navigations
        if (location.state?.initialMessage) {
            window.history.replaceState({}, document.title);
        }

        // Listen for storage changes to sync user data
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
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        const delay = 1200 + Math.random() * 900;
        setTimeout(() => {
            const aiText = getMedicalAIResponse(query, isRtl);
            setMessages(prev => [...prev, { id: Date.now(), text: aiText, sender: 'ai' }]);
            setIsTyping(false);
        }, delay);
    };

    const handleNewChat = () => {
        setMessages([{
            id: Date.now(),
            text: isRtl ? "مرحباً! أنا مساعد As'alny الذكي. كيف يمكنني مساعدتك اليوم؟" : "Hello! I'm As'alny AI Assistant. How can I help you today?",
            sender: 'ai'
        }]);
        setInputValue('');
        // Clear any initial message from previous navigation
        if (location.state?.initialMessage) {
            window.history.replaceState({}, document.title);
        }
    };

    return (
        <div className="flex h-screen bg-[#F0F4F8] overflow-hidden font-['Inter',sans-serif]" dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Sidebar */}
            <aside className="hidden lg:flex w-80 bg-white/70 backdrop-blur-xl border-x border-slate-200/50 flex-col shrink-0 relative z-20">
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

                <div className="flex-1" />

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
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col relative z-10 bg-transparent">
                {/* Messages Panel */}
                <div className="flex-1 overflow-y-auto p-8 pt-32 space-y-10 custom-scrollbar relative">
                    <AnimatePresence>
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
                                    <div className={`relative group`}>
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

                {/* Input Area */}
                <div className="p-8 bg-linear-to-t from-white via-white/80 to-transparent relative z-20">
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
