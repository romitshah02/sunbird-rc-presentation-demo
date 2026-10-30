import { CREDENTIAL_ID } from '../bodies/education'
import type { Claims } from '../vpRequest'
import type { Reason, Verdict } from './types'

const INELIGIBLE_COMPLETION = ['DISCONTINUED', 'FAILED']

// Eligible for transfer: enrolment status is not WITHDRAWN, and completion status (if present)
// is not DISCONTINUED or FAILED.
export function evaluateEducation(claims: Claims): Verdict {
  const c = claims[CREDENTIAL_ID]
  const name = typeof c?.studentName === 'string' ? c.studentName : undefined
  const reasons: Reason[] = []

  if (c?.status == null) reasons.push({ code: 'statusMissing' })
  else if (c.status === 'WITHDRAWN') reasons.push({ code: 'statusNotActive', params: { status: String(c.status) } })

  if (typeof c?.completionStatus === 'string' && INELIGIBLE_COMPLETION.includes(c.completionStatus)) {
    reasons.push({ code: 'completionNotEligible', params: { completion: c.completionStatus } })
  }

  return { ok: reasons.length === 0, name, reasons }
}
