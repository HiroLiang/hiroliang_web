import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

import { useLocale, useMessages } from '@/hooks/use-locale'
import { useTheme } from '@/hooks/use-theme'
import type { ThemeMode } from '@/lib/theme'
import type { Locale } from '@/locales/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const MOBILE_BREAKPOINT_QUERY = '(max-width: 639px)'
const MOBILE_HEADER_SHOW_DELTA_PX = 24
const MOBILE_HEADER_HIDE_DELTA_PX = 10

export function AppLayout() {
  const { locale, setLocale } = useLocale()
  const { themeMode, setThemeMode } = useTheme()
  const t = useMessages()
  const location = useLocation()
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const [isMobileHeaderVisible, setIsMobileHeaderVisible] = useState(false)
  const gestureStartYRef = useRef<number | null>(null)
  const consumedGestureRef = useRef(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT_QUERY)
    const updateViewport = () => {
      const matches = mediaQuery.matches
      setIsMobileViewport(matches)
      setIsMobileHeaderVisible((current) => (matches ? current : true))
    }

    updateViewport()
    mediaQuery.addEventListener('change', updateViewport)

    return () => {
      mediaQuery.removeEventListener('change', updateViewport)
    }
  }, [])

  useEffect(() => {
    if (!isMobileViewport) {
      gestureStartYRef.current = null
      consumedGestureRef.current = false
      return
    }

    const scrollRoots = Array.from(document.querySelectorAll<HTMLElement>('[data-app-scroll-root="true"]'))
    if (scrollRoots.length === 0) {
      return
    }

    function handleTouchStart(event: TouchEvent) {
      const touch = event.touches[0]
      if (!touch) {
        return
      }

      gestureStartYRef.current = touch.clientY
      consumedGestureRef.current = false
    }

    function handleTouchMove(event: TouchEvent) {
      const touch = event.touches[0]
      const gestureStartY = gestureStartYRef.current
      const currentTarget = event.currentTarget

      if (!touch || gestureStartY === null || !(currentTarget instanceof HTMLElement) || consumedGestureRef.current) {
        return
      }

      const deltaY = touch.clientY - gestureStartY
      const isAtTop = currentTarget.scrollTop <= 0

      if (!isMobileHeaderVisible && isAtTop && deltaY >= MOBILE_HEADER_SHOW_DELTA_PX) {
        setIsMobileHeaderVisible(true)
        consumedGestureRef.current = true
        gestureStartYRef.current = null
        return
      }

      if (isMobileHeaderVisible && deltaY <= -MOBILE_HEADER_HIDE_DELTA_PX) {
        setIsMobileHeaderVisible(false)
        consumedGestureRef.current = true
        gestureStartYRef.current = null
      }
    }

    function resetGesture() {
      gestureStartYRef.current = null
      consumedGestureRef.current = false
    }

    scrollRoots.forEach((root) => {
      root.addEventListener('touchstart', handleTouchStart, { passive: true })
      root.addEventListener('touchmove', handleTouchMove, { passive: false })
      root.addEventListener('touchend', resetGesture, { passive: true })
      root.addEventListener('touchcancel', resetGesture, { passive: true })
    })

    return () => {
      scrollRoots.forEach((root) => {
        root.removeEventListener('touchstart', handleTouchStart)
        root.removeEventListener('touchmove', handleTouchMove)
        root.removeEventListener('touchend', resetGesture)
        root.removeEventListener('touchcancel', resetGesture)
      })
    }
  }, [isMobileHeaderVisible, isMobileViewport, location.pathname])

  const mobileMainTopPadding = isMobileViewport ? (isMobileHeaderVisible ? 76 : 10) : 0
  const headerVisibilityClass = isMobileViewport
    ? isMobileHeaderVisible
      ? 'translate-y-0 opacity-100'
      : '-translate-y-[calc(100%-0.8rem)] opacity-0'
    : 'translate-y-0 opacity-100'

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground">
      <div
        className="flex h-screen w-full flex-col overflow-hidden pt-0"
        style={{ paddingTop: mobileMainTopPadding }}
      >
        <header
          className={[
            'app-navbar z-50 border-border/70 bg-background/92 backdrop-blur transition-transform duration-200 ease-out',
            isMobileViewport
              ? `fixed inset-x-0 top-0 w-full flex items-center justify-between gap-3 rounded-b-2xl border border-t-0 px-3 py-3 ${headerVisibilityClass}`
              : 'mb-3 flex flex-col gap-4 rounded-b-2xl border border-t-0 px-3 py-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 lg:px-6',
          ].join(' ')}
        >
          <NavLink
            className="flex min-w-0 shrink items-baseline gap-x-3 gap-y-1 whitespace-nowrap"
            to="/"
          >
            <span className="truncate text-xs font-semibold uppercase tracking-[0.18em] text-foreground sm:text-sm">
              Hiro Liang
            </span>
          </NavLink>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <nav className="flex shrink-0 flex-row gap-3 whitespace-nowrap text-xs sm:gap-5 sm:text-sm">
              <a
                className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
                href="https://github.com/HiroLiang"
                rel="noreferrer"
                target="_blank"
              >
                {t.nav.github}
              </a>
            </nav>

            <div className="w-[84px] shrink-0 sm:w-[120px]">
              <Select onValueChange={(value) => setLocale(value as Locale)} value={locale}>
                <SelectTrigger
                  aria-label={t.nav.language}
                  className="app-navbar-select-trigger h-9 bg-transparent px-2 text-xs sm:text-sm"
                >
                  <SelectValue placeholder={t.localeLabel} />
                </SelectTrigger>
                <SelectContent align="end" className="app-navbar-select-content">
                  <SelectItem value="en">{t.locales.en}</SelectItem>
                  <SelectItem value="ja">{t.locales.ja}</SelectItem>
                  <SelectItem value="zh-TW">{t.locales['zh-TW']}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[84px] shrink-0 sm:w-[120px]">
              <Select onValueChange={(value) => setThemeMode(value as ThemeMode)} value={themeMode}>
                <SelectTrigger
                  aria-label={t.nav.theme}
                  className="app-navbar-select-trigger h-9 bg-transparent px-2 text-xs sm:text-sm"
                >
                  <SelectValue placeholder={t.nav.theme} />
                </SelectTrigger>
                <SelectContent align="end" className="app-navbar-select-content">
                  <SelectItem value="dark">{t.themeModes.dark}</SelectItem>
                  <SelectItem value="bright">{t.themeModes.bright}</SelectItem>
                  <SelectItem value="auto">{t.themeModes.auto}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 overflow-hidden px-3 pb-3 sm:px-5 sm:pb-4 lg:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
