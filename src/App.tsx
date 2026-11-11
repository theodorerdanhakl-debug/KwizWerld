import { MotionConfig } from 'framer-motion'
import { ToastViewport } from './components/Toast'
import { AppRoutes } from './routes'

export function App() {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.24, ease: 'easeOut' }}>
      <AppRoutes />
      <ToastViewport />
    </MotionConfig>
  )
}
