/**
 * @name AceEditor
 * @description
 * @author darcrand
 */

import ace from 'ace-builds'
import 'ace-builds/src-min-noconflict/mode-json.js'
import 'ace-builds/src-min-noconflict/theme-nord_dark.js'
import 'ace-builds/src-min-noconflict/worker-json.js'
import { CSSProperties, ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

export type AceEditorProps = {
  defaultValue?: string
  onChange?: (valueText?: string) => void
  className?: string
  style?: CSSProperties
}

export type AceEditorHandle = {
  setValue(value: string): void
  getValue(): string
  setFontSize(size: number): void
}

function AceEditor(props: AceEditorProps, ref: ForwardedRef<AceEditorHandle>) {
  const elRef = useRef<HTMLDivElement>(null)
  const aceRef = useRef<ace.Ace.Editor | null>(null)

  useEffect(() => {
    if (elRef.current && !aceRef.current) {
      const editor = ace.edit(elRef.current, {
        mode: 'ace/mode/json',
        selectionStyle: 'text',
        theme: 'ace/theme/nord_dark',
        value: props.defaultValue,
        fontSize: 16,
      })

      editor.focus()

      editor.on('change', () => {
        const text = editor.getValue()
        props.onChange?.(text)
      })

      aceRef.current = editor
    }
  }, [props])

  useEffect(() => {
    return () => {
      aceRef.current?.destroy()
    }
  }, [])

  useImperativeHandle(ref, () => ({
    setValue(str) {
      aceRef.current?.setValue(str)
    },
    getValue() {
      return aceRef.current?.getValue() || ''
    },
    setFontSize(size) {
      aceRef.current?.setFontSize(size)
    },
  }))

  return (
    <>
      <div ref={elRef} className={props.className} style={props.style}></div>
    </>
  )
}

const ForwardedAceEditor = forwardRef(AceEditor)
export default ForwardedAceEditor
