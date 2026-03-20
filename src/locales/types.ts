export type Locale = 'en' | 'zh-TW'

export type MessageDictionary = {
  localeLabel: string
  locales: Record<Locale, string>
  nav: {
    github: string
    home: string
    language: string
    project: string
  }
  home: {
    experience: {
      body1: string
      body2: string
      eyebrow: string
      title: string
    }
    featured: {
      body: string
      eyebrow: string
      link: string
      title: string
    }
    hero: {
      eyebrow: string
      github: string
      intro: string
      localVisits: string
      title: string
      viewProject: string
    }
    summary: string
    technical: {
      body: string
      eyebrow: string
      title: string
    }
  }
  project: {
    backHome: string
    detectedEnvironment: string
    hero: {
      body: string
      eyebrow: string
      title: string
    }
    intro: string
    platforms: {
      desktop: {
        body: string
        downloadMac: string
        downloadWindows: string
        eyebrow: string
        title: string
      }
      mac: {
        body: string
        download: string
        eyebrow: string
        title: string
      }
      mobile: {
        body: string
        eyebrow: string
        title: string
      }
      labels: {
        desktop: string
        mac: string
        mobile: string
        windows: string
      }
      windows: {
        body: string
        download: string
        eyebrow: string
        title: string
      }
    }
  }
}
