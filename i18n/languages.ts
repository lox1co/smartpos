import * as Localization from 'expo-localization';
import type { LanguageCode } from '@/schemas/language';
import { enUS } from './locales/en-US';
import { es419 } from './locales/es-419';

export interface LanguageOption {
  readonly code: LanguageCode;
  readonly label: string;
  readonly regionalLabel: string;
}

export const AVAILABLE_LANGUAGES: readonly LanguageOption[] = [
  {
    code: 'en-US',
    label: 'English',
    regionalLabel: 'English (US)',
  },
  {
    code: 'es-419',
    label: 'Español',
    regionalLabel: 'Español (Latinoamérica)',
  },
] as const;

export const LANGUAGE_RESOURCES = {
  'en-US': enUS,
  'es-419': es419,
} as const;

export const resolveDeviceLanguage = (): LanguageCode => {
  const locales = Localization.getLocales();
  const primaryLocale = locales[0];
  if (!primaryLocale) {
    return 'en-US';
  }
  const languageTag = primaryLocale.languageTag.toLowerCase();
  const languageCode = primaryLocale.languageCode?.toLowerCase() ?? '';
  if (languageTag.startsWith('es') || languageCode === 'es') {
    return 'es-419';
  }
  return 'en-US';
};
