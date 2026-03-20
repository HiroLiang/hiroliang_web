import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useMessages } from '@/hooks/use-locale'
import { useAppStore } from '@/stores/app-store'

const skills = [
  'Java',
  'Spring Boot',
  'JBoss',
  'Docker',
  'OpenShift',
  'Angular',
  'Vue',
  'React',
  'Go',
  'Rust',
  'Tauri',
  'Ollama',
]

export function HomePage() {
  const t = useMessages()
  const visitCount = useAppStore((state) => state.visitCount)
  const incrementVisits = useAppStore((state) => state.incrementVisits)

  return (
    <div className="space-y-8">
      <section className="border-b border-border/70 pb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {t.home.hero.eyebrow}
        </p>
        <h1 className="max-w-[11ch] text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-6xl">
          {t.home.hero.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          {t.home.hero.intro}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/project">{t.home.hero.viewProject}</Link>
          </Button>
          <Button asChild variant="outline">
            <a href="https://github.com/HiroLiang" rel="noreferrer" target="_blank">
              {t.home.hero.github}
            </a>
          </Button>
          <Button onClick={incrementVisits} variant="ghost">
            {t.home.hero.localVisits} {visitCount}
          </Button>
        </div>
      </section>

      <section className="border-b border-border/70 pb-8">
        <p className="text-base leading-8 text-muted-foreground">{t.home.summary}</p>
      </section>

      <section className="space-y-4 border-b border-border/70 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {t.home.experience.eyebrow}
        </p>
        <h2 className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-foreground">
          {t.home.experience.title}
        </h2>
        <p className="text-base leading-8 text-muted-foreground">{t.home.experience.body1}</p>
        <p className="text-base leading-8 text-muted-foreground">{t.home.experience.body2}</p>
      </section>

      <section className="space-y-4 border-b border-border/70 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {t.home.technical.eyebrow}
        </p>
        <h2 className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-foreground">
          {t.home.technical.title}
        </h2>
        <p className="text-base leading-8 text-muted-foreground">{t.home.technical.body}</p>

        <div className="flex flex-wrap gap-x-3 gap-y-2 pt-2 text-sm text-muted-foreground">
          {skills.map((skill, index) => (
            <span key={skill}>
              {skill}
              {index < skills.length - 1 ? <span className="ml-3 text-border">/</span> : null}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {t.home.featured.eyebrow}
        </p>
        <h2 className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-foreground">
          {t.home.featured.title}
        </h2>
        <p className="text-base leading-8 text-muted-foreground">{t.home.featured.body}</p>
        <Link className="text-base font-semibold text-accent transition-colors hover:text-accent/80" to="/project">
          {t.home.featured.link}
        </Link>
      </section>
    </div>
  )
}
