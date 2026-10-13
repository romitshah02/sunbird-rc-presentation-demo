import { CREDENTIAL_ID } from '../bodies/bank'
import type { Claims } from '../vpRequest'
import type { Verdict } from './types'

// Eligible: enrolment status is ACTIVE.
export function evaluateBank(claims: Claims): Verdict {
  const c = claims[CREDENTIAL_ID]
  const name = typeof c?.studentName === 'string' ? c.studentName : 'Student'
  if (c?.status !== 'ACTIVE') {
    return {
      ok: false,
      headline: '✗ Not Eligible For Student Bank Account',
      message: `${name}: enrolment is not active`,
    }
  }
  return { ok: true, headline: '✓ Eligible For Student Bank Account', message: name }
}
