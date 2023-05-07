/**
 * @name ViewItem
 * @description
 * @author darcrand
 */

import { useItemState } from '@/stores/items'
import { AlignLeftOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons'
import JSONEditor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'
import * as R from 'ramda'
import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useCopyToClipboard } from 'react-use'

export type ViewItemProps = { id: string }

export default function ViewItem(props: ViewItemProps) {
  const { itemState, setItem } = useItemState(props.id)

  const containerRef = useRef<HTMLElement>(null)
  const editorRef = useRef<JSONEditor | null>(null)

  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      const editor = new JSONEditor(containerRef.current, {
        mode: 'code',
        statusBar: false,
        allowSchemaSuggestions: false,
        navigationBar: false,

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

  const onFormat = useCallback(() => {
    if (containerRef.current) {
      const btn = containerRef.current.querySelector<HTMLButtonElement>('button.jsoneditor-format')
      btn?.click?.()
    }
  }, [])

  const onClear = useCallback(() => {
    editorRef.current?.updateText('{}')
  }, [])

  const [, copyToClipboard] = useCopyToClipboard()
  const onCopy = useCallback(() => {
    if (editorRef.current) {
      copyToClipboard(editorRef.current?.getText())
      toast.success('copy success', {
        autoClose: 1000,
        closeButton: false,
        progressStyle: { visibility: 'hidden' },
      })
    }
  }, [copyToClipboard])

  return (
    <>
      <section className='relative h-full flex flex-col'>
        <header
          className='absolute z-10 left-4 top-4 right-4 flex items-center space-x-4 bg-emerald-400 px-4'
          style={{ height: 35 }}
        >
          <button title='format' onClick={onFormat}>
            <AlignLeftOutlined className='text-white/75 hover:text-white transition-all' />
          </button>
          <button title='clear' onClick={onClear}>
            <DeleteOutlined className='text-white/75 hover:text-white transition-all' />
          </button>
          <button title='copy' onClick={onCopy}>
            <CopyOutlined className='text-white/75 hover:text-white transition-all' />
          </button>
        </header>

        <article ref={containerRef} className='flex-1 m-4'></article>
      </section>
    </>
  )
}
