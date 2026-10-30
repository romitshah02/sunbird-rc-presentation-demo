import { ENROLMENT_ID, PROFILE_ID } from '../bodies/education'
import type { Claims } from '../vpRequest'
import type { Reason, Verdict } from './types'

const INELIGIBLE_COMPLETION = ['DISCONTINUED', 'FAILED']

// Eligible for transfer: enrollmentStatus (enrolment credential) is not WITHDRAWN, and
// completionStatus (if present) is not DISCONTINUED or FAILED.
export function evaluateEducation(claims: Claims): Verdict {
  const enrolment = claims[ENROLMENT_ID]
  const profileName = claims[PROFILE_ID]?.studentName
  const name = typeof profileName === 'string' ? profileName : undefined
  const reasons: Reason[] = []

  const status = enrolment?.enrollmentStatus
  if (status == null) reasons.push({ code: 'statusMissing' })
  else if (status === 'WITHDRAWN') reasons.push({ code: 'statusNotActive', params: { status: String(status) } })

  const completion = enrolment?.completionStatus
  if (typeof completion === 'string' && INELIGIBLE_COMPLETION.includes(completion)) {
    reasons.push({ code: 'completionNotEligible', params: { completion } })
  }

  return { ok: reasons.length === 0, name, reasons }
}
