/**
 * @name CodeView
 * @description
 * @author darcrand
 */

import MonacoEditor from '@monaco-editor/react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function CodeView() {
  const location = useLocation()
  console.log('location', location)
  const [value, setValue] = useState<string>()

  return (
    <>
      <section className='flex flex-col h-full'>
        <div className='flex-1 relative'>
          <article data-name='fixed-wrapper' className='absolute inset-0'>
            <MonacoEditor
              language='json'
              loading={null}
              value={value}
              onChange={(val) => {
                setValue(val)
              }}
            />
          </article>
        </div>
      </section>
    </>
  )
}
