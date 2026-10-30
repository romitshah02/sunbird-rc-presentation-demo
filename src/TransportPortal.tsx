import { QRCodeSVG } from 'qrcode.react'
import BackLink from './BackLink'
import { useVpFlow } from './useVpFlow'
import { body, ENROLMENT_ID } from './bodies/transport'
import { evaluateTransport } from './processing/transport'
import { useI18n } from './i18n/i18n'

// Same request/poll flow and the same claims as every other page (see useVpFlow + VpPage) —
// this is only a different layout for the transport use case, built as a web portal rather
// than the shared centered-page template the other relying parties use.
export default function TransportPortal() {
  const { t, errorText } = useI18n()
  const { state, retry } = useVpFlow(body)
  const claims = state.status === 'verified' ? (state.claims[ENROLMENT_ID] ?? {}) : undefined
  const verdict = state.status === 'verified' ? evaluateTransport(state.claims) : null

  const field = (name: string) => {
    const v = claims?.[name]
    return v === undefined || v === null || v === '' ? '—' : String(v)
  }

  return (
    <main className="tp-page">
      <header className="tp-topbar">
        <BackLink />
        <div className="tp-brand">
          <span className="tp-mark" aria-hidden="true">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <rect x="4" y="5" width="16" height="12" rx="3" />
              <circle cx="8" cy="19" r="1.4" fill="#fff" stroke="none" />
              <circle cx="16" cy="19" r="1.4" fill="#fff" stroke="none" />
              <path d="M4 11h16" />
            </svg>
          </span>
          {t('transport.brand')}
        </div>
        <span className="tp-live-pill">
          <span className="tp-dot" aria-hidden="true" />
          {t('transport.online')}
        </span>
      </header>

      <div className="tp-main">
        <div className="tp-intro">
          <span className="tp-eyebrow">{t('transport.eyebrow')}</span>
          <h1>{t('transport.title')}</h1>
          <p>{t('transport.intro')}</p>
          <ol className="tp-steps">
            <li>
              <span className="tp-num">1</span>
              {t('transport.step1')}
            </li>
            <li>
              <span className="tp-num">2</span>
              {t('transport.step2')}
            </li>
            <li>
              <span className="tp-num">3</span>
              {t('transport.step3')}
            </li>
          </ol>
          <div className="tp-perks">
            <div className="tp-perk">
              <span className="tp-ic" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1f3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
              </span>
              <span>
                <strong>{t('transport.perk1.title')}</strong>
                {t('transport.perk1.text')}
              </span>
            </div>
            <div className="tp-perk">
              <span className="tp-ic" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1f3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
                </svg>
              </span>
              <span>
                <strong>{t('transport.perk2.title')}</strong>
                {t('transport.perk2.text')}
              </span>
            </div>
            <div className="tp-perk">
              <span className="tp-ic" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1f3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
                </svg>
              </span>
              <span>
                <strong>{t('transport.perk3.title')}</strong>
                {t('transport.perk3.text')}
              </span>
            </div>
          </div>
        </div>

        <div className="tp-ticket-wrap">
          <div className="tp-portal">
            {state.status === 'idle' && (
              <div className="tp-ticket">
                <p className="tp-ticket-label">{t('transport.pass')}</p>
                <p className="tp-status-text">{t('common.ready')}</p>
                <div className="tp-cta-row">
                  <button type="button" className="tp-cta" onClick={retry}>
                    {t('transport.scanCta')}
                  </button>
                </div>
              </div>
            )}

            {state.status === 'loading' && (
              <div className="tp-ticket">
                <p className="tp-ticket-label">{t('transport.pass')}</p>
                <p role="status" className="tp-status-text">
                  {t('common.preparing')}
                </p>
              </div>
            )}

            {state.status === 'error' && (
              <div className="tp-ticket" role="alert">
                <p className="tp-ticket-label">{t('transport.pass')}</p>
                <p className="tp-status-text">{errorText(state.error)}</p>
                <div className="tp-cta-row">
                  <button type="button" className="tp-cta" onClick={retry}>
                    {t('common.retry')}
                  </button>
                </div>
              </div>
            )}

            {state.status === 'ready' && (
              <div className="tp-ticket">
                <p className="tp-ticket-label">{t('transport.pass')}</p>
                <div className="tp-qr-card">
                  <QRCodeSVG
                    value={state.link}
                    size={256}
                    marginSize={2}
                    level="M"
                    bgColor="#ffffff"
                    fgColor="#13203f"
                    role="img"
                    aria-label={t('qr.alt')}
                  />
                </div>
                <div className="tp-ticket-foot">
                  <span>{t('transport.waiting')}</span>
                  <span>{t('transport.valid5min')}</span>
                </div>
              </div>
            )}

            {state.status === 'verified' && verdict && (
              <div className="tp-ticket" role="status">
                <p className="tp-ticket-label">{t('transport.pass')}</p>
                <span className={`tp-result-chip ${verdict.ok ? 'ok' : 'bad'}`}>
                  {verdict.ok ? t('transport.verified') : t('transport.declined')}
                </span>
                <p className="tp-headline">{verdict.ok ? t('transport.eligible') : t('transport.notEligible')}</p>
                <dl className="tp-claim-rows">
                  <div className="tp-row">
                    <dt>{t('label.institute')}</dt>
                    <dd>{field('instituteName')}</dd>
                  </div>
                  <div className="tp-row">
                    <dt>{t('label.program')}</dt>
                    <dd>{field('program')}</dd>
                  </div>
                  <div className="tp-row">
                    <dt>{t('label.status')}</dt>
                    <dd>{field('enrollmentStatus')}</dd>
                  </div>
                  {verdict.ok && (
                    <div className="tp-row tp-discount">
                      <dt>{t('transport.discountApplied')}</dt>
                      <dd className="tick-row">
                        <span className="tick on-dark" aria-hidden="true">✓</span>
                        {t('transport.discountValue')}
                      </dd>
                    </div>
                  )}
                </dl>
                <div className="tp-cta-row">
                  <button type="button" className="tp-cta" onClick={retry}>
                    {t('transport.again')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
