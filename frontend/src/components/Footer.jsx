import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, MessageSquare } from 'lucide-react';

const socialLinks = [
  {
    label: 'Facebook',
    svg: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  },
  {
    label: 'Twitter',
    svg: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  },
  {
    label: 'LinkedIn',
    svg: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>,
  },
  {
    label: 'Instagram',
    svg: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  },
];
import { Link } from 'react-router-dom';

const Footer = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';

    return (
        <footer className="bg-gradient-to-b from-white to-slate-50 pt-16 pb-8 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
                    
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <img
                            src="/assets/logo.png"
                            alt="As'alny Logo"
                            className="h-55 w-auto object-contain -mt-12"
                        />
                        <p className={`text-slate-500 max-w-sm text-sm leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
                            {isRtl 
                                ? "اسألني.. منصتك الطبية المتكاملة لاستشارة أفضل الأطباء بكل سهولة وأمان."
                                : "As'alny.. Your integrated medical platform to consult the best doctors easily and safely."}
                        </p>
                        
                        <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse justify-end' : ''}`}>
                            {socialLinks.map((item) => (
                                <a key={item.label} href="#" aria-label={item.label} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#1E4DB7] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-blue-500/20 hover:-translate-y-1">
                                    {item.svg}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className={`${isRtl ? 'lg:pr-12' : 'lg:pl-12'}`}>
                        <h4 className={`text-slate-900 font-bold mb-6 text-lg ${isRtl ? 'text-right' : ''}`}>
                            {isRtl ? "روابط سريعة" : "Quick Links"}
                        </h4>
                        <ul className={`space-y-4 ${isRtl ? 'text-right' : ''}`}>
                            <li>
                                <Link to="/" className="text-slate-500 hover:text-[#1E4DB7] transition-colors font-medium">
                                    {t('nav.home', 'Home')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-slate-500 hover:text-[#1E4DB7] transition-colors font-medium">
                                    {t('nav.login', 'Login')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="text-slate-500 hover:text-[#1E4DB7] transition-colors font-medium">
                                    {t('nav.signup', 'Sign Up')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/ai-chat" className={`text-slate-500 hover:text-[#1E4DB7] transition-colors font-medium flex items-center gap-2 w-fit ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <MessageSquare size={16} />
                                    <span>As'alny AI</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support & Contact */}
                    <div>
                        <h4 className={`text-slate-900 font-bold mb-6 text-lg ${isRtl ? 'text-right' : ''}`}>
                            {isRtl ? "الدعم والتواصل" : "Support & Contact"}
                        </h4>
                        <div className={`space-y-4 ${isRtl ? 'text-right' : ''}`}>
                            <a href="mailto:support@asalny.com" className={`flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg hover:border-blue-100 transition-all group ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#1E4DB7] group-hover:bg-[#1E4DB7] group-hover:text-white transition-colors shrink-0">
                                    <Mail size={22} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 font-medium tracking-wider uppercase">
                                        {isRtl ? "راسلنا عبر الإيميل" : "Email Us"}
                                    </span>
                                    <span className="text-slate-700 font-bold">support@asalny.com</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
                    <p className="text-slate-500 font-medium">
                        © {new Date().getFullYear()} As'alny. {isRtl ? "جميع الحقوق محفوظة." : "All rights reserved."}
                    </p>
                    <div className={`flex gap-8 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <a href="#" className="text-slate-500 hover:text-[#1E4DB7] font-medium transition-colors">
                            {isRtl ? "سياسة الخصوصية" : "Privacy Policy"}
                        </a>
                        <a href="#" className="text-slate-500 hover:text-[#1E4DB7] font-medium transition-colors">
                            {isRtl ? "شروط الاستخدام" : "Terms of Service"}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
