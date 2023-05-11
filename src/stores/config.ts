import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export type Config = { fontSize?: number; theme?: string }

// 代码主题参考 https://github.com/ajaxorg/ace/tree/master/src/theme
// 同时需要预先引入文件
const stateAtom = atomWithStorage<Config>('code-config', { fontSize: 22, theme: 'ace/theme/nord_dark' })

export function useConfig() {
  const [config, setConfig] = useAtom(stateAtom)
  return { config, setConfig }
}
