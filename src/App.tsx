import { useCallback, useState } from 'react'
import Loading from './screens/Loading'
import Home from './screens/Home'

export default function App() {
  const [booted, setBooted] = useState(false)
  const [videoReady, setVideoReady] = useState(false)

  const handleDone = useCallback(() => setBooted(true), [])
  const handleVideoStart = useCallback(() => setVideoReady(true), [])

  return (
    <div className="mobile-shell">
      {!booted && <Loading onDone={handleDone} onVideoStart={handleVideoStart} />}
      <Home booted={videoReady} />
    </div>
  )
}
