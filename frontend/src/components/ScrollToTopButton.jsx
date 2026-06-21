import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ScrollToTopButton = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / docHeight) * 100;

      setScrollProgress(progress);
      setIsVisible(scrolled > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const radius = 0.5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, x: isRtl ? -20 : 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.5, x: isRtl ? -20 : 20 }}
          className={`fixed bottom-8 ${isRtl ? 'left-8' : 'right-8'} z-[100] flex items-center justify-center`}
        >
          {/* Progress Circle */}
          <svg className="absolute w-0.5 h-0.5 -rotate-90 pointer-events-none">
            <circle
              cx="1"
              cy="1"
              r={radius}
              stroke="currentColor"
              strokeWidth="0.1"
              fill="transparent"
              className="text-slate-200"
            />
            <motion.circle
              cx="1"
              cy="1"
              r={radius}
              stroke="currentColor"
              strokeWidth="0.1"
              fill="transparent"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: offset }}
              className="text-slate-400"
              strokeLinecap="round"
            />
          </svg>

          <button
            onClick={scrollToTop}
            className="p-0.5 bg-white text-slate-400 rounded-full shadow-lg border border-slate-100 hover:bg-slate-400 hover:text-white transition-all duration-300 active:scale-90 group relative z-10"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-0.5 h-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;
