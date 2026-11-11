import { Avatar } from '../components/Avatar'
import { PageLayout } from '../components/PageLayout'
import { ProgressBar } from '../components/ProgressBar'

export function ProfilePage() {
  return (
    <PageLayout title="Profile" lede="Your name, progress, and look will load from the server.">
      <div className="flex items-center gap-4">
        <Avatar name="Player" size="md" />
        <h2 className="text-2xl">Player</h2>
      </div>
      <div className="mt-10">
        <ProgressBar value={null} label="EXP progress" />
      </div>
    </PageLayout>
  )
}
