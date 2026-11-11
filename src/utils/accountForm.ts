import { isGrade } from '../data/content'
import { isThemePreference, type ThemePreference } from '../store/theme'

const USERNAME_PATTERN = /^[A-Za-z0-9_]{3,20}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateUsername(value: string): string | null {
  const username = value.trim()
  if (!USERNAME_PATTERN.test(username)) {
    return 'Use 3 to 20 letters, numbers, or underscores.'
  }
  return null
}

export function validateEmail(value: string): string | null {
  const email = value.trim()
  if (!EMAIL_PATTERN.test(email)) return 'Enter a valid email address.'
  return null
}

export function validatePassword(value: string): string | null {
  if (value.length < 8) return 'Use at least 8 characters.'
  return null
}

export function validateGrade(value: string): string | null {
  if (!isGrade(value)) return 'Choose a grade from K through 12.'
  return null
}

export function isTheme(value: string): value is ThemePreference {
  return isThemePreference(value)
}

type AuthErrorLike = {
  message?: string
  details?: string
  hint?: string
  code?: string
}

export function friendlyAuthError(error: AuthErrorLike): string {
  const blob = `${error.message ?? ''} ${error.details ?? ''} ${error.hint ?? ''}`.toLowerCase()
  if (error.code === '23505' || blob.includes('duplicate') || blob.includes('unique')) {
    return 'That username is taken.'
  }
  if (blob.includes('database error saving new user')) {
    return 'Check your username and grade, then try again.'
  }
  if (blob.includes('invalid login')) return 'That email and password do not match.'
  if (blob.includes('email not confirmed')) return 'Confirm your email, then try again.'
  if (blob.includes('already registered') || blob.includes('already been registered')) {
    return 'That email already has an account.'
  }
  if (blob.includes('username')) return 'Use 3 to 20 letters, numbers, or underscores.'
  if (blob.includes('password')) return 'Use at least 8 characters.'
  if (blob.includes('grade')) return 'Choose a grade from K through 12.'
  return 'Something went wrong. Try again.'
}

export function safeNextPath(value: unknown): string {
  if (typeof value !== 'object' || value === null || !('from' in value)) return '/home'
  const from = value.from
  if (typeof from !== 'string') return '/home'
  if (!from.startsWith('/') || from.startsWith('//')) return '/home'
  if (from.startsWith('/login') || from.startsWith('/signup')) return '/home'
  return from
}
