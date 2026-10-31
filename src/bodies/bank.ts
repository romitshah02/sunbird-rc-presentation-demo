import { ENROLMENT_VCT, PROFILE_VCT } from './credentials'

export const PROFILE_ID = 'bank_profile'
export const ENROLMENT_ID = 'bank_enrolment'

const profileClaims = [
  'studentName',
  'age',
  'gender',
  'contactEmail',
  'phone',
  'address',
  'nationality',
  'guardianName',
  'guardianRelationship',
  'guardianPhone',
  'instituteName'
]

const enrolmentClaims = [
  'program',
  'courseName',
  'enrollmentDate',
  'enrollmentStatus',
  'completionStatus',
  'percentage',
]

// Both credentials are required (no credential_sets).
export const body = {
  dcql_query: {
    credentials: [
      {
        id: PROFILE_ID,
        format: 'dc+sd-jwt',
        meta: { vct_values: [PROFILE_VCT] },
        claims: profileClaims.map((c) => ({ path: [c] })),
      },
      {
        id: ENROLMENT_ID,
        format: 'dc+sd-jwt',
        meta: { vct_values: [ENROLMENT_VCT] },
        claims: enrolmentClaims.map((c) => ({ path: [c] })),
      },
    ],
  },
  client_metadata: { client_name: 'Bank Account Opening' },
}
