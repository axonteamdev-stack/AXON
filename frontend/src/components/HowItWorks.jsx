import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Search, CreditCard, Video, ClipboardCheck, Settings, Bell, Star, ChevronRight, Bot } from 'lucide-react';

const HowItWorks = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const [activeTab, setActiveTab] = useState('patient');

    const patientSteps = [
        {
            icon: <UserPlus className="w-8 h-8" />,
            title: isRtl ? "سجل الآن" : "Register Now",
            desc: isRtl ? "أنشئ حسابك الشخصي بخطوات بسيطة" : "Create your personal account in simple steps"
        },
        {
            icon: <Search className="w-8 h-8" />,
            title: isRtl ? "ابحث عن طبيب" : "Search for Doctor",
            desc: isRtl ? "اختر التخصص والمدينة المناسبة لك" : "Choose the specialty and city that suits you"
        },
        {
            icon: <CreditCard className="w-8 h-8" />,
            title: isRtl ? "احجز وادفع" : "Book & Pay",
            desc: isRtl ? "احجز موعدك وادفع بأمان عبر الموقع" : "Book your appointment and pay securely online"
        },
        {
            icon: <Video className="w-8 h-8" />,
            title: isRtl ? "ابدأ الاستشارة" : "Start Consultation",
            desc: isRtl ? "تحدث مع طبيبك عبر الفيديو أو الشات" : "Talk to your doctor via video or chat"
        }
    ];

    const doctorSteps = [
        {
            icon: <ClipboardCheck className="w-8 h-8" />,
            title: isRtl ? "انضم إلينا" : "Join Us",
            desc: isRtl ? "قدم طلبك للانضمام لشبكتنا الطبية" : "Submit your request to join our medical network"
        },
        {
            icon: <Settings className="w-8 h-8" />,
            title: isRtl ? "ضبط الجدول" : "Set Schedule",
            desc: isRtl ? "حدد مواعيدك وتخصصك وأسعارك" : "Set your schedule, specialty, and fees"
        },
        {
            icon: <Bell className="w-8 h-8" />,
            title: isRtl ? "استلم الطلبات" : "Receive Requests",
            desc: isRtl ? "استقبل تنبيهات ف فورية بمواعيد المرضى" : "Get instant notifications for patient appointments"
        },
        {
            icon: <Star className="w-8 h-8" />,
            title: isRtl ? "قدم الرعاية" : "Provide Care",
            desc: isRtl ? "ابدأ تقديم استشاراتك وابنِ سمعتك" : "Start providing consultations and build reputation"
        }
    ];

    const steps = activeTab === 'patient' ? patientSteps : doctorSteps;

    return (
        <section id="how-it-works" className="py-24 bg-linear-to-b from-white to-slate-50 overflow-hidden relative">
            {/* Background decorative elements */}
            <div className={`absolute top-0 ${isRtl ? 'right-0' : 'left-0'} w-96 h-96 bg-[#1E4DB7]/5 rounded-full blur-[100px] pointer-events-none`}></div>
            <div className={`absolute bottom-0 ${isRtl ? 'left-0' : 'right-0'} w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none`}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-[#1E4DB7]/10 text-[#1E4DB7] px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest mb-4"
                    >
                        <Bot size={14} />
                        <span>{isRtl ? "البساطة والسهولة" : "Simple & Easy"}</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight"
                    >
                        {isRtl ? "كيف يبدأ التعامل؟" : "How it works?"}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-lg md:text-xl font-medium"
                    >
                        {isRtl
                            ? "اكتشف مدى سهولة استخدام منصتنا للحصول على أفضل رعاية طبية في دقائق"
                            : "Discover how easy it is to use our platform to get the best medical care in minutes"}
                    </motion.p>
                </div>

                {/* Tab Toggle */}
                <div className="flex justify-center mb-20">
                    <div className="p-1.5 bg-slate-100/80 backdrop-blur-md rounded-[24px] flex relative overflow-hidden shadow-inner w-full max-w-[360px] border border-slate-200/50">
                        {/* Animated Background */}
                        <motion.div
                            className="absolute inset-y-1.5 bg-white rounded-[18px] shadow-lg z-0"
                            initial={false}
                            animate={{
                                left: activeTab === 'patient' ? (isRtl ? 'auto' : '6px') : (isRtl ? '6px' : '50%'),
                                right: activeTab === 'patient' ? (isRtl ? '50%' : 'auto') : (isRtl ? 'auto' : '6px'),
                                width: 'calc(50% - 6px)'
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        />

                        <button
                            onClick={() => setActiveTab('patient')}
                            className={`relative z-10 flex-1 py-4 text-sm font-black uppercase tracking-wider transition-colors duration-300 ${activeTab === 'patient' ? 'text-[#1E4DB7]' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {isRtl ? "مريــــض" : "Patient"}
                        </button>
                        <button
                            onClick={() => setActiveTab('doctor')}
                            className={`relative z-10 flex-1 py-4 text-sm font-black uppercase tracking-wider transition-colors duration-300 ${activeTab === 'doctor' ? 'text-[#1E4DB7]' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {isRtl ? "طبيــــب" : "Doctor"}
                        </button>
                    </div>
                </div>

                {/* Steps Display */}
                <div className="relative">
                    {/* Background Line/Connector on desktop */}
                    <div className={`hidden lg:block absolute top-16 left-[10%] right-[10%] h-px bg-slate-200 z-0`}></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
                        <AnimatePresence mode="wait">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={`${activeTab}-${index}`}
                                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 20,
                                        delay: index * 0.1
                                    }}
                                    className="flex flex-col items-center text-center group"
                                >
                                    <div className="relative mb-10">
                                        {/* Outer Ring Effect */}
                                        <div className="absolute -inset-4 bg-[#1E4DB7]/5 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        
                                        <div className="relative w-24 h-24 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] flex items-center justify-center text-[#1E4DB7] transition-all duration-500 group-hover:bg-[#1E4DB7] group-hover:text-white group-hover:shadow-[0_20px_40px_-10px_rgba(30,77,183,0.3)] group-hover:scale-105 group-hover:rotate-[5deg]">
                                            {step.icon}
                                        </div>
                                        
                                        {/* Step Number Badge */}
                                        <div className="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-sm font-black shadow-xl border-4 border-white transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                                            0{index + 1}
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-[#1E4DB7] transition-colors leading-tight px-4">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-500 text-base font-medium leading-relaxed max-w-[240px] px-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                        {step.desc}
                                    </p>
                                    
                                    {/* Small arrow indicator for desktop (except last item) */}
                                    {index < 3 && (
                                        <div className={`hidden lg:block absolute top-16 ${isRtl ? 'right-[90%]' : 'left-[90%]'} text-slate-200 pointer-events-none`}>
                                            <ChevronRight size={24} className={isRtl ? 'rotate-180' : ''} />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
