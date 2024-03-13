import { useEffect, useState } from 'react'

export function useOnReady<T>(callback: T, isReady: boolean | (() => boolean)) {
  const [done, set] = useState(false)

  useEffect(() => {
    if (done) return

    if ((typeof isReady === 'boolean' && isReady) || (typeof isReady === 'function' && isReady())) {
      if (typeof callback === 'function') {
        callback()
        set(true)
      }
    }
  }, [callback, isReady, done])
}
