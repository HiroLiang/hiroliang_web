import type { MessageDictionary } from '@/locales/types'

export const enMessages: MessageDictionary = {
  localeLabel: 'Language',
  locales: {
    en: 'English',
    'zh-TW': '繁體中文',
  },
  nav: {
    github: 'GitHub',
    home: 'Home',
    language: 'Language',
    project: 'Project',
  },
  home: {
    chat: {
      errorFallback: 'The server did not return a usable reply.',
      introMessage: "Hi, my name is Hiro Liang. I'm a software engineer building practical systems and tools.",
      inputPlaceholder: 'try /profile',
      send: 'Send',
      streaming: 'Streaming…',
      unknownCommand: 'Unknown command. Try /profile, /github, /projects, /note, or /clean.',
    },
    experience: {
      body1:
        'As AI continues to evolve, I do not fully agree with the idea that it will simply eliminate junior roles. What feels closer to reality is that the nature of work itself is being redefined. Just as automation replaced traditional craftsmanship, junior engineers are no longer only learning how to build, but are also expected much earlier to operate systems, tune parameters, understand why failures happen, and handle basic maintenance and optimization. In many ways, this means earlier exposure to abilities that used to belong more clearly to senior roles; meanwhile, purely manual skills that do not interact with systems will have less and less space in scalable environments.',
      body2:
        'AI makes many capabilities that once took years to accumulate much more accessible. The gap in information and technical skill is shrinking, but that does not make competition easier; if anything, it raises the bar. The real differentiator is shifting toward the ability to understand problems across domains, to use AI as a tool rather than a crutch, and to build workable solutions in unfamiliar areas. A single language, or a single narrowly defined role, no longer feels like a durable advantage. What I am intentionally developing instead is cross-domain understanding, extending beyond software engineering itself into system and platform design, user experience, product thinking, and even design, content, business, and market awareness. The goal is not to master everything, but to quickly understand, adapt, and build something usable when needed.',
      eyebrow: 'Notes',
      title: 'Thoughts Beyond Building Systems',
    },
    featured: {
      body: 'A desktop-focused chat project built for practical use. The project page detects your device and gives you the right download link for macOS or Windows.',
      eyebrow: 'Featured Work',
      link: 'Open project page',
      title: 'Tentserv Chat',
    },
    hero: {
      eyebrow: 'Software Engineer · System Architect',
      github: 'GitHub',
      intro:
        'I started in backend engineering for banking systems and gradually moved into system architecture and technical decision-making, building practical experience in stability, evolvability, and delivery risk.',
      localVisits: 'Local Visits',
      title: 'Designing systems that last and software teams can maintain.',
      viewProject: 'View Project',
    },
    summary:
      'I care about how systems behave under pressure, how controllable they remain when failures occur, and whether their structure stays clear as they continue to evolve. Rather than pursuing complex designs, I prefer simple and verifiable solutions that teams can understand, maintain, and extend over the long term.',
    technical: {
      body: 'My technical focus includes long-term system architecture, service reliability and failure mode analysis, deployment and delivery risk management, observability, and simplifying complex systems into structures that remain workable over time. My stack spans Java, Go, Rust, Docker, GCP, JBoss, Angular, Vue, and React, with continued exploration in Tauri, Ollama, and local AI tooling.',
      eyebrow: 'Areas of Focus',
      title: 'Focused on evolvable architecture, reliability, and clear structure.',
    },
    panels: {
      experiences: {
        description: 'Beyond building systems and architecture, I keep thinking about how technology changes the way people work.',
        title: 'Notes',
      },
      github: {
        body: 'GitHub is where I publish experiments, desktop tooling, and the work that supports this portfolio direction.',
        cta: 'Open GitHub profile',
        eyebrow: 'External',
        title: 'GitHub',
      },
      profile: {
        body: 'I focus not only on building features, but on how systems behave and survive in real-world production over time.',
        skillsLabel: 'Core tools',
        title: 'Profile',
      },
      projects: {
        description: 'Featured project details with environment-aware downloads and practical context.',
        title: 'Projects',
      },
    },
  },
  project: {
    backHome: 'Back to home',
    backToProjects: 'Back to projects',
    ctaGithub: 'View source and updates on GitHub',
    detectedEnvironment: 'Detected environment',
    downloadsSectionTitle: 'Downloads',
    linkSectionTitle: 'Links',
    overviewSectionTitle: 'Overview',
    projects: {
      plantCare: {
        githubCta: 'Open plant-care on GitHub',
        sections: {
          architecture: {
            body: 'The repository is organized around a clear data path: STM32 devices publish sensor data over CAN bus, Raspberry Pi services convert that into gRPC and HTTP APIs, and the React UI consumes those APIs for monitoring and control.',
            title: 'Architecture',
          },
          intro: {
            body: 'Plant Care System is an IoT monorepo for plant monitoring and control built around Raspberry Pi and STM32 hardware, with separate services for device communication, monitoring APIs, command flows, and the web interface.',
            title: 'Project Intro',
          },
          repoValue: {
            body: 'It is structured as a multi-service workspace with shared contracts, generated protobuf stubs, and clean-architecture-style Python services, making it a strong example of service boundaries and hardware-aware backend design.',
            title: 'Repository Value',
          },
        },
        summary: 'An IoT monorepo for plant monitoring and control on Raspberry Pi + STM32 hardware.',
        title: 'Plant Care System',
      },
      tentservChat: {
        sections: {
          overview: {
            body1: 'Tentserv Chat is a desktop-focused chat application designed to keep the installation flow simple while still adapting to the device you are using.',
            body2: 'The project balances a practical release workflow with a clean delivery experience, so the same page can guide Mac, Windows, and unsupported mobile visitors with the right next step.',
          },
        },
        summary: 'A desktop-focused chat application with environment-aware downloads for macOS and Windows.',
        title: 'Tentserv Chat',
      },
    },
    selectorLabel: 'Projects',
    selectorPrompt: 'Choose a project to open its detail view.',
    hero: {
      body: 'A desktop release with separate installers for macOS and Windows, presented in a simple page that adapts to the device you are currently using.',
      eyebrow: 'Featured Project',
      title: 'Tentserv Chat',
    },
    intro:
      'This page checks whether you are browsing from macOS, Windows, or a mobile device, then adjusts the available download action and setup instructions.',
    platforms: {
      desktop: {
        body: 'I could not confidently detect macOS or Windows, so both desktop downloads are available here.',
        downloadMac: 'macOS DMG',
        downloadWindows: 'Windows ZIP',
        eyebrow: 'Desktop',
        title: 'Select the installer that matches your computer.',
      },
      labels: {
        desktop: 'Desktop',
        mac: 'macOS',
        mobile: 'Mobile',
        windows: 'Windows',
      },
      mac: {
        body: 'This build is for Mac users who want the native desktop release. Download the DMG, open it, then move the app into Applications before launching.',
        download: 'Download for macOS',
        eyebrow: 'macOS',
        title: 'Download the universal DMG for macOS.',
      },
      mobile: {
        body: 'Tentserv Chat is available as a desktop release right now. Please open this page on a Mac or Windows computer to download the installer.',
        eyebrow: 'Mobile',
        title: 'Currently not supported on mobile devices.',
      },
      windows: {
        body: 'This build is for Windows users. Download the ZIP package, extract it, and run the included setup executable to install the app.',
        download: 'Download for Windows',
        eyebrow: 'Windows',
        title: 'Download the Windows setup package.',
      },
    },
  },
}
