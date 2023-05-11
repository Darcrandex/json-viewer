import { atom, useAtom } from 'jotai'

export type Config = { fontSize?: number; theme?: string }
const stateAtom = atom<Config>({})

export function useConfig() {
  const [config, setConfig] = useAtom(stateAtom)
  return { config, setConfig }
}
