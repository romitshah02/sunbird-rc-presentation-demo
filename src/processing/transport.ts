import { CREDENTIAL_ID } from '../bodies/transport'
import type { Claims } from '../vpRequest'
import type { Verdict } from './types'

// Eligible: enrolment status is ACTIVE.
export function evaluateTransport(claims: Claims): Verdict {
  const c = claims[CREDENTIAL_ID]
  const name = typeof c?.studentName === 'string' ? c.studentName : 'Student'
  if (c?.status !== 'ACTIVE') {
    return { ok: false, headline: '✗ Not Eligible For Bus Pass', message: `${name}: enrolment status is ${String(c?.status ?? 'missing')}` }
  }
  return { ok: true, headline: '✓ Eligible For Bus Pass', message: name }
}
