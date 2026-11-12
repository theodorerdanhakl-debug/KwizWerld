import { useEffect } from 'react'
import { DoorHall } from '../components/DoorHall'
import { TopNav } from '../components/TopNav'
import { getSubjects } from '../data/content'
import { useSessionStore } from '../store/session'

export function HomePage() {
  const username = useSessionStore((state) => state.profile?.username)

  useEffect(() => {
    document.title = 'Home · KwizWerld!'
  }, [])

  return (
    <div className="home-hall">
      <div className="home-drift" aria-hidden="true">
        <span className="home-drift-blob home-drift-a" />
        <span className="home-drift-blob home-drift-b" />
      </div>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <TopNav />
      <main id="content" tabIndex={-1} className="home-main">
        <h1 className="home-greeting">{username ? `Hello, ${username}.` : 'Hello.'}</h1>
        <DoorHall subjects={getSubjects()} />
      </main>
    </div>
  )
}
