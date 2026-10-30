import { ENROLMENT_ID } from '../bodies/transport'
import type { Claims } from '../vpRequest'
import { statusReason } from './enrolment'
import type { Verdict } from './types'

// Eligible: enrollmentStatus is ACTIVE. No name is requested, so the verdict has none.
export function evaluateTransport(claims: Claims): Verdict {
  const reason = statusReason(claims[ENROLMENT_ID]?.enrollmentStatus)
  return { ok: !reason, reasons: reason ? [reason] : [] }
}
