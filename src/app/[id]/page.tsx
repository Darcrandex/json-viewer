/**
 * @name ContentPage
 * @description json 文件内容页面
 * @author darcrand
 */

'use client'

import MonacoEditor from '@monaco-editor/react'
import { useParams } from 'next/navigation'
import { useState } from 'react'

export default function ContentPage() {
  const id = useParams().id as string
  const [value, setValue] = useState<string>()

  return (
    <>
      <h1>Page</h1>
      <p>id: {id}</p>

      <MonacoEditor language='json' height='60vh' theme='vs-dark' value={value} onChange={(val) => setValue(val)} />
    </>
  )
}
