export const body = {
  dcql_query: {
    credentials: [
      {
        id: 'bus_transport',
        format: 'dc+sd-jwt',
        meta: { vct_values: ['https://sandbox-rc.sunbird.org/horizonte/vct/student'] },
        claims: [
          { path: ['studentName'] },
          { path: ['instituteName'] },
          { path: ['program'] },
          { path: ['status'] },
          { path: ['enrollmentDate'] },
        ],
      },
    ],
  },
  client_metadata: { client_name: 'City Bus Transport' },
}
