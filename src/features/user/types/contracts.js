/**
 * @typedef {Object} UserProfile
 * @property {number} id
 * @property {string} email
 * @property {string} fullName
 * @property {string | null} avatarUrl
 * @property {boolean} emailVerified
 * @property {'USER' | 'ADMIN'} role
 * @property {string} status
 * @property {string | null} lastLoginAt
 */

/**
 * @typedef {Object} Plan
 * @property {string} code
 * @property {string} name
 * @property {number} price
 */

/**
 * @typedef {Object} Entitlement
 * @property {string} code
 * @property {number} limit
 * @property {number} used
 */

/**
 * @typedef {Object} CvUploadItem
 * @property {string} id
 * @property {string} fileName
 * @property {string} uploadedAt
 * @property {number} sizeKb
 */

/**
 * @typedef {Object} CvJdResult
 * @property {number} score
 * @property {string[]} strengths
 * @property {string[]} gaps
 * @property {string[]} suggestions
 */

/**
 * @typedef {Object} CulturalFitResult
 * @property {number} score
 * @property {string[]} fitSignals
 * @property {string[]} risks
 */

/**
 * @typedef {Object} MockInterviewSession
 * @property {string} role
 * @property {string} level
 * @property {string[]} stages
 */

export const typeContracts = {};
