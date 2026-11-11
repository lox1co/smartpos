import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserSession, userSessionSchema } from '@/schemas/session';
import { secureStorage } from '@/utils/secure-storage';

interface SessionState {
  currentUser: UserSession | null;
  isHydrated: boolean;
  setSession: (user: UserSession | null) => void;
  updateProfile: (partial: Partial<UserSession>) => void;
  clearSession: () => void;
  setHydrated: (hydrated: boolean) => void;
}

const STORAGE_KEY = 'smartpos_session_secure_v1';

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      currentUser: null,
      isHydrated: false,

      setSession: (user) => {
        if (!user) {
          set({ currentUser: null });
          return;
        }
        const parsed = userSessionSchema.safeParse(user);
        if (parsed.success) {
          set({ currentUser: parsed.data });
        }
      },

      updateProfile: (partial) => {
        set((state) => {
          if (!state.currentUser) return state;
          const merged = { ...state.currentUser, ...partial };
          const parsed = userSessionSchema.safeParse(merged);
          return { currentUser: parsed.success ? parsed.data : state.currentUser };
        });
      },

      clearSession: () => set({ currentUser: null }),
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => secureStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      partialize: (state) => ({
        currentUser: state.currentUser,
      }),
    }
  )
);
