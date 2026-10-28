// Claims that can be named in a "missing ..." reason; the UI translates them (claim.* keys).
export type ClaimName =
  | 'studentName'
  | 'contactEmail'
  | 'phone'
  | 'address'
  | 'nationality'
  | 'guardianName'
  | 'guardianRelationship'
  | 'guardianPhone'

// Language-free: the UI turns a code into text with t('reason.' + code, params).
export type ReasonCode =
  | 'statusMissing'
  | 'statusNotActive'
  | 'underAge'
  | 'missingAge'
  | 'missingFields'
  | 'minorNoGuardian'

export interface Reason {
  code: ReasonCode
  params?: { status?: string; age?: string; min?: number; fields?: ClaimName[] }
}

export interface Verdict {
  ok: boolean
  // Student name from the credential, if shared.
  name?: string
  // Empty when ok.
  reasons: Reason[]
}
