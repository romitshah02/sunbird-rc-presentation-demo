import { ENROLMENT_VCT, PROFILE_VCT } from './credentials'

export const PROFILE_ID = 'education_profile'
export const ENROLMENT_ID = 'education_enrolment'

// Both credentials are required: the name from the profile, the academic record from the enrolment.
export const body = {
  dcql_query: {
    credentials: [
      {
        id: PROFILE_ID,
        format: 'dc+sd-jwt',
        meta: { vct_values: [PROFILE_VCT] },
        claims: [{ path: ['studentName'] }],
      },
      {
        id: ENROLMENT_ID,
        format: 'dc+sd-jwt',
        meta: { vct_values: [ENROLMENT_VCT] },
        claims: [
          { path: ['instituteName'] },
          { path: ['program'] },
          { path: ['courseName'] },
          { path: ['enrollmentDate'] },
          { path: ['enrollmentStatus'] },
          { path: ['completionStatus'] },
          { path: ['percentage'] },
        ],
      },
    ],
  },
  client_metadata: { client_name: 'Universidade Vale Novo — Transfer Admissions' },
}
