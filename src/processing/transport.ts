import { CREDENTIAL_ID } from '../bodies/transport'
import type { Claims } from '../vpRequest'
import type { Verdict } from './types'

// Eligible: enrolment status is ACTIVE.
export function evaluateTransport(claims: Claims): Verdict {
  const c = claims[CREDENTIAL_ID]
  const name = typeof c?.studentName === 'string' ? c.studentName : undefined
  if (c?.status !== 'ACTIVE') {
    return {
      ok: false,
      name,
      reasons:
        c?.status == null
          ? [{ code: 'statusMissing' }]
          : [{ code: 'statusNotActive', params: { status: String(c.status) } }],
    }
  }
  return { ok: true, name, reasons: [] }
}
