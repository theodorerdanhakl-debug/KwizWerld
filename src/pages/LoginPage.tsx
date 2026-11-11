import { AuthLayout } from '../components/AuthLayout'
import { GuestOnly } from '../components/GuestOnly'
import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  return (
    <GuestOnly>
      <AuthLayout title="Welcome back" lede="Log in to pick up your lessons.">
        <LoginForm />
      </AuthLayout>
    </GuestOnly>
  )
}
