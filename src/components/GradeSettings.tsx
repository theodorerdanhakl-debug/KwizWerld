import { useEffect, useState } from 'react'
import { GRADES, gradeLabel, isGrade } from '../data/content'
import { useSessionStore } from '../store/session'
import { useToastStore } from '../store/toast'
import { Field } from './Field'
import { SettingsSection } from './SettingsSection'

export function GradeSettings() {
  const profile = useSessionStore((state) => state.profile)
  const serverGrade = profile?.gradeLevel ?? ''
  const [grade, setGrade] = useState(serverGrade)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (serverGrade) setGrade(serverGrade)
  }, [serverGrade])

  async function onChange(value: string) {
    if (!profile || pending || !isGrade(value) || value === profile.gradeLevel) return
    setGrade(value)
    setPending(true)
    const result = await useSessionStore.getState().saveProfile({ gradeLevel: value })
    setPending(false)
    if (!result.ok) {
      setGrade(profile.gradeLevel)
      useToastStore.getState().push(result.message)
    }
  }

  return (
    <SettingsSection title="Learning" lede="Lessons follow this grade.">
      <div className="max-w-xs">
        <Field label="Grade">
          {({ id }) => (
            <select
              id={id}
              className="field-input"
              value={grade}
              disabled={pending || !profile}
              onChange={(event) => void onChange(event.target.value)}
            >
              {GRADES.map((item) => (
                <option key={item} value={item}>
                  {gradeLabel(item)}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>
    </SettingsSection>
  )
}
