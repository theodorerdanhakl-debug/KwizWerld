import { AuthLayout } from '../components/AuthLayout'

export function SignupPage() {
  return (
    <AuthLayout
      title="Create an account"
      lede="Sign-up will live on this card."
      primary={{ href: '/home', label: 'Enter KwizWerld' }}
      quiet={{ href: '/login', label: 'I already have an account' }}
    />
  )
}
