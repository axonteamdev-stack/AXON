import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, MessageSquare, LogOut, LogIn, User, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../contexts/SettingsContext';
import { Link, useNavigate } from 'react-router-dom';
import * as authApi from '../api/auth';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { language, changeLanguage } = useSettings();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // State to trigger re-render on language change
  const [currentLang, setCurrentLang] = useState(language);

  // Check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('token');
    return !!token;
  });

  const [user, setUser] = useState(null);

  // Update login status when localStorage changes AND when language changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      setIsLoggedIn(!!token);
      setUser(userData ? JSON.parse(userData) : null);
    };

    window.addEventListener('storage', checkLoginStatus);
    checkLoginStatus();

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  // Update current language when i18n language changes
  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (_) {
      // proceed with local logout even if API call fails
    }

    ['accessToken', 'refreshToken', 'token', 'user', 'isLoggedIn'].forEach((k) =>
      localStorage.removeItem(k)
    );

    setIsLoggedIn(false);
    setUser(null);
    setIsDropdownOpen(false);
    setIsOpen(false);

    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  // Function to handle login
  const handleLoginClick = () => {
    navigate('/login');
  };

  // Toggle language
  const handleToggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    changeLanguage(newLang);

    // Close menus
    setIsOpen(false);
    setIsDropdownOpen(false);
  };

  const getNavLinks = () => {
    if (isLoggedIn && user) {
      if (user.role === 'doctor') {
        return [
          { name: t('nav.home', 'Home'), href: '/' },
          { name: t('nav.appointments', 'Appointments'), href: '/doctor-home' },
          { name: t('nav.patients', 'My Patients'), href: '/dashboard' },
          { name: t('nav.schedule', 'Schedule'), href: '/dashboard' },
        ];
      } else if (user.role === 'patient') {
        return [
          { name: t('nav.home', 'Home'), href: '/' },
          { name: t('nav.findDoctor', 'Find Doctor'), href: '/patient-home' },
        ];
      }
    }
    return [
      { name: t('nav.home'), href: '/' },
      { name: t('nav.howItWorks'), href: '#how-it-works' },
    ];
  };

  const navLinks = getNavLinks();

  const handleLinkClick = (href) => {
    setIsOpen(false);
    setIsDropdownOpen(false);

    if (href.startsWith('#')) {
      const sectionId = href.substring(1);

      // If we're not on the home page, navigate there first and let Home scroll
      if (window.location.pathname !== '/') {
        navigate('/', { state: { scrollTo: sectionId } });
        return;
      }

      // Already on home – just scroll to the section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Get proper tooltip text based on current language
  const getLanguageTooltip = () => {
    if (currentLang === 'en') {
      return t('common.switchToArabic', 'Switch to Arabic');
    } else {
      return t('common.switchToEnglish', 'Switch to English');
    }
  };

  // Get proper button text based on current language
  const getLanguageButtonText = () => {
    if (currentLang === 'en') {
      return 'عربي';
    } else {
      return 'English';
    }
  };

  // Get mobile language button text
  const getMobileLanguageButtonText = () => {
    if (currentLang === 'en') {
      return 'العربية';
    } else {
      return 'English';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200" dir={i18n.dir()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-1 flex justify-start items-center shrink-0">
            <Link
              to="/"
              onClick={() => {
                window.scrollTo(0, 0);
                setIsDropdownOpen(false);
              }}
            >
              <img
                src="/assets/logo.png"
                alt="As'alny Logo"
                className="h-20 w-auto object-contain hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Desktop Navigation & Actions Group */}
          <div className={`hidden md:flex items-center space-x-8 ${i18n.dir() === 'rtl' ? 'space-x-reverse' : ''}`}>
            {/* Desktop Nav Links */}
            <div className={`flex items-center space-x-6 lg:space-x-8 ${i18n.dir() === 'rtl' ? 'space-x-reverse' : ''}`}>
            {navLinks.map((link) => (
              link.href.startsWith('#') ? (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.href)}
                  className="text-slate-600 hover:text-primary font-medium transition-colors duration-200"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-slate-600 hover:text-primary font-medium transition-colors duration-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  {link.name}
                </Link>
              )
            ))}
            </div>

            {/* Desktop Actions */}
            <div className={`flex items-center space-x-4 ${i18n.dir() === 'rtl' ? 'space-x-reverse' : ''}`}>
            {/* Language Toggle Button */}
            <button
              onClick={handleToggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-slate-100 transition-colors duration-300"
              title={getLanguageTooltip()}
              aria-label={getLanguageTooltip()}
            >
              <Globe size={20} className="text-slate-600" />
              <span className="text-sm font-medium text-slate-600">
                {getLanguageButtonText()}
              </span>
            </button>

            {/* As'alny AI Button */}
            <button
              onClick={() => {
                navigate('/ai-chat');
                setIsDropdownOpen(false);
              }}
              className="text-primary font-medium px-4 py-2 rounded-full hover:bg-primary/5 transition-colors flex items-center gap-2"
            >
              <MessageSquare size={18} />
              <span>As'alny AI</span>
            </button>

            {/* Login/Logout Button */}
            {isLoggedIn && (
              <button
                className="flex items-center gap-2 px-6 py-2 mx-2 text-red-500 font-medium rounded-full hover:bg-red-50 transition-colors border border-red-500/30 hover:border-red-500"
                onClick={() => setShowLogoutModal(true)}
              >
                <LogOut size={18} />
                <span>{t('nav.logout', 'Logout')}</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.open('https://play.google.com/store', '_blank')}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-medium rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
                title={t('nav.getApp')}
              >
                <Smartphone size={16} />
                <span className="hidden lg:inline">{t('nav.getApp')}</span>
              </button>
            </div>
            </div>
          </div>

          {/* Right Spacer for Center Alignment */}
          <div className="hidden md:block flex-1"></div>

          {/* Mobile Menu Button */}
          <div className={`md:hidden flex items-center space-x-2 ${i18n.dir() === 'rtl' ? 'space-x-reverse' : ''}`}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              aria-label={isOpen ? t('common.closeMenu', 'Close menu') : t('common.openMenu', 'Open menu')}
            >
              {isOpen ? (
                <X size={24} className="text-slate-600" />
              ) : (
                <Menu size={24} className="text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white border-t border-slate-200 overflow-hidden"
            dir={i18n.dir()}
          >
            <div className="px-4 pt-4 space-y-2">
              {navLinks.map((link) => (
                link.href.startsWith('#') ? (
                  <motion.button
                    key={link.name}
                    onClick={() => handleLinkClick(link.href)}
                    className="block w-full text-left px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                    whileTap={{ scale: 0.98 }}
                  >
                    {link.name}
                  </motion.button>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                )
              ))}

              <div className="pt-4 pb-6 flex flex-col space-y-3">
                {/* User info in mobile menu */}
                {isLoggedIn && user && (
                  <div className="px-4 py-3 bg-slate-50 rounded-lg mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                        ) : (
                          <User size={16} className="text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">
                          {user.name || user.firstName || user.email}
                        </p>
                        <p className="text-xs text-slate-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mobile Language Toggle */}
                <motion.button
                  onClick={handleToggleLanguage}
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-50 w-full"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <Globe size={20} className="text-slate-600" />
                    <span className="text-slate-700">
                      {t('common.language', 'Language')}
                    </span>
                  </div>
                  <span className="text-primary font-medium">
                    {getMobileLanguageButtonText()}
                  </span>
                </motion.button>

                {/* Mobile As'alny AI Button */}
                <motion.button
                  onClick={() => {
                    navigate('/ai-chat');
                    setIsOpen(false);
                  }}
                  className="w-full py-3 text-primary font-medium border border-primary rounded-full flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageSquare size={18} />
                  <span>As'alny AI</span>
                </motion.button>

                {/* Mobile Login/Logout Button */}
                {isLoggedIn && (
                  <>
                    <motion.button
                      onClick={() => { setIsOpen(false); setShowLogoutModal(true); }}
                      className="w-full py-3 text-red-500 font-medium border border-red-500 rounded-full hover:bg-red-50 transition-all duration-200 flex items-center justify-center gap-2"
                      whileHover={{
                        x: i18n.dir() === 'rtl' ? -8 : 8,
                        backgroundColor: '#fef2f2'
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        whileHover={{ rotate: -15 }}
                        transition={{ duration: 0.2 }}
                      >
                        <LogOut size={18} />
                      </motion.div>
                      <span>{t('nav.logout', 'Logout')}</span>
                    </motion.button>

                    <div className="p-3 text-center text-sm text-slate-500">
                      {t('nav.youAreLoggedIn', 'You are logged in')}
                    </div>
                  </>
                )}

                <div className="grid grid-cols-1 gap-3">
                  <motion.button
                    onClick={() => {
                      window.open('https://play.google.com/store', '_blank');
                      setIsOpen(false);
                    }}
                    className="py-3 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-lg flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Smartphone size={18} />
                    <span>{t('nav.getApp')}</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowLogoutModal(false)}
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.35 }}
              className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm border border-slate-100"
            >
              {/* Icon */}
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
                  <LogOut size={28} className="text-red-500" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
                {t('nav.logoutTitle', 'Log out?')}
              </h3>
              <p className="text-sm text-slate-500 text-center mb-7">
                {t('nav.logoutConfirm', 'Are you sure you want to log out of your account?')}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  {t('nav.cancel', 'Cancel')}
                </button>
                <button
                  onClick={() => { setShowLogoutModal(false); handleLogout(); }}
                  className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  {t('nav.yesLogout', 'Log out')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
