import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { ThemeMode } from '@/lib/theme'
import { defaultLocale } from '@/locales'
import type { Locale } from '@/locales/types'

type AppState = {
  locale: Locale
  setLocale: (locale: Locale) => void
  themeMode: ThemeMode
  setThemeMode: (themeMode: ThemeMode) => void
  visitCount: number
  incrementVisits: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      locale: defaultLocale,
      setLocale: (locale) => set({ locale }),
      themeMode: 'auto',
      setThemeMode: (themeMode) => set({ themeMode }),
      visitCount: 0,
      incrementVisits: () =>
        set((state) => ({
          visitCount: state.visitCount + 1,
        })),
    }),
    {
      name: 'app-preferences',
      partialize: (state) => ({
        locale: state.locale,
        themeMode: state.themeMode,
      }),
    },
  ),
)
