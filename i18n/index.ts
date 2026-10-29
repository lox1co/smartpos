import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { LANGUAGE_RESOURCES, resolveDeviceLanguage } from './languages';
import './types';

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    resources: LANGUAGE_RESOURCES,
    lng: resolveDeviceLanguage(),
    fallbackLng: 'en-US',
    defaultNS: 'common',
    ns: ['common', 'auth', 'profile', 'settings'],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

export { i18n };
export default i18n;
