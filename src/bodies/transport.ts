export const CREDENTIAL_ID = 'bus_transport'

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
          { path: ['enrollmentDate'] },
          { path: ['status'] },
        ],
      },
    ],
  },
  client_metadata: { client_name: 'City Bus Transport' },
}
