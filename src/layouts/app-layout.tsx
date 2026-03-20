import { NavLink, Outlet } from 'react-router-dom'

import { useLocale, useMessages } from '@/hooks/use-locale'
import type { Locale } from '@/locales/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function AppLayout() {
  const { locale, setLocale } = useLocale()
  const t = useMessages()
  const navigationItems = [
    { label: t.nav.home, to: '/' },
    { label: t.nav.project, to: '/project' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-14 pt-7 sm:px-6 lg:px-8">
        <header className="mb-12 flex flex-col gap-4 border-b border-border/70 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <NavLink
            className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground"
            to="/"
          >
            Hiro Liang
          </NavLink>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <nav className="flex flex-wrap gap-5 text-sm">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.to}
                  className={({ isActive }) =>
                    [
                      'relative text-muted-foreground transition-colors duration-150 hover:text-foreground',
                      "after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:origin-left after:bg-accent after:transition-transform after:duration-150 after:content-['']",
                      isActive ? 'text-foreground after:scale-x-100' : 'after:scale-x-0',
                    ].join(' ')
                  }
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              ))}

              <a
                className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
                href="https://github.com/HiroLiang"
                rel="noreferrer"
                target="_blank"
              >
                {t.nav.github}
              </a>
            </nav>

            <div className="w-[120px]">
              <Select onValueChange={(value) => setLocale(value as Locale)} value={locale}>
                <SelectTrigger aria-label={t.nav.language} className="h-9 bg-transparent">
                  <SelectValue placeholder={t.localeLabel} />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="en">{t.locales.en}</SelectItem>
                  <SelectItem value="zh-TW">{t.locales['zh-TW']}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
