import { QRCodeSVG } from 'qrcode.react'
import { Link } from 'react-router-dom'
import BackLink from './BackLink'
import { useVpFlow } from './useVpFlow'
import { useCheckSequence } from './useCheckSequence'
import { body, CREDENTIAL_ID } from './bodies/education'
import { evaluateEducation } from './processing/education'
import { useI18n } from './i18n/i18n'

const present = (v: unknown) => (typeof v === 'string' ? v.trim() !== '' : v != null)
const CHECK_COUNT = 3

type PillKind = 'pending' | 'notRequested' | 'ok' | 'bad'
type RowState = 'notRequested' | 'waiting' | 'checking' | 'done'

// Same request/poll flow as every other page (see useVpFlow + VpPage) — this is the
// full-disclosure endpoint (Verification Endpoint 3), laid out as a university back-office
// record screen (sidebar + profile header + detail panels) instead of the ticket/stepper
// layouts the other relying parties use. The three credential checks are always true once
// `state.status === 'verified'` — the verifier only reports that after the signature and
// status-list checks pass — so they are not re-derived from claims; they are only animated
// into view one at a time (useCheckSequence) instead of appearing all at once. Only transfer
// eligibility (processing/education.ts) is computed from the disclosed claims.
export default function EducationPortal() {
  const { t, reasonText, errorText } = useI18n()
  const { state, retry } = useVpFlow(body)
  const claims = state.status === 'verified' ? (state.claims[CREDENTIAL_ID] ?? {}) : undefined
  const verdict = state.status === 'verified' ? evaluateEducation(state.claims) : null
  const verified = state.status === 'verified'
  const { done: checksDone, settled } = useCheckSequence(verified, CHECK_COUNT)

  const field = (name: string) => {
    const v = claims?.[name]
    return present(v) ? String(v) : '—'
  }

  const rowState = (index: number): RowState => {
    if (!verified) return 'notRequested'
    if (index < checksDone) return 'done'
    if (index === checksDone) return 'checking'
    return 'waiting'
  }
  const rowStatusText = (row: RowState) =>
    row === 'done' ? t('common.passed') : row === 'checking' ? t('common.checking') : row === 'waiting' ? t('common.waiting') : t('common.notRequested')

  const credentialPill: { kind: PillKind; text: string } = settled
    ? { kind: 'ok', text: t('common.completed') }
    : state.status === 'idle'
      ? { kind: 'notRequested', text: t('common.notRequested') }
      : { kind: 'pending', text: t('common.pending') }
  const eligibilityPill: { kind: PillKind; text: string } = settled
    ? verdict?.ok
      ? { kind: 'ok', text: t('education.eligibleShort') }
      : { kind: 'bad', text: t('education.reviewShort') }
    : state.status === 'idle'
      ? { kind: 'notRequested', text: t('common.notRequested') }
      : { kind: 'pending', text: t('common.pending') }

  return (
    <div className="ed-shell">
      <aside className="ed-sidebar">
        <Link to="/" className="ed-sidebar-brand">
          <span className="ed-mark" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10 12 5 2 10l10 5 10-5Z" />
              <path d="M6 12.5V17c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />
            </svg>
          </span>
          {t('education.brand')}
        </Link>
        <nav>
          <span className="ed-sidebar-item current">{t('education.sidebarVerification')}</span>
          <span className="ed-sidebar-item">{t('education.sidebarQueue')}</span>
          <span className="ed-sidebar-item">{t('education.sidebarApproved')}</span>
          <span className="ed-sidebar-item">{t('education.navRecords')}</span>
        </nav>
        <div className="ed-sidebar-foot">
          <span className="ed-sidebar-item">{t('education.sidebarSettings')}</span>
          <Link to="/" className="ed-sidebar-item">
            {t('education.sidebarLogout')}
          </Link>
        </div>
      </aside>

      <main className="ed-main">
        <BackLink className="ed-back" />
        <section className="ed-profile-card">
          <h1>{verified ? field('studentName') : t('education.placeholderName')}</h1>
          <p className="ed-profile-sub">{t('education.profileSub')}</p>

          <div className="ed-profile-body">
            <div className="ed-photo-col">
              <div className="ed-photo-box">
                {state.status === 'idle' && (
                  <div className="ed-photo-idle">
                    <p>{t('education.photoIdle')}</p>
                  </div>
                )}
                {state.status === 'loading' && <p role="status" className="ed-status-text">{t('common.preparing')}</p>}
                {state.status === 'error' && (
                  <div role="alert" className="ed-photo-idle">
                    <p className="ed-status-text">{errorText(state.error)}</p>
                  </div>
                )}
                {state.status === 'ready' && (
                  <QRCodeSVG
                    value={state.link}
                    size={148}
                    marginSize={2}
                    level="M"
                    bgColor="#ffffff"
                    fgColor="#15291f"
                    role="img"
                    aria-label={t('qr.alt')}
                  />
                )}
                {verified && !settled && (
                  <div className="ed-photo-verified">
                    <span className="ed-spinner" aria-hidden="true" />
                    <p>{t('common.checking')}</p>
                  </div>
                )}
                {settled && (
                  <div className="ed-photo-verified">
                    <span className="ed-check-ic" aria-hidden="true">✓</span>
                    <p>{t('common.completed')}</p>
                  </div>
                )}
              </div>
              {state.status === 'idle' && (
                <button type="button" className="ed-cta ed-cta-small" onClick={retry}>
                  {t('education.request')}
                </button>
              )}
              {state.status === 'ready' && <p className="ed-qr-cap">{t('common.valid5min')}</p>}
              {state.status === 'error' && (
                <button type="button" className="ed-cta ed-cta-small" onClick={retry}>
                  {t('common.retry')}
                </button>
              )}
            </div>

            <div className="ed-field-col">
              <div className="ed-field">
                <label>{t('label.institute')}</label>
                <div className="value">{field('instituteName')}</div>
              </div>
              <div className="ed-field">
                <label>{t('education.program')}</label>
                <div className="value">{field('program')}</div>
              </div>
              <div className="ed-field">
                <label>{t('education.course')}</label>
                <div className="value">{field('courseName')}</div>
              </div>
              <div className="ed-field">
                <label>{t('label.enrolledSince')}</label>
                <div className="value">{field('enrollmentDate')}</div>
              </div>
            </div>

            <div className="ed-field-col">
              <div className="ed-field">
                <label>{t('education.credentialStatus')}</label>
                <span className={`ed-pill ${credentialPill.kind}`}>{credentialPill.text}</span>
              </div>
              <div className="ed-field">
                <label>{t('education.eligibilityStatus')}</label>
                <span className={`ed-pill ${eligibilityPill.kind}`}>{eligibilityPill.text}</span>
              </div>
              <div className="ed-field">
                <label>{t('education.progressLabel')}</label>
                <div className="ed-progress-track">
                  <div className="ed-progress-fill" style={{ width: `${(checksDone / CHECK_COUNT) * 100}%` }} />
                </div>
                <p className="ed-progress-count">{t('education.progressCount', { done: checksDone, total: CHECK_COUNT })}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="ed-lower">
          <div className="ed-panel">
            <div className="ed-panel-head">
              <h2>{t('education.transcript')}</h2>
            </div>
            <div className="ed-info-grid">
              <div className="ed-info-item">
                <label>{t('label.status')}</label>
                <div className="value">{field('status')}</div>
              </div>
              <div className="ed-info-item">
                <label>{t('education.completion')}</label>
                <div className="value">{field('completionStatus')}</div>
              </div>
              <div className="ed-info-item">
                <label>{t('education.percentage')}</label>
                <div className="value">{field('percentage')}</div>
              </div>
              <div className="ed-info-item">
                <label>{t('label.enrolledSince')}</label>
                <div className="value">{field('enrollmentDate')}</div>
              </div>
            </div>
            {settled && verdict && !verdict.ok && (
              <div className="ed-review-note">
                <h3>{t('education.reviewNote')}</h3>
                <ul>
                  {verdict.reasons.map(reasonText).map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="ed-panel">
            <div className="ed-panel-head">
              <h2>{t('education.checksTitle')}</h2>
            </div>
            {[t('education.check1'), t('education.check2'), t('education.check3')].map((label, i) => {
              const row = rowState(i)
              return (
                <div className={`ed-row ed-check-row is-${row}`} key={label}>
                  <span className="ed-row-label-wrap">
                    <span className="ed-check-status">
                      <span className="ed-spinner" aria-hidden="true" />
                      <span className="ed-check-mark" aria-hidden="true">✓</span>
                    </span>
                    <span className="label">{label}</span>
                  </span>
                  <span className="ed-row-status-text">{rowStatusText(row)}</span>
                </div>
              )
            })}
            <div className={`ed-row ed-decision-row ${settled ? 'is-visible' : ''}`}>
              <span className="label">{t('education.approve')}</span>
              <span className={`ed-pill ${eligibilityPill.kind}`}>{eligibilityPill.text}</span>
            </div>
            {verified && (
              <button type="button" className="ed-pill-btn" onClick={retry}>
                {t('education.another')}
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
