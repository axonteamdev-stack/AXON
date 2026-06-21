import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
    const { i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: isRtl ? "هل الاستشارة متاحة على مدار الساعة؟" : "Is consultation available 24/7?",
            answer: isRtl
                ? "نعم، شبكة الأطباء لدينا متاحة على مدار الساعة لتوفير المساعدة الطبية لك متى احتجت إليها."
                : "Yes, our network of doctors is available round the clock to provide you with medical assistance whenever you need it."
        },
        {
            question: isRtl ? "كيف أحجز موعد في العيادة؟" : "How do I book a clinic appointment?",
            answer: isRtl
                ? "يمكنك بسهولة حجز موعد في العيادة من خلال تطبيقنا أو موقعنا الإلكتروني باختيار الطبيب والوقت المفضلين."
                : "You can easily book a clinic appointment through our app or website by choosing your preferred doctor and time slot."
        },
        {
            question: isRtl ? "هل الأطباء موثقون؟" : "Are the doctors verified?",
            answer: isRtl
                ? "بالتأكيد. يخضع جميع الأطباء في As'alny لعملية تحقق صارمة للتأكد من أنهم مرخصون ومؤهلون."
                : "Absolutely. All doctors on As'alny undergo a rigorous verification process to ensure they are licensed and qualified."
        },
        {
            question: isRtl ? "ما هي التخصصات المتاحة؟" : "What specialties are available?",
            answer: isRtl
                ? "نقدم مجموعة واسعة من التخصصات بما في ذلك الطب العام، طب الأطفال، الأمراض الجلدية، الصحة النفسية، والمزيد."
                : "We offer a wide range of specialties including General Practice, Pediatrics, Dermatology, Mental Health, and more."
        }
    ];

    return (
        <section id="blog" className="py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className={`text-3xl font-bold text-center mb-12 ${isRtl ? 'rtl' : ''}`}>
                    {isRtl ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
                </h2>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                className={`w-full flex justify-between items-center p-6 text-left bg-white ${isRtl ? 'text-right' : ''}`}
                            >
                                <span className="font-bold text-slate-900">{faq.question}</span>
                                {activeIndex === index ? <ChevronUp className="text-primary shrink-0" /> : <ChevronDown className="text-slate-400 shrink-0" />}
                            </button>

                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className={`p-6 pt-0 text-slate-600 bg-white border-t ${isRtl ? 'text-right' : 'text-left'}`}>
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
