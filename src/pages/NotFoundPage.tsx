import { Button } from '../components/Button'
import { PageLayout } from '../components/PageLayout'

export function NotFoundPage() {
  return (
    <PageLayout title="Page not found" lede="That screen is not part of KwizWerld.">
      <Button variant="primary" href="/home">
        Back to subjects
      </Button>
    </PageLayout>
  )
}
