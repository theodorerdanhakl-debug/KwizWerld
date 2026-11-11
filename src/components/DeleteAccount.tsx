import { useState } from 'react'
import { Button } from './Button'
import { Modal } from './Modal'
import { SettingsSection } from './SettingsSection'
import { useSessionStore } from '../store/session'
import { useToastStore } from '../store/toast'

export function DeleteAccount() {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  async function onDelete() {
    if (pending) return
    setPending(true)
    const result = await useSessionStore.getState().deleteAccount()
    setPending(false)
    if (!result.ok) {
      useToastStore.getState().push(result.message)
      return
    }
    setOpen(false)
  }

  return (
    <SettingsSection title="Account" lede="Delete your account and the progress stored with it.">
      <Button onClick={() => setOpen(true)}>Delete account</Button>
      <Modal
        open={open}
        title="Delete account"
        onClose={() => {
          if (!pending) setOpen(false)
        }}
        actions={
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" disabled={pending} aria-busy={pending} onClick={() => void onDelete()}>
              {pending ? 'Deleting' : 'Delete account'}
            </Button>
            <Button disabled={pending} onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        }
      >
        This removes your account. Lessons and progress stored with it go too.
      </Modal>
    </SettingsSection>
  )
}
