import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { awaitClaims, requestQr, type Claims } from './vpRequest'
import type { Verdict } from './processing/types'

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; link: string }
  | { status: 'result'; verdict: Verdict }

interface Props {
  title: string
  hint: string
  body: unknown
  theme: 'theatre' | 'transport' | 'bank'
  // When set, the page waits for the wallet response and shows the verdict instead of the QR.
  evaluate?: (claims: Claims) => Verdict
}

export default function VpPage({ title, hint, body, theme, evaluate }: Props) {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const ctrl = new AbortController()
    setState({ status: 'loading' })
    ;(async () => {
      const { link, transactionId } = await requestQr(body, ctrl.signal)
      setState({ status: 'ready', link })
      if (!evaluate) return
      const claims = await awaitClaims(transactionId, ctrl.signal)
      setState({ status: 'result', verdict: evaluate(claims) })
    })().catch((err: unknown) => {
      if (err instanceof DOMException && err.name === 'AbortError') return
      setState({ status: 'error', message: err instanceof Error ? err.message : String(err) })
    })
    return () => ctrl.abort()
  }, [body, evaluate, attempt])

  const retry = () => setAttempt((n) => n + 1)

  return (
    <main className="page" data-theme={theme}>
      <h1>{title}</h1>
      {state.status === 'loading' && <p role="status">Preparing your code…</p>}
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
      {state.status === 'result' && (
        <div role="status" className="result" data-ok={state.verdict.ok}>
          <p className="verdict">{state.verdict.ok ? '✓ Valid' : '✗ Not valid'}</p>
          <p>{state.verdict.message}</p>
          <button onClick={retry}>Scan again</button>
        </div>
      )}
      {state.status !== 'result' && <p className="hint">{hint}</p>}
    </main>
  )
}
