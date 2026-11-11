import { useState } from 'react'
import { AuthLayout } from '../components/AuthLayout'
import { Button } from '../components/Button'
import { GuestOnly } from '../components/GuestOnly'
import { SignupForm } from '../components/SignupForm'

export function SignupPage() {
  const [confirmEmail, setConfirmEmail] = useState(false)

  if (confirmEmail) {
    return (
      <GuestOnly>
        <AuthLayout title="Check your email" lede="Confirm your address, then log in.">
          <Button href="/login" variant="primary">
            Go to log in
          </Button>
        </AuthLayout>
      </GuestOnly>
    )
  }

  return (
    <GuestOnly>
      <AuthLayout title="Create an account" lede="Pick a username and a grade. You can change both later.">
        <SignupForm onConfirm={() => setConfirmEmail(true)} />
      </AuthLayout>
    </GuestOnly>
  )
}
