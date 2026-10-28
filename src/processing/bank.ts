import { CREDENTIAL_ID } from '../bodies/bank'
import type { Claims } from '../vpRequest'
import type { ClaimName, Reason, Verdict } from './types'

const ADULT_AGE = 18
const KYC_CLAIMS: ClaimName[] = ['studentName', 'contactEmail', 'phone', 'address', 'nationality']
const GUARDIAN_CLAIMS: ClaimName[] = ['guardianName', 'guardianRelationship', 'guardianPhone']

const present = (v: unknown) => (typeof v === 'string' ? v.trim() !== '' : v != null)

// Eligible: status ACTIVE, KYC details present, and either 18+ or guardian details present.
// completionStatus is deliberately not checked.
export function evaluateBank(claims: Claims): Verdict {
  const c = claims[CREDENTIAL_ID] ?? {}
  const name = typeof c.studentName === 'string' ? c.studentName : undefined
  const reasons: Reason[] = []

  if (c.status == null) reasons.push({ code: 'statusMissing' })
  else if (c.status !== 'ACTIVE') reasons.push({ code: 'statusNotActive', params: { status: String(c.status) } })

  const missingKyc = KYC_CLAIMS.filter((k) => !present(c[k]))
  if (missingKyc.length) reasons.push({ code: 'missingFields', params: { fields: missingKyc } })

  if (!present(c.age) || !Number.isFinite(Number(c.age))) {
    reasons.push({ code: 'missingAge' })
  } else if (Number(c.age) < ADULT_AGE) {
    const missingGuardian = GUARDIAN_CLAIMS.filter((k) => !present(c[k]))
    if (missingGuardian.length) {
      reasons.push({
        code: 'minorNoGuardian',
        params: { age: String(c.age), min: ADULT_AGE, fields: missingGuardian },
      })
    }
  }

  return { ok: reasons.length === 0, name, reasons }
}
