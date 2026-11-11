import { AuthLayout } from '../components/AuthLayout'

export function LoginPage() {
  return (
    <AuthLayout
      title="Log in"
      lede="Accounts are not connected yet."
      primary={{ href: '/home', label: 'Enter KwizWerld' }}
      quiet={{ href: '/signup', label: 'Create an account' }}
    />
  )
}
