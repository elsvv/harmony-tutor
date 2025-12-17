import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ru from './locales/ru.json';

export const resources = {
    en: { translation: en },
    ru: { translation: ru },
} as const;

export type Language = 'en' | 'ru';

// Get initial language from localStorage or default to 'en'
const getInitialLanguage = (): Language => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('language');
        if (stored === 'en' || stored === 'ru') {
            return stored;
        }
    }
    return 'en';
};

i18n.use(initReactI18next).init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false, // React already escapes values
    },
    react: {
        useSuspense: false,
    },
});

// Helper to change language and persist to localStorage
export const changeLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    if (typeof window !== 'undefined') {
        localStorage.setItem('language', lang);
    }
};

export default i18n;
