/**
 * @name ViewItem
 * @description
 * @author darcrand
 */

import { useItemState } from '@/stores/items'
import { AlignLeftOutlined, CopyOutlined, DeleteOutlined, FontSizeOutlined } from '@ant-design/icons'
import prettier from 'prettier'
import bparserBabel from 'prettier/parser-babel'
import { useCallback, useRef } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useCopyToClipboard } from 'react-use'

import AceEditor, { AceEditorHandle } from './AceEditor'

export type ViewItemProps = { id: string }

export default function ViewItem(props: ViewItemProps) {
  const { itemState, setItem } = useItemState(props.id)
  const editorRef = useRef<AceEditorHandle>(null)

  const onFormat = useCallback(() => {
    if (editorRef.current) {
      try {
        const txt = editorRef.current?.getValue()
        const formated = prettier.format(txt, { singleQuote: true, parser: 'json', plugins: [bparserBabel] })
        editorRef.current?.setValue(formated)
      } catch (error) {
        toast.error('format error', {
          autoClose: 1000,
          closeButton: false,
          progressStyle: { visibility: 'hidden' },
        })
      }
    }
  }, [])

  const onClear = useCallback(() => {
    editorRef.current?.setValue('')
  }, [])

  const [, copyToClipboard] = useCopyToClipboard()
  const onCopy = useCallback(() => {
    const txt = editorRef.current?.getValue()
    if (txt) {
      copyToClipboard(txt)
      toast.success('copy success', {
        autoClose: 1000,
        closeButton: false,
        progressStyle: { visibility: 'hidden' },
      })
    }
  }, [copyToClipboard])

  const onSetFontSize = useCallback(() => {
    editorRef.current?.setFontSize(20)
  }, [])

  return (
    <>
      <header className='flex items-center space-x-4 bg-emerald-400 px-4' style={{ height: 35 }}>
        <button title='format' onClick={onFormat}>
          <AlignLeftOutlined className='text-white/75 hover:text-white transition-all' />
        </button>
        <button title='clear' onClick={onClear}>
          <DeleteOutlined className='text-white/75 hover:text-white transition-all' />
        </button>
        <button title='copy' onClick={onCopy}>
          <CopyOutlined className='text-white/75 hover:text-white transition-all' />
        </button>
        <button title='copy' onClick={onSetFontSize}>
          <FontSizeOutlined className='text-white/75 hover:text-white transition-all' />
        </button>
      </header>

      <AceEditor
        ref={editorRef}
        className='h-96'
        defaultValue={itemState.jsonStr}
        onChange={(str) => setItem((curr) => ({ ...curr, jsonStr: str }))}
      />
    </>
  )
}
