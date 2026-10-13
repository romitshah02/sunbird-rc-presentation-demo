import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useVpFlow } from './useVpFlow'
import { body, CREDENTIAL_ID } from './bodies/theatre'
import { evaluateTheatre, type TicketType } from './processing/theatre'

// Placeholder poster — drop the real file in public/poster.jpg (same folder as favicon.svg).
const MOVIE_TITLE = 'Homem-Aranha: Longe de Casa'
const MOVIE_POSTER_SRC = '/image.png'

const OPTIONS: { value: TicketType; label: string }[] = [
  { value: 'kid', label: 'Criança' },
  { value: 'adult', label: 'Adulto (18+)' },
]

// Same request/poll flow and the same two claims (age, status) as before (see useVpFlow +
// VpPage) — this is only a different layout, styled as a ticket stub instead of the shared
// centered template.
export default function TheatrePortal() {
  const [type, setType] = useState<TicketType>('kid')
  const { state, retry } = useVpFlow(body)
  const verdict = state.status === 'verified' ? evaluateTheatre(type, state.claims) : null
  const claims = state.status === 'verified' ? (state.claims[CREDENTIAL_ID] ?? {}) : undefined
  const field = (name: string) => {
    const v = claims?.[name]
    return v === undefined || v === null || v === '' ? '—' : String(v)
  }

  return (
    <main className="tt-page">
      <div className="tt-ticket">
        <div className="tt-top">
          <div className="tt-top-text">
            <h1>{MOVIE_TITLE}</h1>
            <p className="tt-meta">(Livre) · Ingresso Estudantil · Verificação Digital</p>
            <p className="tt-venue-name">Cine Porto Verde</p>
            <p className="tt-venue-addr">
              Rua das Palmeiras, 450 — Centro
              <br />
              Porto Verde
            </p>
          </div>
          <img className="tt-poster" src={MOVIE_POSTER_SRC} alt={MOVIE_TITLE} />
        </div>

        <div className="tt-session">
          <h3>SALA 01</h3>
          <p className="tt-row">
            <span>Sáb, 6 Jul</span>
            <span className="tt-sep">|</span>
            <span>19:30</span>
          </p>
          <p className="tt-type-label">Tipo de ingresso</p>
        </div>
        <div className="tt-options" role="group" aria-label="Tipo de ingresso">
          {OPTIONS.map((o) => (
            <button key={o.value} type="button" aria-pressed={type === o.value} onClick={() => setType(o.value)}>
              {o.label}
            </button>
          ))}
        </div>

        <div className="tt-perf">
          <span className="tt-notch tt-notch-left" />
          <span className="tt-notch tt-notch-right" />
        </div>

        {state.status === 'idle' && (
          <div className="tt-qr-zone">
            <p className="tt-status-text">Pronto para iniciar a verificação.</p>
            <button type="button" className="tt-cta" onClick={retry}>
              Gerar código
            </button>
          </div>
        )}

        {state.status === 'loading' && (
          <div className="tt-qr-zone">
            <p role="status" className="tt-status-text">
              Preparando o código…
            </p>
          </div>
        )}

        {state.status === 'error' && (
          <div className="tt-qr-zone" role="alert">
            <p className="tt-status-text">{state.message}</p>
            <button type="button" className="tt-cta" onClick={retry}>
              Tentar novamente
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
                aria-label="QR code: scan with your wallet"
              />
            </div>
            <p className="tt-qr-cap">
              Escaneie com a carteira digital
              <br />
              <b>Válido por 5 minutos</b>
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
              <p className="tt-result-title">{verdict.ok ? '✓ Válido' : '✗ Não válido'}</p>
              <p className="tt-result-sub">{verdict.message}</p>
            </div>
            <div className="tt-foot">
              <dl className="tt-foot-list">
                <div className="tt-line">
                  <dt>Status</dt>
                  <dd>{field('status')}</dd>
                </div>
                <div className="tt-line">
                  <dt>Idade</dt>
                  <dd>{field('age')}</dd>
                </div>
                <div className="tt-line tt-total">
                  <dt>Resultado</dt>
                  <dd className={verdict.ok ? 'ok' : 'bad'}>
                    {verdict.ok ? '✓ Entrada liberada' : '✗ Entrada negada'}
                  </dd>
                </div>
              </dl>
            </div>
            <button type="button" className="tt-cta" onClick={retry}>
              Escanear novamente
            </button>
          </>
        )}
      </div>
    </main>
  )
}
