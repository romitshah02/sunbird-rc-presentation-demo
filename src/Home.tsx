import { Link } from 'react-router-dom'
import { useI18n } from './i18n/i18n'

// Artwork lives in public/. It is decorative: the card title names the destination.
// Built from BASE_URL so it still loads when the app is served under a sub-path (vite `base`).
const BASE = import.meta.env.BASE_URL
const OPTIONS = [
  { to: '/theatre', tone: 'theatre', art: `${BASE}movie_page.svg`, title: 'home.theatre.title', note: 'home.theatre.note' },
  { to: '/transport', tone: 'transport', art: `${BASE}bus_page.svg`, title: 'home.transport.title', note: 'home.transport.note' },
  { to: '/bank', tone: 'bank', art: `${BASE}bank_page.svg`, title: 'home.bank.title', note: 'home.bank.note' },
] as const

export default function Home() {
  const { t } = useI18n()
  return (
    <main className="hm-page">
      <header className="hm-head">
        <h1 className="hm-title">{t('home.title')}</h1>
        <p className="hm-sub">{t('home.sub')}</p>
      </header>
      <nav className="hm-options" aria-label={t('home.nav')}>
        {OPTIONS.map((o) => (
          <Link key={o.to} to={o.to} className={`hm-card hm-${o.tone}`}>
            <span className="hm-art">
              <img src={o.art} alt="" decoding="async" />
            </span>
            <span className="hm-card-title">{t(o.title)}</span>
            <span className="hm-card-note">{t(o.note)}</span>
            <svg className="hm-go" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        ))}
      </nav>
    </main>
  )
}
