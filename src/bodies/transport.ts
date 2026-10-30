import { ENROLMENT_VCT } from './credentials'

export const ENROLMENT_ID = 'bus_enrolment'

// Minimal disclosure: institution, programme and enrolment status. No name, no dates.
export const body = {
  dcql_query: {
    credentials: [
      {
        id: ENROLMENT_ID,
        format: 'dc+sd-jwt',
        meta: { vct_values: [ENROLMENT_VCT] },
        claims: [{ path: ['instituteName'] }, { path: ['program'] }, { path: ['enrollmentStatus'] }],
      },
    ],
  },
  client_metadata: { client_name: 'City Bus Transport' },
}
