import { useEffect, useState } from 'react'
import { awaitClaims, requestQr, type Claims } from './vpRequest'

export type VpState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; link: string }
  | { status: 'verified'; claims: Claims }

/**
 * The request/poll state machine shared by every relying-party page: ask the verifier for a
 * QR, wait for the wallet to respond, surface the claims once verified. Extracted out of
 * VpPage so a page can use its own layout (see TransportPortal) without re-implementing this.
 */
export function useVpFlow(body: unknown) {
  const [state, setState] = useState<VpState>({ status: 'idle' })
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
  return { state, retry }
}
