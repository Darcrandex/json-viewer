import { atom, useAtom } from 'jotai'

export type Config = { fontSize?: number; theme?: string }

// 代码主题参考 https://github.com/ajaxorg/ace/tree/master/src/theme
// 同时需要预先引入文件
const stateAtom = atom<Config>({ fontSize: 22, theme: 'ace/theme/nord_dark' })

export function useConfig() {
  const [config, setConfig] = useAtom(stateAtom)
  return { config, setConfig }
}
