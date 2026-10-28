import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Reason } from '../processing/types'
import type { FlowError } from '../vpRequest'
import en, { type Dict, type Key } from './en'
import pt from './pt'
import fr from './fr'
import es from './es'
import ar from './ar'

// Each language is named in its own language. To add one: new dictionary typed as Dict,
// then one entry in DICTS and LANGS (and in RTL_LANGS if it is written right to left).
export const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'ar', label: 'العربية' },
] as const
export type Lang = (typeof LANGS)[number]['code']

const DICTS: Record<Lang, Dict> = { en, pt, fr, es, ar }
const RTL_LANGS: ReadonlySet<Lang> = new Set<Lang>(['ar'])
const STORAGE_KEY = 'lang'

type Params = Record<string, string | number | undefined>

interface I18n {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: Key, params?: Params) => string
  // Text for a verdict reason / flow error (language-free data from processing/ and vpRequest).
  reasonText: (reason: Reason) => string
  errorText: (error: FlowError) => string
}

const I18nContext = createContext<I18n | null>(null)

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (LANGS.some((l) => l.code === saved)) return saved as Lang
  } catch {
    // storage blocked: fall through to the default
  }
  return 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = RTL_LANGS.has(lang) ? 'rtl' : 'ltr'
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // not persisted; the choice still applies for this visit
    }
  }, [lang])

  const value = useMemo<I18n>(() => {
    const dict = DICTS[lang]
    const t = (key: Key, params?: Params) =>
      dict[key].replace(/\{(\w+)\}/g, (m, k: string) => (params?.[k] != null ? String(params[k]) : m))
    return {
      lang,
      setLang,
      t,
      reasonText: ({ code, params }) => {
        const { fields, ...rest } = params ?? {}
        return t(`reason.${code}`, { ...rest, fields: fields?.map((f) => t(`claim.${f}`)).join(lang === 'ar' ? '، ' : ', ') })
      },
      errorText: ({ code, params }) => t(`error.${code}`, params),
    }
  }, [lang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}
