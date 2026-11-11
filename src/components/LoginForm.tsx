import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { getSupabase } from '../supabase/client'
import { useSessionStore } from '../store/session'
import { friendlyAuthError, validateEmail } from '../utils/accountForm'
import { Button } from './Button'
import { Field } from './Field'

type FieldErrors = {
  email: string | null
  password: string | null
}

export function LoginForm() {
  const configured = useSessionStore((state) => state.configured)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({ email: null, password: null })
  const [formError, setFormError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = {
      email: validateEmail(email),
      password: password.length === 0 ? 'Enter your password.' : null,
    }
    setErrors(nextErrors)
    setFormError(null)
    if (nextErrors.email || nextErrors.password) return
    if (!configured) {
      setFormError('Supabase is not configured for this app yet.')
      return
    }
    const supabase = getSupabase()
    if (!supabase) {
      setFormError('Supabase is not configured for this app yet.')
      return
    }
    setPending(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setPending(false)
    if (error) setFormError(friendlyAuthError(error))
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={(event) => void onSubmit(event)} noValidate>
      {formError ? (
        <p className="field-error" role="alert">
          {formError}
        </p>
      ) : null}
      <Field label="Email" error={errors.email}>
        {({ id, describedBy }) => (
          <input
            id={id}
            className="field-input"
            type="email"
            autoComplete="email"
            value={email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy}
            onChange={(event) => {
              setEmail(event.target.value)
              setErrors((current) => ({ ...current, email: null }))
            }}
          />
        )}
      </Field>
      <Field label="Password" error={errors.password}>
        {({ id, describedBy }) => (
          <input
            id={id}
            className="field-input"
            type="password"
            autoComplete="current-password"
            value={password}
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={describedBy}
            onChange={(event) => {
              setPassword(event.target.value)
              setErrors((current) => ({ ...current, password: null }))
            }}
          />
        )}
      </Field>
      <Button className="w-full" variant="primary" type="submit" disabled={pending} aria-busy={pending}>
        {pending ? 'Logging in' : 'Log in'}
      </Button>
      <p className="text-sm text-muted">
        New here?{' '}
        <Link to="/signup" className="text-text">
          Create an account
        </Link>
      </p>
    </form>
  )
}
