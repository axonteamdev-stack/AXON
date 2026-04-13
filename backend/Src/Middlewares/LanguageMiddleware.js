export const setLanguage = (req, res, next) => {
    // الموبايل هيبعت في الهيدر 'ar' أو 'en'
    // لو مبعتش حاجة، هنخلي الافتراضي 'ar'
    const lang = req.headers['language'] === 'en' ? 'en' : 'ar';
    req.lang = lang; 
    next();
};
