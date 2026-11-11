import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { GRADES, gradeLabel, isGrade } from '../data/content'
import { getSupabase } from '../supabase/client'
import { useSessionStore } from '../store/session'
import {
  friendlyAuthError,
  validateEmail,
  validateGrade,
  validatePassword,
  validateUsername,
} from '../utils/accountForm'
import { Button } from './Button'
import { Field } from './Field'

export type SignupFormProps = {
  onConfirm: () => void
}

type FieldErrors = {
  username: string | null
  email: string | null
  password: string | null
  grade: string | null
}

const emptyErrors: FieldErrors = {
  username: null,
  email: null,
  password: null,
  grade: null,
}

export function SignupForm({ onConfirm }: SignupFormProps) {
  const configured = useSessionStore((state) => state.configured)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [grade, setGrade] = useState('')
  const [errors, setErrors] = useState<FieldErrors>(emptyErrors)
  const [formError, setFormError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = {
      username: validateUsername(username),
      email: validateEmail(email),
      password: validatePassword(password),
      grade: validateGrade(grade),
    }
    setErrors(nextErrors)
    setFormError(null)
    if (nextErrors.username || nextErrors.email || nextErrors.password || nextErrors.grade) return
    if (!isGrade(grade)) return
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
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          username: username.trim(),
          grade_level: grade,
        },
      },
    })
    setPending(false)
    if (error) {
      setFormError(friendlyAuthError(error))
      return
    }
    if (!data.session) onConfirm()
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={(event) => void onSubmit(event)} noValidate>
      {formError ? (
        <p className="field-error" role="alert">
          {formError}
        </p>
      ) : null}
      <Field label="Username" hint="3 to 20 letters, numbers, or underscores." error={errors.username}>
        {({ id, describedBy }) => (
          <input
            id={id}
            className="field-input"
            autoComplete="username"
            value={username}
            aria-invalid={errors.username ? true : undefined}
            aria-describedby={describedBy}
            onChange={(event) => {
              setUsername(event.target.value)
              setErrors((current) => ({ ...current, username: null }))
            }}
          />
        )}
      </Field>
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
      <Field label="Password" hint="At least 8 characters." error={errors.password}>
        {({ id, describedBy }) => (
          <input
            id={id}
            className="field-input"
            type="password"
            autoComplete="new-password"
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
      <Field label="Grade" error={errors.grade}>
        {({ id, describedBy }) => (
          <select
            id={id}
            className="field-input"
            value={grade}
            aria-invalid={errors.grade ? true : undefined}
            aria-describedby={describedBy}
            onChange={(event) => {
              setGrade(event.target.value)
              setErrors((current) => ({ ...current, grade: null }))
            }}
          >
            <option value="">Choose a grade</option>
            {GRADES.map((item) => (
              <option key={item} value={item}>
                {gradeLabel(item)}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Button className="w-full" variant="primary" type="submit" disabled={pending} aria-busy={pending}>
        {pending ? 'Creating account' : 'Create account'}
      </Button>
      <p className="text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-text">
          Log in
        </Link>
      </p>
    </form>
  )
}
