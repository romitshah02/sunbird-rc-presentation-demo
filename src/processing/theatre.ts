import { CREDENTIAL_ID } from '../bodies/theatre'
import type { Claims } from '../vpRequest'
import type { Verdict } from './types'

export type TicketType = 'kid' | 'adult'

const MIN_ADULT_AGE = 18

// Kid: valid (active) student. Adult: valid student who is also 18+.
export function evaluateTheatre(type: TicketType, claims: Claims): Verdict {
  const c = claims[CREDENTIAL_ID]
  const name = typeof c?.studentName === 'string' ? c.studentName : undefined
  if (c?.status !== 'ACTIVE') {
    return {
      ok: false,
      name,
      reasons:
        c?.status == null
          ? [{ code: 'statusMissing' }]
          : [{ code: 'statusNotActive', params: { status: String(c.status) } }],
    }
  }
  if (type === 'adult') {
    const age = Number(c.age)
    if (!Number.isFinite(age) || age < MIN_ADULT_AGE) {
      return {
        ok: false,
        name,
        reasons:
          c.age == null
            ? [{ code: 'missingAge' }]
            : [{ code: 'underAge', params: { age: String(c.age), min: MIN_ADULT_AGE } }],
      }
    }
  }
  return { ok: true, name, reasons: [] }
}
