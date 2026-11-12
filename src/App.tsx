import { MotionConfig } from 'framer-motion'
import { RewardPopup } from './components/RewardPopup'
import { ToastViewport } from './components/Toast'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import { AppRoutes } from './routes'

export function App() {
  const reducedMotion = usePrefersReducedMotion()
  return (
    <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'} transition={{ duration: 0.24, ease: 'easeOut' }}>
      <AppRoutes />
      <RewardPopup />
      <ToastViewport />
    </MotionConfig>
  )
}
