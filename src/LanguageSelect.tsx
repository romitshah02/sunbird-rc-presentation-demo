import { LANGS, useI18n, type Lang } from './i18n/i18n'

// One dropdown for the whole app (rendered in main.tsx, outside <Routes>).
export default function LanguageSelect() {
  const { lang, setLang, t } = useI18n()
  return (
    <select
      className="ls-select"
      value={lang}
      aria-label={t('lang.label')}
      onChange={(e) => setLang(e.target.value as Lang)}
    >
      {LANGS.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  )
}
