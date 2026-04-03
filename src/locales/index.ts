import { enMessages } from '@/locales/en'
import { jaMessages } from '@/locales/ja'
import type { Locale, MessageDictionary } from '@/locales/types'
import { zhTWMessages } from '@/locales/zh-TW'

export const defaultLocale: Locale = 'en'

export const messages: Record<Locale, MessageDictionary> = {
  en: enMessages,
  ja: jaMessages,
  'zh-TW': zhTWMessages,
}
