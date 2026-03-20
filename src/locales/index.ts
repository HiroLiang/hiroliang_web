import { enMessages } from '@/locales/en'
import type { Locale, MessageDictionary } from '@/locales/types'
import { zhTWMessages } from '@/locales/zh-TW'

export const defaultLocale: Locale = 'en'

export const messages: Record<Locale, MessageDictionary> = {
  en: enMessages,
  'zh-TW': zhTWMessages,
}
