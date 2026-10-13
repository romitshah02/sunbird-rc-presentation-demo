// Response field holding the openid4vp:// deep link the wallet scans.
export const LINK_FIELD = 'qr_data'

const POLL_MS = 2000
const TIMEOUT_MS = 5 * 60 * 1000

export type Claims = Record<string, Record<string, unknown>>

function verifierUrl(): string {
  const url = import.meta.env.VITE_VERIFIER_URL
  if (!url) throw new Error('VITE_VERIFIER_URL is not set')
  return url
}

export async function requestQr(
  body: unknown,
  signal: AbortSignal,
): Promise<{ link: string; transactionId: string }> {
  const res = await fetch(verifierUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  })
  if (!res.ok) throw new Error(`Verifier returned ${res.status} ${res.statusText}`)

  const data = await res.json()
  const link = data?.[LINK_FIELD]
  if (typeof link !== 'string' || !link) {
    throw new Error(`Verifier response has no "${LINK_FIELD}" field`)
  }
  const transactionId = data?.transaction_id
  if (typeof transactionId !== 'string' || !transactionId) {
    throw new Error('Verifier response has no "transaction_id" field')
  }
  return { link, transactionId }
}

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms)
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(t)
        reject(new DOMException('Aborted', 'AbortError'))
      },
      { once: true },
    )
  })

const NO_CARD_MESSAGE =
  'No matching student card was shared. The wallet has no matching card, or the holder declined the request.'

// Polls .../vp/status/{id} (derived from the request URL) until the wallet has responded.
// ponytail: any status that isn't verified:true keeps polling unless it names a failure;
// tighten once the real pending/failed status values are known.
export async function awaitClaims(transactionId: string, signal: AbortSignal): Promise<Claims> {
  const url = `${verifierUrl().replace(/\/request\/?$/, '')}/status/${transactionId}`
  const deadline = Date.now() + TIMEOUT_MS
  while (Date.now() < deadline) {
    const res = await fetch(url, { signal })
    if (!res.ok) throw new Error(`Status check returned ${res.status} ${res.statusText}`)
    const data = await res.json()
    if (data?.verified === true) return data.claims ?? {}
    if (/fail|reject|expire|denied|error/i.test(String(data?.status))) {
      // "missing vp_token": the wallet answered without sharing anything.
      if (/missing vp_token/i.test(String(data?.error))) throw new Error(NO_CARD_MESSAGE)
      throw new Error(`Verification ${data.status}${data.error ? `: ${data.error}` : ''}`)
    }
    await sleep(POLL_MS, signal)
  }
  throw new Error('Timed out waiting for the wallet')
}
