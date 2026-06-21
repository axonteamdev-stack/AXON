import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const savedLanguage = localStorage.getItem('language');
        return savedLanguage || i18n.language || 'en';
    });

    // Initialize i18n with saved language
    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage && savedLanguage !== i18n.language) {
            i18n.changeLanguage(savedLanguage);
            setLanguage(savedLanguage);
        }
    }, []);

    useEffect(() => {
        i18n.changeLanguage(language);
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
        localStorage.setItem('language', language);
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
    }, [language]);

    const toggleLanguage = () => setLanguage(l => l === 'en' ? 'ar' : 'en');

    const changeLanguage = (lng) => {
        if (['en', 'ar'].includes(lng)) setLanguage(lng);
    };

    return (
        <SettingsContext.Provider value={{
            language,
            toggleLanguage,
            changeLanguage,
            isRtl: language === 'ar',
        }}>
            {children}
        </SettingsContext.Provider>
    );
};
