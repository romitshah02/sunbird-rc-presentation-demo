import { CREDENTIAL_ID } from '../bodies/bank'
import type { Claims } from '../vpRequest'
import type { Verdict } from './types'

const ADULT_AGE = 18
const KYC_CLAIMS = ['studentName', 'contactEmail', 'phone', 'address', 'nationality']
const GUARDIAN_CLAIMS = ['guardianName', 'guardianRelationship', 'guardianPhone']

const present = (v: unknown) => (typeof v === 'string' ? v.trim() !== '' : v != null)

// Eligible: status ACTIVE, KYC details present, and either 18+ or guardian details present.
// completionStatus is deliberately not checked.
export function evaluateBank(claims: Claims): Verdict {
  const c = claims[CREDENTIAL_ID] ?? {}
  const name = typeof c.studentName === 'string' ? c.studentName : 'Student'
  const reasons: string[] = []

  if (c.status !== 'ACTIVE') reasons.push(`enrolment status is ${String(c.status ?? 'missing')}`)

  const missingKyc = KYC_CLAIMS.filter((k) => !present(c[k]))
  if (missingKyc.length) reasons.push(`missing ${missingKyc.join(', ')}`)

  if (!present(c.age) || !Number.isFinite(Number(c.age))) {
    reasons.push('missing age')
  } else if (Number(c.age) < ADULT_AGE) {
    const missingGuardian = GUARDIAN_CLAIMS.filter((k) => !present(c[k]))
    if (missingGuardian.length) {
      reasons.push(`age is ${String(c.age)}, under ${ADULT_AGE}, and missing ${missingGuardian.join(', ')}`)
    }
  }

  if (reasons.length) {
    return {
      ok: false,
      headline: '✗ Not Eligible For Student Bank Account',
      message: `${name}: ${reasons.join('; ')}`,
    }
  }
  return { ok: true, headline: '✓ Eligible For Student Bank Account', message: name }
}
