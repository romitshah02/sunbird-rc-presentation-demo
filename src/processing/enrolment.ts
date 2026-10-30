import type { Reason } from './types'

// The enrolment credential's enrollmentStatus must be ACTIVE; otherwise say why.
export function statusReason(status: unknown): Reason | undefined {
  if (status === 'ACTIVE') return undefined
  return status == null
    ? { code: 'statusMissing' }
    : { code: 'statusNotActive', params: { status: String(status) } }
}
