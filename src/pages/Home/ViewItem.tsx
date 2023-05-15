/**
 * @name ViewItem
 * @description
 * @author darcrand
 */

import { useItemState } from '@/stores/items'
import {
  AlignLeftOutlined,
  CopyOutlined,
  DeleteOutlined,
  FontSizeOutlined,
  FullscreenOutlined,
  SkinOutlined,
} from '@ant-design/icons'
import { Button, Dropdown } from 'antd'
import prettier from 'prettier'
import bparserBabel from 'prettier/parser-babel'
import { last, split } from 'ramda'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useCopyToClipboard } from 'react-use'

import { useConfig } from '@/stores/config'
import clsx from 'clsx'
import AceEditor, { AceEditorHandle } from './AceEditor'

export type ViewItemProps = { id: string }

export default function ViewItem(props: ViewItemProps) {
  const { itemState, setItem } = useItemState(props.id)
  const { config, setConfig } = useConfig()

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

  const fontSizeMenus = useMemo(() => {
    const onClick = (size: number) => setConfig((curr) => ({ ...curr, fontSize: size }))
    return [14, 16, 18, 20, 22].map((size) => ({
      key: size,
      label: <span className={clsx(size === config.fontSize ? 'text-blue-400' : 'text-gray-800')}>{size}px</span>,
      onClick: () => onClick(size),
    }))
  }, [config.fontSize, setConfig])

  const onFullscreen = useCallback(() => {
    editorRef.current?.toggleFullscreen(true)
  }, [])

  const themeMenus = useMemo(() => {
    const onClick = (t: string) => setConfig((curr) => ({ ...curr, theme: t }))
    return ['ace/theme/nord_dark', 'ace/theme/one_dark'].map((k) => ({
      key: k,
      label: (
        <span className={clsx(k === config.theme ? 'text-blue-400' : 'text-gray-800')}>
          {last(split('/', k))?.replace('_', ' ')}
        </span>
      ),
      onClick: () => onClick(k),
    }))
  }, [config.theme, setConfig])

  useEffect(() => {
    if (config.fontSize) editorRef.current?.setFontSize(config.fontSize)
    if (config.theme) editorRef.current?.setTheme(config.theme)
  }, [config])

  return (
    <>
      <header className='flex items-center space-x-4 p-2'>
        <Button type='text' title='format' onClick={onFormat}>
          <AlignLeftOutlined className='text-white/75 hover:text-white transition-all' />
        </Button>

        <Button type='text' title='remove' onClick={onClear}>
          <DeleteOutlined className='text-white/75 hover:text-white transition-all' />
        </Button>

        <Button type='text' title='copy' onClick={onCopy}>
          <CopyOutlined className='text-white/75 hover:text-white transition-all' />
        </Button>

        <Dropdown trigger={['click']} menu={{ items: fontSizeMenus }}>
          <Button type='text' title='font size'>
            <FontSizeOutlined className='text-white/75 hover:text-white transition-all' />
          </Button>
        </Dropdown>

        <Dropdown trigger={['click']} menu={{ items: themeMenus }}>
          <Button type='text' title='theme'>
            <SkinOutlined className='text-white/75 hover:text-white transition-all' />
          </Button>
        </Dropdown>

        <Button type='text' title='full screen' onClick={onFullscreen}>
          <FullscreenOutlined className='text-white/75 hover:text-white transition-all' />
        </Button>
      </header>

      <AceEditor
        ref={editorRef}
        className='flex-1'
        defaultValue={itemState.jsonStr}
        onChange={(str) => setItem((curr) => ({ ...curr, jsonStr: str }))}
      />
    </>
  )
}
