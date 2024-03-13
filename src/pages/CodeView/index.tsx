/**
 * @name CodeView
 * @description
 * @author darcrand
 */

import TopNavs from '@/components/TopNavs'
import MonacoEditor from '@monaco-editor/react'
import { useState } from 'react'
import { useAddNav } from './useAddNav'

export default function CodeView() {
  useAddNav()
  const [value, setValue] = useState<string>()

  return (
    <>
      <section className='flex flex-col h-full'>
        <TopNavs />

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
