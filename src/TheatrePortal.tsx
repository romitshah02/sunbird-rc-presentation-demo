import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import BackLink from './BackLink'
import { useVpFlow } from './useVpFlow'
import { body, ENROLMENT_ID, PROFILE_ID } from './bodies/theatre'
import { evaluateTheatre, type TicketType } from './processing/theatre'
import { useI18n } from './i18n/i18n'

// Placeholder poster — drop the real file in public/poster.jpg (same folder as favicon.svg).
const MOVIE_POSTER_SRC = `${import.meta.env.BASE_URL}image.png`

const OPTIONS = [
  { value: 'kid', label: 'theatre.kid' },
  { value: 'adult', label: 'theatre.adult' },
] as const

// Same request/poll flow as every other page (see useVpFlow), asking for the enrolment
// credential (status) and the profile credential (age only). The claim names don't overlap, so
// they are merged into one lookup for field(). Styled as a ticket stub.
export default function TheatrePortal() {
  const { t, reasonText, errorText } = useI18n()
  const movieTitle = t('theatre.movieTitle')
  const [type, setType] = useState<TicketType>('kid')
  const { state, retry } = useVpFlow(body)
  const verdict = state.status === 'verified' ? evaluateTheatre(type, state.claims) : null
  const claims = state.status === 'verified' ? ({ ...state.claims[PROFILE_ID], ...state.claims[ENROLMENT_ID] }) : undefined
  const who = verdict?.name ?? t('common.student')
  const field = (name: string) => {
    const v = claims?.[name]
    return v === undefined || v === null || v === '' ? '—' : String(v)
  }

  return (
    <main className="tt-page">
      <BackLink className="back-link-corner" />
      <div className="tt-ticket">
        <div className="tt-top">
          <div className="tt-top-text">
            <h1>{movieTitle}</h1>
            <p className="tt-meta">{t('theatre.meta')}</p>
            <p className="tt-venue-name">Cine Porto Verde</p>
            <p className="tt-venue-addr">
              Rua das Palmeiras, 450 — Centro
              <br />
              Porto Verde
            </p>
          </div>
          <img className="tt-poster" src={MOVIE_POSTER_SRC} alt={movieTitle} />
        </div>

        <div className="tt-session">
          <h3>{t('theatre.room')}</h3>
          <p className="tt-row">
            <span>{t('theatre.date')}</span>
            <span className="tt-sep">|</span>
            <span>19:30</span>
          </p>
          <p className="tt-type-label">{t('theatre.ticketType')}</p>
        </div>
        <div className="tt-options" role="group" aria-label={t('theatre.ticketType')}>
          {OPTIONS.map((o) => (
            <button key={o.value} type="button" aria-pressed={type === o.value} onClick={() => setType(o.value)}>
              {t(o.label)}
            </button>
          ))}
        </div>

        <div className="tt-perf">
          <span className="tt-notch tt-notch-left" />
          <span className="tt-notch tt-notch-right" />
        </div>

        {state.status === 'idle' && (
          <div className="tt-qr-zone">
            <p className="tt-status-text">{t('common.ready')}</p>
            <button type="button" className="tt-cta" onClick={retry}>
              {t('theatre.generate')}
            </button>
          </div>
        )}

        {state.status === 'loading' && (
          <div className="tt-qr-zone">
            <p role="status" className="tt-status-text">
              {t('common.preparing')}
            </p>
          </div>
        )}

        {state.status === 'error' && (
          <div className="tt-qr-zone" role="alert">
            <p className="tt-status-text">{errorText(state.error)}</p>
            <button type="button" className="tt-cta" onClick={retry}>
              {t('common.retry')}
            </button>
          </div>
        )}

        {state.status === 'ready' && (
          <div className="tt-qr-zone">
            <div className="tt-qr-card">
              <QRCodeSVG
                value={state.link}
                size={200}
                marginSize={2}
                level="M"
                bgColor="#ffffff"
                fgColor="#1c1a18"
                role="img"
                aria-label={t('qr.alt')}
              />
            </div>
            <p className="tt-qr-cap">
              {t('theatre.scan')}
              <br />
              <b>{t('common.valid5min')}</b>
            </p>
          </div>
        )}

        {state.status === 'verified' && verdict && (
          <>
            <div className="tt-qr-zone">
              <div className={`tt-result-icon ${verdict.ok ? 'ok' : 'bad'}`} aria-hidden="true">
                {verdict.ok ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                )}
              </div>
              <p className="tt-result-title">{verdict.ok ? t('theatre.valid') : t('theatre.notValid')}</p>
              <p className="tt-result-sub">{verdict.ok ? who : `${who}: ${verdict.reasons.map(reasonText).join('; ')}`}</p>
            </div>
            <div className="tt-foot">
              <dl className="tt-foot-list">
                <div className="tt-line">
                  <dt>{t('label.institute')}</dt>
                  <dd>{field('instituteName')}</dd>
                </div>
                <div className="tt-line">
                  <dt>{t('label.program')}</dt>
                  <dd>{field('program')}</dd>
                </div>
                <div className="tt-line">
                  <dt>{t('label.status')}</dt>
                  <dd>{field('enrollmentStatus')}</dd>
                </div>
                <div className="tt-line">
                  <dt>{t('label.age')}</dt>
                  <dd>{field('age')}</dd>
                </div>
                <div className="tt-line tt-total">
                  <dt>{t('common.result')}</dt>
                  <dd className={verdict.ok ? 'ok' : 'bad'}>
                    {verdict.ok ? t('theatre.granted') : t('theatre.denied')}
                  </dd>
                </div>
              </dl>
            </div>
            <button type="button" className="tt-cta" onClick={retry}>
              {t('theatre.again')}
            </button>
          </>
        )}
      </div>
    </main>
  )
}
