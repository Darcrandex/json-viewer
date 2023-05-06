/**
 * @name ViewItem
 * @description
 * @author darcrand
 */

import { useItemState } from '@/stores/items'
import JSONEditor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'
import * as R from 'ramda'
import { useEffect, useRef } from 'react'

export type ViewItemProps = { id: string }

export default function ViewItem(props: ViewItemProps) {
  const { itemState, setItem } = useItemState(props.id)

  const containerRef = useRef<HTMLElement>(null)
  const editorRef = useRef<JSONEditor | null>(null)

  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      const editor = new JSONEditor(containerRef.current, {
        mode: 'code',
        onChangeText(jsonString) {
          setItem((curr) => R.mergeLeft({ jsonStr: jsonString }, curr))
        },
      })
      editorRef.current = editor
    }

    return () => {
      editorRef.current?.destroy()
    }
  }, [setItem])

  useEffect(() => {
    if (itemState.jsonStr?.trim()) {
      editorRef.current?.updateText(itemState.jsonStr?.trim())
    }
  }, [itemState.jsonStr])

  return (
    <>
      <h1>ViewItem</h1>

      <section ref={containerRef}></section>
    </>
  )
}
