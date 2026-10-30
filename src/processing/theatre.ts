import { ENROLMENT_ID, PROFILE_ID } from '../bodies/theatre'
import type { Claims } from '../vpRequest'
import { statusReason } from './enrolment'
import type { Verdict } from './types'

export type TicketType = 'kid' | 'adult'

const MIN_ADULT_AGE = 18

// Kid: enrollmentStatus ACTIVE. Adult: ACTIVE and the profile age is 18+.
export function evaluateTheatre(type: TicketType, claims: Claims): Verdict {
  const status = statusReason(claims[ENROLMENT_ID]?.enrollmentStatus)
  if (status) return { ok: false, reasons: [status] }

  if (type === 'adult') {
    const age = claims[PROFILE_ID]?.age
    if (age == null) return { ok: false, reasons: [{ code: 'missingAge' }] }
    if (!Number.isFinite(Number(age)) || Number(age) < MIN_ADULT_AGE) {
      return { ok: false, reasons: [{ code: 'underAge', params: { age: String(age), min: MIN_ADULT_AGE } }] }
    }
  }
  return { ok: true, reasons: [] }
}
