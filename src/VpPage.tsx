import { useEffect, useState, type ReactNode } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { awaitClaims, requestQr, type Claims } from './vpRequest'
import type { Verdict } from './processing/types'

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; link: string }
  | { status: 'verified'; claims: Claims }

interface Props {
  title: string
  hint: string
  body: unknown
  theme: 'theatre' | 'transport' | 'bank'
  // Optional judgement of the received claims, shown as the result headline.
  // Evaluated at render time, so changing it re-judges the received claims without a new scan.
  evaluate?: (claims: Claims) => Verdict
  // Controls shown under the title (e.g. an option selector).
  children?: ReactNode
}

// "enrollmentDate" -> "Enrollment date"
const claimLabel = (name: string) => {
  const words = name.replace(/([A-Z])/g, ' $1').toLowerCase()
  return words[0].toUpperCase() + words.slice(1)
}

export default function VpPage({ title, hint, body, theme, evaluate, children }: Props) {
  const [state, setState] = useState<State>({ status: 'idle' })
  // 0 = nothing requested yet; every click on Request / Retry / Scan again bumps it.
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (attempt === 0) return
    const ctrl = new AbortController()
    setState({ status: 'loading' })
    ;(async () => {
      const { link, transactionId } = await requestQr(body, ctrl.signal)
      setState({ status: 'ready', link })
      const claims = await awaitClaims(transactionId, ctrl.signal)
      setState({ status: 'verified', claims })
    })().catch((err: unknown) => {
      if (err instanceof DOMException && err.name === 'AbortError') return
      setState({ status: 'error', message: err instanceof Error ? err.message : String(err) })
    })
    return () => ctrl.abort()
  }, [body, attempt])

  const retry = () => setAttempt((n) => n + 1)
  const verdict = state.status === 'verified' ? (evaluate?.(state.claims) ?? null) : null

  return (
    <main className="page" data-theme={theme}>
      <h1>{title}</h1>
      {children}
      {state.status === 'idle' && (
        <button className="request" onClick={retry}>
          Request
        </button>
      )}
      {state.status === 'loading' &&<p role="status">Preparing your code…</p>}
      {state.status === 'error' && (
        <div role="alert" className="error">
          <p>{state.message}</p>
          <button onClick={retry}>Retry</button>
        </div>
      )}
      {state.status === 'ready' && (
        <div className="qr">
          <QRCodeSVG
            value={state.link}
            size={512}
            marginSize={4}
            level="M"
            bgColor="#ffffff"
            fgColor="#000000"
            role="img"
            aria-label={`QR code: ${hint}`}
          />
        </div>
      )}
      {state.status === 'verified' && (
        <div role="status" className="result" data-ok={verdict?.ok}>
          {verdict ? (
            <>
              <p className="verdict">
                {verdict.headline ?? (verdict.ok ? '✓ Valid' : '✗ Not valid')}
              </p>
              <p>{verdict.message}</p>
            </>
          ) : (
            <p className="verdict">Received</p>
          )}
          <dl className="claims">
            {Object.values(state.claims)
              .flatMap((c) => Object.entries(c))
              .map(([name, value]) => (
                <div key={name}>
                  <dt>{claimLabel(name)}</dt>
                  <dd>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</dd>
                </div>
              ))}
          </dl>
          <button onClick={retry}>Scan again</button>
        </div>
      )}
      {state.status === 'ready' && <p className="hint">{hint}</p>}
    </main>
  )
}
