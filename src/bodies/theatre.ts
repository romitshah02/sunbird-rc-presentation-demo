export const CREDENTIAL_ID = 'movie_theatre'

export const body = {
  dcql_query: {
    credentials: [
      {
        id: CREDENTIAL_ID,
        format: 'dc+sd-jwt',
        meta: { vct_values: ['https://sandbox-rc.sunbird.org/horizonte/vct/student'] },
        claims: [
          { path: ['studentName'] },
          { path: ['age'] },
          { path: ['completionStatus'], values: ['IN_PROGRESS'] },
        ],
      },
    ],
  },
  client_metadata: { client_name: 'Movie Theatre' },
}
