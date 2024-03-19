import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export type ViewStatus = {
  lastPath?: string
}

const stateAtom = atomWithStorage<ViewStatus>('view-status', {
  lastPath: undefined,
})

export function useViewStatus() {
  const [viewStatus, setViewStatus] = useAtom(stateAtom)

  return {
    viewStatus,
    setViewStatus,
  }
}
