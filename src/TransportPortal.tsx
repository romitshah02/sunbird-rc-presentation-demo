import { QRCodeSVG } from 'qrcode.react'
import { useVpFlow } from './useVpFlow'
import { body, CREDENTIAL_ID } from './bodies/transport'
import { evaluateTransport } from './processing/transport'

// Same request/poll flow and the same claims as every other page (see useVpFlow + VpPage) —
// this is only a different layout for the transport use case, built as a web portal rather
// than the shared centered-page template the other relying parties use.
export default function TransportPortal() {
  const { state, retry } = useVpFlow(body)
  const claims = state.status === 'verified' ? (state.claims[CREDENTIAL_ID] ?? {}) : undefined
  const verdict = state.status === 'verified' ? evaluateTransport(state.claims) : null

  const field = (name: string) => {
    const v = claims?.[name]
    return v === undefined || v === null || v === '' ? '—' : String(v)
  }

  return (
    <main className="tp-page">
      <header className="tp-topbar">
        <div className="tp-brand">
          <span className="tp-mark" aria-hidden="true">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <rect x="4" y="5" width="16" height="12" rx="3" />
              <circle cx="8" cy="19" r="1.4" fill="#fff" stroke="none" />
              <circle cx="16" cy="19" r="1.4" fill="#fff" stroke="none" />
              <path d="M4 11h16" />
            </svg>
          </span>
          Bilhete Único Estudantil
        </div>
        <span className="tp-live-pill">
          <span className="tp-dot" aria-hidden="true" />
          Sistema online
        </span>
      </header>

      <div className="tp-main">
        <div className="tp-intro">
          <span className="tp-eyebrow">Prefeitura de Porto Verde · Transporte Coletivo</span>
          <h1>Verificação do Bilhete Único Estudantil</h1>
          <p>
            Confirme em segundos se a matrícula de um estudante está ativa para liberar a tarifa
            estudantil nos ônibus municipais, sem armazenar nenhum dado pessoal na catraca ou no
            guichê. Mesmo processo usado hoje no embarque e na emissão de segunda via do bilhete.
          </p>
          <ol className="tp-steps">
            <li>
              <span className="tp-num">1</span>
              Peça para o estudante abrir a carteira digital no celular.
            </li>
            <li>
              <span className="tp-num">2</span>
              O estudante escaneia o código ao lado na catraca ou no guichê.
            </li>
            <li>
              <span className="tp-num">3</span>
              O resultado aparece na tela assim que a carteira responde.
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
                <strong>Nenhum dado é armazenado</strong>
                A catraca e o guichê apenas leem e confirmam o status — nada fica salvo no
                terminal.
              </span>
            </div>
            <div className="tp-perk">
              <span className="tp-ic" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1f3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
                </svg>
              </span>
              <span>
                <strong>Resposta em segundos</strong>
                A confirmação chega assim que a carteira digital do estudante responde ao pedido.
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
                <strong>Funciona com qualquer carteira compatível</strong>
                Qualquer carteira digital emitida por uma universidade conveniada ao programa pode
                ser usada.
              </span>
            </div>
          </div>
        </div>

        <div className="tp-ticket-wrap">
          <div className="tp-portal">
            {state.status === 'idle' && (
              <div className="tp-ticket">
                <p className="tp-ticket-label">Passe do Estudante</p>
                <p className="tp-status-text">Pronto para iniciar a verificação.</p>
                <div className="tp-cta-row">
                  <button type="button" className="tp-cta" onClick={retry}>
                    Escanear com a carteira
                  </button>
                </div>
              </div>
            )}

            {state.status === 'loading' && (
              <div className="tp-ticket">
                <p className="tp-ticket-label">Passe do Estudante</p>
                <p role="status" className="tp-status-text">
                  Preparando o código…
                </p>
              </div>
            )}

            {state.status === 'error' && (
              <div className="tp-ticket" role="alert">
                <p className="tp-ticket-label">Passe do Estudante</p>
                <p className="tp-status-text">{state.message}</p>
                <div className="tp-cta-row">
                  <button type="button" className="tp-cta" onClick={retry}>
                    Tentar novamente
                  </button>
                </div>
              </div>
            )}

            {state.status === 'ready' && (
              <div className="tp-ticket">
                <p className="tp-ticket-label">Passe do Estudante</p>
                <div className="tp-qr-card">
                  <QRCodeSVG
                    value={state.link}
                    size={256}
                    marginSize={2}
                    level="M"
                    bgColor="#ffffff"
                    fgColor="#13203f"
                    role="img"
                    aria-label="QR code: scan with your wallet"
                  />
                </div>
                <div className="tp-ticket-foot">
                  <span>Aguardando leitura</span>
                  <span>Válido por 5 min</span>
                </div>
              </div>
            )}

            {state.status === 'verified' && verdict && (
              <div className="tp-ticket" role="status">
                <p className="tp-ticket-label">Passe do Estudante</p>
                <span className={`tp-result-chip ${verdict.ok ? 'ok' : 'bad'}`}>
                  {verdict.ok ? '✓ Verificado' : '✗ Recusado'}
                </span>
                <p className="tp-headline">{verdict.headline ?? verdict.message}</p>
                <dl className="tp-claim-rows">
                  <div className="tp-row">
                    <dt>Aluno(a)</dt>
                    <dd>{field('studentName')}</dd>
                  </div>
                  <div className="tp-row">
                    <dt>Instituição</dt>
                    <dd>{field('instituteName')}</dd>
                  </div>
                  <div className="tp-row">
                    <dt>Curso</dt>
                    <dd>{field('program')}</dd>
                  </div>
                  <div className="tp-row">
                    <dt>Matrícula desde</dt>
                    <dd>{field('enrollmentDate')}</dd>
                  </div>
                  <div className="tp-row">
                    <dt>Status</dt>
                    <dd>{field('status')}</dd>
                  </div>
                </dl>
                <div className="tp-cta-row">
                  <button type="button" className="tp-cta" onClick={retry}>
                    Verificar novamente
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
