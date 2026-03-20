import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useDetectedPlatform } from '@/features/project/use-detected-platform'
import { useMessages } from '@/hooks/use-locale'

const MAC_DOWNLOAD_URL =
  'https://github.com/HiroLiang/tentserv-chat/releases/download/v0.0.1-alpha1/tentserv-chat_0.1.0_universal.dmg'
const WINDOWS_DOWNLOAD_URL =
  'https://github.com/HiroLiang/tentserv-chat/releases/download/v0.0.1-alpha1/tentserv-chat_0.1.0_x64-setup.zip'

export function ProjectPage() {
  const platform = useDetectedPlatform()
  const t = useMessages()
  const platformLabels = t.project.platforms.labels

  return (
    <div className="space-y-8">
      <section className="border-b border-border/70 pb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {t.project.hero.eyebrow}
        </p>
        <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-5xl">
          {t.project.hero.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{t.project.hero.body}</p>
      </section>

      <section className="space-y-4 border-b border-border/70 pb-8">
        <p className="text-base leading-8 text-muted-foreground">{t.project.intro}</p>
        <p className="text-sm text-muted-foreground">
          {t.project.detectedEnvironment}:{' '}
          <strong className="text-foreground">{platformLabels[platform]}</strong>
        </p>
      </section>

      {platform === 'mobile' ? (
        <section className="space-y-4 border-b border-border/70 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {t.project.platforms.mobile.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-foreground">
            {t.project.platforms.mobile.title}
          </h2>
          <p className="text-base leading-8 text-muted-foreground">{t.project.platforms.mobile.body}</p>
        </section>
      ) : null}

      {platform === 'mac' ? (
        <section className="space-y-4 border-b border-border/70 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {t.project.platforms.mac.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-foreground">
            {t.project.platforms.mac.title}
          </h2>
          <p className="text-base leading-8 text-muted-foreground">{t.project.platforms.mac.body}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href={MAC_DOWNLOAD_URL}>{t.project.platforms.mac.download}</a>
            </Button>
          </div>
        </section>
      ) : null}

      {platform === 'windows' ? (
        <section className="space-y-4 border-b border-border/70 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {t.project.platforms.windows.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-foreground">
            {t.project.platforms.windows.title}
          </h2>
          <p className="text-base leading-8 text-muted-foreground">{t.project.platforms.windows.body}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href={WINDOWS_DOWNLOAD_URL}>{t.project.platforms.windows.download}</a>
            </Button>
          </div>
        </section>
      ) : null}

      {platform === 'desktop' ? (
        <section className="space-y-4 border-b border-border/70 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {t.project.platforms.desktop.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-foreground">
            {t.project.platforms.desktop.title}
          </h2>
          <p className="text-base leading-8 text-muted-foreground">{t.project.platforms.desktop.body}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href={MAC_DOWNLOAD_URL}>{t.project.platforms.desktop.downloadMac}</a>
            </Button>
            <Button asChild variant="outline">
              <a href={WINDOWS_DOWNLOAD_URL}>{t.project.platforms.desktop.downloadWindows}</a>
            </Button>
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <Link className="text-base font-semibold text-accent transition-colors hover:text-accent/80" to="/">
          {t.project.backHome}
        </Link>
      </section>
    </div>
  )
}
