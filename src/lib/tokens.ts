import { randomBytes } from 'node:crypto'

const TOKEN_BYTE_LENGTH = 32
const REVIEW_PREFIX = 'rt_'
const RESULT_PREFIX = 'st_'

function generateToken(): string {
  return randomBytes(TOKEN_BYTE_LENGTH).toString('base64url')
}

export function newReviewToken(): string {
  return `${REVIEW_PREFIX}${generateToken()}`
}

export function newResultToken(): string {
  return `${RESULT_PREFIX}${generateToken()}`
}
