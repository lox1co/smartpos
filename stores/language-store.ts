import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { i18n } from '@/i18n';
import { resolveDeviceLanguage } from '@/i18n/languages';
import { languageCodeSchema, type LanguageCode } from '@/schemas/language';

interface LanguageState {
  readonly currentLanguage: LanguageCode;
  readonly isHydrated: boolean;
  readonly setLanguage: (code: LanguageCode) => Promise<void>;
  readonly setHydrated: (hydrated: boolean) => void;
}

const STORAGE_KEY = 'smartpos_language_preference';

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: resolveDeviceLanguage(),
      isHydrated: false,
      setLanguage: async (code: LanguageCode) => {
        const parsed = languageCodeSchema.safeParse(code);
        if (!parsed.success) {
          return;
        }
        await i18n.changeLanguage(parsed.data);
        set({ currentLanguage: parsed.data });
      },
      setHydrated: (hydrated: boolean) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }
        const parsed = languageCodeSchema.safeParse(state.currentLanguage);
        const resolvedLanguage = parsed.success ? parsed.data : resolveDeviceLanguage();
        void i18n.changeLanguage(resolvedLanguage);
        state.setHydrated(true);
      },
      partialize: (state) => ({
        currentLanguage: state.currentLanguage,
      }),
    }
  )
);
