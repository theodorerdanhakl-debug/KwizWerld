import { useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Modal } from '../components/Modal'
import { PageLayout } from '../components/PageLayout'

export function GachaPage() {
  const [open, setOpen] = useState(false)

  return (
    <PageLayout title="Gacha" lede="Use diamonds you earned in play for a profile look.">
      <Card>
        <p className="text-muted">Pulls are not open yet. The server will roll them.</p>
      </Card>
      <div className="mt-8">
        <Button variant="primary" onClick={() => setOpen(true)}>
          How rolls work
        </Button>
      </div>
      <Modal open={open} title="Rolls stay on the server" onClose={() => setOpen(false)}>
        KwizWerld decides the result. Diamonds are earned by playing, never bought.
      </Modal>
    </PageLayout>
  )
}
