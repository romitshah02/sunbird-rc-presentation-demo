import { QRCodeSVG } from 'qrcode.react'
import BackLink from './BackLink'
import { useVpFlow } from './useVpFlow'
import { body, CREDENTIAL_ID } from './bodies/bank'
import { evaluateBank } from './processing/bank'
import { useI18n } from './i18n/i18n'

const present = (v: unknown) => (typeof v === 'string' ? v.trim() !== '' : v != null)

// Same request/poll flow and the same 17 claims as every other page (see useVpFlow + VpPage) —
// this is only a different layout for the bank use case: a bank-style "account opening" page
// with a step tracker (sent -> processing -> result) instead of the shared centered template.
export default function BankPortal() {
  const { t, reasonText, errorText } = useI18n()
  const { state, retry } = useVpFlow(body)
  const claims = state.status === 'verified' ? (state.claims[CREDENTIAL_ID] ?? {}) : undefined
  const verdict = state.status === 'verified' ? evaluateBank(state.claims) : null

  const field = (name: string) => {
    const v = claims?.[name]
    return present(v) ? String(v) : '—'
  }

  const guardianFields = ['guardianName', 'guardianRelationship', 'guardianPhone'] as const
  const hasGuardianData = guardianFields.some((f) => present(claims?.[f]))

  const step1Done = state.status === 'ready' || state.status === 'verified'
  const step2Done = state.status === 'verified'

  return (
    <main className="bp-page">
      <header className="bp-topbar">
        <BackLink />
        <div className="bp-brand">
          <span className="bp-mark" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10 12 4l9 6" />
              <path d="M5 10v9M9.5 10v9M14.5 10v9M19 10v9" />
              <path d="M3 19h18" />
            </svg>
          </span>
          Banco Horizonte
        </div>
        <nav className="bp-nav" aria-hidden="true">
          <span>{t('bank.navPersonal')}</span>
          <span className="current">{t('bank.navAccount')}</span>
          <span>{t('bank.navHelp')}</span>
        </nav>
      </header>

      <div className="bp-hero">
        <span className="bp-eyebrow">{t('bank.eyebrow')}</span>
        <h1>{t('bank.title')}</h1>
        <p>{t('bank.intro')}</p>
        <div className="bp-hero-trust">
          <div className="bp-trust-item">
            <span className="bp-trust-ic" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c4fe0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </span>
            {t('bank.trust1')}
          </div>
          <div className="bp-trust-item">
            <span className="bp-trust-ic" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c4fe0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
              </svg>
            </span>
            {t('bank.trust2')}
          </div>
          <div className="bp-trust-item">
            <span className="bp-trust-ic" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c4fe0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12.75 11.25 15 15 9.75" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </span>
            {t('bank.trust3')}
          </div>
        </div>
      </div>

      <div className="bp-card-wrap">
        <div className="bp-card">
          <div className="bp-card-brand">
            <span className="bp-mark" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 10 12 4l9 6" />
                <path d="M5 10v9M9.5 10v9M14.5 10v9M19 10v9" />
                <path d="M3 19h18" />
              </svg>
            </span>
            {t('bank.cardBrand')}
          </div>

          <ol className="bp-stepper">
            <li className={`bp-step ${step1Done ? 'done' : state.status === 'loading' ? 'active' : 'pending'}`}>
              <div className="bp-step-rail">
                <span className="bp-step-dot">
                  {step1Done && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                  {state.status === 'loading' && <span className="bp-ring-fill" />}
                </span>
                <span className="bp-step-line" />
              </div>
              <div className="bp-step-body">
                <h4>{t('bank.step1.title')}</h4>
                <p>{t('bank.step1.note')}</p>
              </div>
            </li>

            <li className={`bp-step ${step2Done ? 'done' : state.status === 'ready' ? 'active' : 'pending'}`}>
              <div className="bp-step-rail">
                <span className="bp-step-dot">
                  {step2Done && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                  {state.status === 'ready' && <span className="bp-ring-fill" />}
                </span>
                <span className="bp-step-line" />
              </div>
              <div className="bp-step-body">
                <h4>{t('bank.step2.title')}</h4>
                <p>{t('bank.step2.note')}</p>
              </div>
            </li>

            <li
              className={`bp-step ${
                state.status === 'verified' ? (verdict?.ok ? 'final-ok' : 'final-bad') : 'pending'
              }`}
            >
              <div className="bp-step-rail">
                <span className="bp-step-dot">
                  {state.status === 'verified' &&
                    (verdict?.ok ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 6l12 12M18 6 6 18" />
                      </svg>
                    ))}
                </span>
              </div>
              <div className="bp-step-body">
                <h4>
                  {state.status === 'verified' && verdict
                    ? verdict.ok
                      ? t('bank.eligible')
                      : t('bank.notEligible')
                    : t('common.result')}
                </h4>
                <p>{t('bank.step3.note')}</p>
              </div>
            </li>
          </ol>

          <hr className="bp-divider" />

          {state.status === 'idle' && (
            <div className="bp-qr-block">
              <p className="bp-lead">{t('bank.leadIdle')}</p>
              <button type="button" className="bp-cta" onClick={retry}>
                {t('bank.share')}
              </button>
            </div>
          )}

          {state.status === 'loading' && (
            <p role="status" className="bp-status-text">
              {t('common.preparing')}
            </p>
          )}

          {state.status === 'error' && (
            <div role="alert">
              <p className="bp-status-text">{errorText(state.error)}</p>
              <button type="button" className="bp-cta" onClick={retry}>
                {t('common.retry')}
              </button>
            </div>
          )}

          {state.status === 'ready' && (
            <div className="bp-qr-block">
              <p className="bp-lead">{t('bank.leadReady')}</p>
              <div className="bp-qr-card">
                <QRCodeSVG
                  value={state.link}
                  size={200}
                  marginSize={2}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#1b2130"
                  role="img"
                  aria-label={t('qr.alt')}
                />
              </div>
              <p className="bp-qr-cap">{t('common.valid5min')}</p>
            </div>
          )}

          {state.status === 'verified' && verdict && (
            <>
              <p className="bp-result-name">{field('studentName')}</p>

              {verdict.ok ? (
                <>
                  <div className="bp-section">
                    <h3>{t('bank.personal')}</h3>
                    <dl>
                      <div className="bp-kv"><dt>{t('label.age')}</dt><dd>{field('age')}</dd></div>
                      <div className="bp-kv"><dt>{t('bank.gender')}</dt><dd>{field('gender')}</dd></div>
                      <div className="bp-kv"><dt>{t('claim.contactEmail')}</dt><dd>{field('contactEmail')}</dd></div>
                      <div className="bp-kv"><dt>{t('claim.phone')}</dt><dd>{field('phone')}</dd></div>
                      <div className="bp-kv"><dt>{t('claim.address')}</dt><dd>{field('address')}</dd></div>
                      <div className="bp-kv"><dt>{t('claim.nationality')}</dt><dd>{field('nationality')}</dd></div>
                    </dl>
                  </div>

                  <div className="bp-section">
                    <h3>{t('bank.academic')}</h3>
                    <dl>
                      <div className="bp-kv"><dt>{t('label.institute')}</dt><dd>{field('instituteName')}</dd></div>
                      <div className="bp-kv"><dt>{t('bank.program')}</dt><dd>{field('program')}</dd></div>
                      <div className="bp-kv"><dt>{t('bank.course')}</dt><dd>{field('courseName')}</dd></div>
                      <div className="bp-kv"><dt>{t('label.enrolledSince')}</dt><dd>{field('enrollmentDate')}</dd></div>
                      <div className="bp-kv"><dt>{t('label.status')}</dt><dd>{field('status')}</dd></div>
                      <div className="bp-kv"><dt>{t('bank.completion')}</dt><dd>{field('completionStatus')}</dd></div>
                      <div className="bp-kv"><dt>{t('bank.percentage')}</dt><dd>{field('percentage')}</dd></div>
                    </dl>
                  </div>

                  {hasGuardianData ? (
                    <div className="bp-section">
                      <h3>{t('bank.guardian')}</h3>
                      <dl>
                        <div className="bp-kv"><dt>{t('bank.guardianName')}</dt><dd>{field('guardianName')}</dd></div>
                        <div className="bp-kv"><dt>{t('bank.guardianRelationship')}</dt><dd>{field('guardianRelationship')}</dd></div>
                        <div className="bp-kv"><dt>{t('bank.guardianPhone')}</dt><dd>{field('guardianPhone')}</dd></div>
                      </dl>
                    </div>
                  ) : (
                    <p className="bp-guardian-note">{t('bank.adultNote')}</p>
                  )}
                </>
              ) : (
                <>
                  <div className="bp-section">
                    <h3>{t('bank.issues')}</h3>
                    <ul className="bp-pendencias">
                      {verdict.reasons.map(reasonText).map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bp-section">
                    <h3>{t('bank.received')}</h3>
                    <dl>
                      <div className="bp-kv"><dt>{t('claim.contactEmail')}</dt><dd>{field('contactEmail')}</dd></div>
                      <div className="bp-kv"><dt>{t('label.institute')}</dt><dd>{field('instituteName')}</dd></div>
                      <div className="bp-kv"><dt>{t('label.status')}</dt><dd>{field('status')}</dd></div>
                    </dl>
                  </div>
                </>
              )}

              <button type="button" className="bp-pill-btn" onClick={retry}>
                {verdict.ok ? t('bank.another') : t('common.retry')}
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
