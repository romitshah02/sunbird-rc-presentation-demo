import { CREDENTIAL_ID } from '../bodies/theatre'
import type { Claims } from '../vpRequest'
import type { Verdict } from './types'

export type TicketType = 'kid' | 'adult'

const MIN_ADULT_AGE = 18

// Kid: valid (active) student. Adult: valid student who is also 18+.
export function evaluateTheatre(type: TicketType, claims: Claims): Verdict {
  const c = claims[CREDENTIAL_ID]
  const name = typeof c?.studentName === 'string' ? c.studentName : 'Student'
  if (c?.status !== 'ACTIVE') {
    return { ok: false, message: `${name}: enrolment status is ${String(c?.status ?? 'missing')}` }
  }
  if (type === 'adult') {
    const age = Number(c.age)
    if (!Number.isFinite(age) || age < MIN_ADULT_AGE) {
      return { ok: false, message: `${name}: age is ${String(c.age ?? 'missing')}, must be ${MIN_ADULT_AGE} or older` }
    }
  }
  return { ok: true, message: name }
}
