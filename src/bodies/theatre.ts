import { ENROLMENT_VCT, PROFILE_VCT } from './credentials'

export const ENROLMENT_ID = 'theatre_enrolment'
export const PROFILE_ID = 'theatre_profile'

// Both credentials are required: enrolment for the status, profile only for the age.
export const body = {
  dcql_query: {
    credentials: [
      {
        id: ENROLMENT_ID,
        format: 'dc+sd-jwt',
        meta: { vct_values: [ENROLMENT_VCT] },
        claims: [{ path: ['program'] }, { path: ['enrollmentStatus'] }],
      },
      {
        id: PROFILE_ID,
        format: 'dc+sd-jwt',
        meta: { vct_values: [PROFILE_VCT] },
        claims: [{ path: ['instituteName'] }, { path: ['age'] }],
      },
    ],
  },
  client_metadata: { client_name: 'Movie Theatre' },
}
