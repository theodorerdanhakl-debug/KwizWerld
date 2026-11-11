import { Card } from '../components/Card'
import { PageLayout } from '../components/PageLayout'

export function LeaderboardPage() {
  return (
    <PageLayout title="Leaderboard" lede="Rankings will use EXP recorded by the server.">
      <Card>
        <p className="text-muted">No rankings yet.</p>
      </Card>
    </PageLayout>
  )
}
