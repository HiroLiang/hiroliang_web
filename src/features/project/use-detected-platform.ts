import { useEffect, useState } from 'react'

export type Platform = 'mac' | 'windows' | 'mobile' | 'desktop'

function detectPlatform(userAgent: string, platform: string) {
  const normalizedUA = userAgent.toLowerCase()
  const normalizedPlatform = platform.toLowerCase()

  const isMobile =
    /android|iphone|ipad|ipod|mobile|windows phone/.test(normalizedUA) ||
    ('ontouchend' in window && /macintel/.test(normalizedPlatform))

  if (isMobile) {
    return 'mobile'
  }

  if (/mac/i.test(platform)) {
    return 'mac'
  }

  if (/win/i.test(platform)) {
    return 'windows'
  }

  return 'desktop'
}

export function useDetectedPlatform(): Platform {
  const [platform, setPlatform] = useState<Platform>(() =>
    detectPlatform(window.navigator.userAgent, window.navigator.platform),
  )

  useEffect(() => {
    const handleResize = () => {
      setPlatform(detectPlatform(window.navigator.userAgent, window.navigator.platform))
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return platform
}
