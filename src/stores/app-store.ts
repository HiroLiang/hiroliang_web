import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { defaultLocale } from '@/locales'
import type { Locale } from '@/locales/types'

type AppState = {
  locale: Locale
  setLocale: (locale: Locale) => void
  visitCount: number
  incrementVisits: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      locale: defaultLocale,
      setLocale: (locale) => set({ locale }),
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
      }),
    },
  ),
)
