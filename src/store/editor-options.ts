import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export type EditorOptions = {
  theme: string
  fontSize: number
}

const stateAtom = atomWithStorage<EditorOptions>('editor-options', {
  theme: 'vs-dark',
  fontSize: 18,
})

export function useEditorOptions() {
  const [editorOptions, setEditorOptions] = useAtom(stateAtom)

  return {
    editorOptions,
    setEditorOptions,
  }
}
