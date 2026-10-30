export const CREDENTIAL_ID = 'education'

export const body = {
  dcql_query: {
    credentials: [
      {
        id: CREDENTIAL_ID,
        format: 'dc+sd-jwt',
        meta: { vct_values: ['https://sandbox-rc.sunbird.org/horizonte/vct/student'] },
        claims: [
          { path: ['studentName'] },
          { path: ['instituteName'] },
          { path: ['program'] },
          { path: ['courseName'] },
          { path: ['enrollmentDate'] },
          { path: ['status'] },
          { path: ['completionStatus'] },
          { path: ['percentage'] },
        ],
      },
    ],
  },
  client_metadata: { client_name: 'Universidade Vale Novo — Transfer Admissions' },
}
