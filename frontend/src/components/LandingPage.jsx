import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LandingPage = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const navigate = useNavigate();

  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <section id="consultation" className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-white to-slate-100 py-16">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNHoiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjAyIi8+PC9nPjwvc3ZnPg==')]"></div>
      </div>

      {/* Floating Profile Card */}
      <AnimatePresence>
        {user && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className={`absolute top-24 ${isRtl ? 'right-6' : 'left-6'} z-30`}
          >
            <div className="bg-white/80 backdrop-blur-xl border border-white p-2 pr-6 rounded-full shadow-2xl flex items-center gap-4 group cursor-pointer hover:scale-105 transition-all duration-300"
              onClick={() => navigate(user.role === 'doctor' ? '/doctor-home' : '/patient-home')}>
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 p-0.5">
                  <img src={user.avatar || '/assets/default-avatar.png'} alt="Profile" className="w-full h-full rounded-full object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role || 'Member'}</p>
                <h4 className="text-sm font-black text-slate-900 leading-tight">
                  {isRtl ? `مرحباً، ${user.firstName}` : `Hi, ${user.firstName}`}
                </h4>
              </div>
              <div className="ml-2 w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-6xl px-6">
        <div className={`grid lg:grid-cols-2 gap-16 items-center ${isRtl ? 'rtl' : ''}`}>
          {/* Left Side - Logo and Buttons */}
          <div className={`flex flex-col items-center ${isRtl ? 'lg:items-end' : 'lg:items-start'}`}>
            {/* Head Text */}
            <div className={`text-center lg:text-left mb-8 ${isRtl ? 'lg:text-right' : ''}`}>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-slate-900 block">{isRtl ? 'استشارة' : 'Online'}</span>
                <span className="text-[#1E4DB7] block mt-2">{isRtl ? 'أونلاين' : 'Consultation'}</span>
              </h1>
              <p className={`mt-4 text-lg text-slate-600 max-w-md ${isRtl ? 'text-right' : 'text-left'}`}>
                {isRtl
                  ? 'استشر أفضل الأطباء من أي مكان حول صحتك.'
                  : 'Consult world-class doctors anytime, anywhere for your health.'}
              </p>
            </div>

            {/* Two Large Centered Buttons */}
            <div className={`flex flex-col sm:flex-row items-center justify-center ${isRtl ? 'lg:justify-end' : 'lg:justify-start'} gap-6`}>
              {/* Login Button */}
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-64 py-5 px-8 bg-[#1E4DB7] text-white font-bold text-xl rounded-xl 
                           shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 
                           hover:bg-[#163d8f] hover:scale-[1.02] active:scale-[0.98]
                           transition-all duration-300 ease-out"
              >
                {t('nav.login')}
              </button>

              {/* Sign Up Button */}
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-64 py-5 px-8 bg-white text-[#1E4DB7] font-bold text-xl rounded-xl 
                           border-2 border-[#1E4DB7] shadow-lg shadow-gray-200/50
                           hover:bg-blue-50 hover:shadow-xl hover:shadow-blue-100/50
                           hover:scale-[1.02] active:scale-[0.98]
                           transition-all duration-300 ease-out"
              >
                {t('nav.signup')}
              </button>
            </div>


          </div>

          {/* Right Side - Doctor's Image */}
          <div className={`relative flex justify-center ${isRtl ? 'lg:justify-start' : 'lg:justify-end'}`}>
            {/* Main Circle Container */}
            <div className="relative w-80 h-80 sm:w-[450px] sm:h-[450px]">
              {/* Decorative background circle */}
              <div className="absolute inset-0 bg-linear-to-tr from-[#1E4DB7]/10 via-transparent to-[#1E4DB7]/5 rounded-full scale-110 pointer-events-none"></div>

              {/* Border Ring */}
              <div className="absolute inset-0 border-16 border-slate-100 rounded-full shadow-lg"></div>

              {/* Image Wrapper */}
              <div className="absolute inset-[16px] rounded-full overflow-hidden shadow-inner bg-slate-200">
                <img
                  src="/assets/hero-doctor.jpg"
                  alt="Doctor"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-1000"
                />
              </div>

              {/* Top Badge (Online Status) */}
              <motion.div
                initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                animate={{
                  opacity: 1,
                  x: isRtl ? -4 : -4, // Adjusting slightly based on class
                  y: [0, -10, 0]
                }}
                transition={{
                  opacity: { duration: 0.5 },
                  y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                }}
                className={`absolute -top-4 z-20 bg-white/90 backdrop-blur-md border border-slate-100 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl ${isRtl ? '-right-4 sm:-right-10' : '-left-4 sm:-left-10'}`}
              >
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <span className="text-xs sm:text-sm font-bold truncate text-slate-700">
                  {isRtl ? '+1000 طبيب متصل' : '+1000 Doctors Available'}
                </span>
              </motion.div>

              {/* Bottom Badge (Consultancy stats) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, 10, 0]
                }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.2 },
                  y: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }
                }}
                className={`absolute bottom-10 z-20 bg-white/90 backdrop-blur-md border border-slate-100 px-6 py-4 rounded-3xl shadow-2xl flex flex-col items-center ${isRtl ? '-left-4 sm:-left-6' : '-right-4 sm:-right-6'}`}
              >
                <span className="text-[#1E4DB7] text-2xl font-black">+35K</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-tighter">
                  {isRtl ? 'استشارات ناجحة' : 'Success Consults'}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default LandingPage;
