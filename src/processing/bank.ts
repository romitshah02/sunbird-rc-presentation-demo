import { ENROLMENT_ID, PROFILE_ID } from '../bodies/bank'
import type { Claims } from '../vpRequest'
import { statusReason } from './enrolment'
import type { ClaimName, Reason, Verdict } from './types'

const ADULT_AGE = 18
const KYC_CLAIMS: ClaimName[] = ['studentName', 'contactEmail', 'phone', 'address', 'nationality']
const GUARDIAN_CLAIMS: ClaimName[] = ['guardianName', 'guardianRelationship', 'guardianPhone']

const present = (v: unknown) => (typeof v === 'string' ? v.trim() !== '' : v != null)

// Eligible: enrollmentStatus (enrolment credential) ACTIVE; KYC details present and either 18+ or
// guardian details present (profile credential). completionStatus is deliberately not checked.
export function evaluateBank(claims: Claims): Verdict {
  const profile = claims[PROFILE_ID] ?? {}
  const name = typeof profile.studentName === 'string' ? profile.studentName : undefined
  const reasons: Reason[] = []

  const status = statusReason(claims[ENROLMENT_ID]?.enrollmentStatus)
  if (status) reasons.push(status)

  const missingKyc = KYC_CLAIMS.filter((k) => !present(profile[k]))
  if (missingKyc.length) reasons.push({ code: 'missingFields', params: { fields: missingKyc } })

  if (!present(profile.age) || !Number.isFinite(Number(profile.age))) {
    reasons.push({ code: 'missingAge' })
  } else if (Number(profile.age) < ADULT_AGE) {
    const missingGuardian = GUARDIAN_CLAIMS.filter((k) => !present(profile[k]))
    if (missingGuardian.length) {
      reasons.push({
        code: 'minorNoGuardian',
        params: { age: String(profile.age), min: ADULT_AGE, fields: missingGuardian },
      })
    }
  }

  return { ok: reasons.length === 0, name, reasons }
}
