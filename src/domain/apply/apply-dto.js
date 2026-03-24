/**
 * @typedef {Object} ApplicationItem
 * @property {string} id
 * @property {string} submittedAt
 * @property {'pending' | 'pass' | 'fail'} status
 * @property {string} name
 * @property {string} gender
 * @property {string} birthdate
 * @property {string} phone
 * @property {string} email
 * @property {string} [sns]
 * @property {string} mtAvailable
 * @property {string} mainContact
 * @property {string[]} availableTimes
 * @property {string[]} interviewTimes
 * @property {number} scaleGourmet
 * @property {number} scalePeople
 * @property {string} q3_1_style
 * @property {string} q1_intro
 * @property {string} q2_drink
 * @property {string} q3_2_reason
 * @property {string} [qEtc]
 */

/**
 * @typedef {Object} InterviewSettings
 * @property {string} mtDate
 * @property {string[]} interviewDates
 * @property {string[]} interviewTimes
 */

/**
 * @typedef {Object} ApplyPeriod
 * @property {string} start - ISO 8601
 * @property {string} end   - ISO 8601
 * @property {boolean} [forceClosed]
 */
