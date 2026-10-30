const claims = [
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
  'instituteName',
  'program',
  'enrollmentDate',
  'status',
  'courseName',
  'completionStatus',
  'percentage',
]

export const CREDENTIAL_ID = 'bank_account'

export const body = {
  dcql_query: {
    credentials: [
      {
        id: CREDENTIAL_ID,
        format: 'dc+sd-jwt',
        meta: { vct_values: ['https://sandbox-rc.sunbird.org/horizonte/vct/student'] },
        claims: claims.map((c) => ({ path: [c] })),
      },
    ],
  },
  client_metadata: { client_name: 'Bank Account Opening' },
}
