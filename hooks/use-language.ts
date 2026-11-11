import { useMemo } from 'react';
import { AVAILABLE_LANGUAGES, type LanguageOption } from '@/i18n/languages';
import { useLanguageStore } from '@/stores/language-store';
import type { LanguageCode } from '@/schemas/language';

export interface UseLanguageResult {
  readonly currentLanguage: LanguageCode;
  readonly isHydrated: boolean;
  readonly availableLanguages: readonly LanguageOption[];
  readonly currentLanguageOption: LanguageOption;
  readonly setLanguage: (code: LanguageCode) => Promise<void>;
}

export const useLanguage = (): UseLanguageResult => {
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const isHydrated = useLanguageStore((state) => state.isHydrated);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const currentLanguageOption = useMemo(() => {
    const match = AVAILABLE_LANGUAGES.find((item) => item.code === currentLanguage);
    return match ?? AVAILABLE_LANGUAGES[0];
  }, [currentLanguage]);

  return {
    currentLanguage,
    isHydrated,
    availableLanguages: AVAILABLE_LANGUAGES,
    currentLanguageOption,
    setLanguage,
  };
};
