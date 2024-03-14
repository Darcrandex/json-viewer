/**
 * @name CodeView
 * @description
 * @author darcrand
 */

import TopNavs from '@/components/TopNavs'
import { db } from '@/lib/db'
import { queryContentById } from '@/queries/queryContentById'
import { queryFileById } from '@/queries/queryFileById'
import { cls } from '@/utils/cls'
import { getUrlData } from '@/utils/getUrlData'
import MonacoEditor, { DiffEditor } from '@monaco-editor/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAddNav } from './useAddNav'

export default function CodeView() {
  useAddNav()
  const location = useLocation()
  const { fid, cid } = getUrlData(`${location.pathname}${location.search}`)

  const fileRes = useQuery(queryFileById(fid))
  const compareFileRes = useQuery(queryFileById(cid))
  const hasError = fileRes.error || compareFileRes.error

  const [value, setValue] = useState<string>()
  const fileContentRes = useQuery(queryContentById(fileRes.data?.contentId))
  const compareFileContentRes = useQuery(queryContentById(compareFileRes.data?.contentId))

  useEffect(() => {
    if (fileContentRes.data) {
      setValue(fileContentRes.data.content)
    }
  }, [fileContentRes.data])

  const { mutateAsync: updateContent } = useMutation({
    mutationFn: async (content?: string) => {
      if (fileContentRes.data) {
        await db.contents.update({ ...fileContentRes.data, content: content || '' })
      }
    },
  })

  const autoSave = useCallback(
    (value?: string) => {
      const t = setTimeout(() => {
        updateContent(value)
      }, 500)

      return () => clearTimeout(t)
    },
    [updateContent]
  )

  return (
    <>
      <section className='flex flex-col h-full'>
        <TopNavs />

        {hasError && <div className='text-center text-red-400'>Error</div>}

        <div className={cls('flex-1 relative', hasError && 'invisible pointer-events-none')}>
          <article data-name='fixed-wrapper' className='absolute inset-0'>
            {cid ? (
              <DiffEditor
                language='json'
                loading={null}
                options={{ readOnly: true }}
                original={value}
                modified={compareFileContentRes.data?.content}
              />
            ) : (
              <MonacoEditor
                language='json'
                loading={null}
                value={value}
                onChange={(val) => {
                  setValue(val)
                  autoSave(val)
                }}
              />
            )}
          </article>
        </div>
      </section>
    </>
  )
}
