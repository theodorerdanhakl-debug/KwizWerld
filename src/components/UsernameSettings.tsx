import { useEffect, useState, type FormEvent } from 'react'
import { useSessionStore } from '../store/session'
import { useToastStore } from '../store/toast'
import { validateUsername } from '../utils/accountForm'
import { Button } from './Button'
import { Field } from './Field'
import { SettingsSection } from './SettingsSection'

export function UsernameSettings() {
  const profile = useSessionStore((state) => state.profile)
  const serverUsername = profile?.username ?? ''
  const [username, setUsername] = useState(serverUsername)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (serverUsername) setUsername(serverUsername)
  }, [serverUsername])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!profile || pending) return
    const nextError = validateUsername(username)
    setError(nextError)
    if (nextError) return
    const next = username.trim()
    if (next === profile.username) return
    setPending(true)
    const result = await useSessionStore.getState().saveProfile({ username: next })
    setPending(false)
    if (!result.ok) {
      useToastStore.getState().push(result.message)
      return
    }
    setUsername(next)
  }

  return (
    <SettingsSection title="Username" lede="This is the name other players see.">
      <form className="max-w-sm" onSubmit={(event) => void onSubmit(event)} noValidate>
        <Field label="Username" error={error}>
          {({ id, describedBy }) => (
            <input
              id={id}
              className="field-input"
              autoComplete="username"
              value={username}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy}
              onChange={(event) => {
                setUsername(event.target.value)
                setError(null)
              }}
            />
          )}
        </Field>
        <div className="mt-6">
          <Button
            variant="primary"
            type="submit"
            disabled={pending || !profile || username.trim() === serverUsername}
            aria-busy={pending}
          >
            {pending ? 'Saving' : 'Save username'}
          </Button>
        </div>
      </form>
    </SettingsSection>
  )
}
