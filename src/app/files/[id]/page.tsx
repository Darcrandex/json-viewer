/**
 * @name ContentPage
 * @description json 文件内容页面
 * @author darcrand
 */

'use client'
import TopNavs from '@/components/TopNavs'
import { useOnReady } from '@/hooks/useOnReady'
import { db } from '@/lib/db'
import { useEditorOptions } from '@/store/editor-options'
import MonacoEditor from '@monaco-editor/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useCallback, useState } from 'react'

export default function ContentPage() {
  const { editorOptions } = useEditorOptions()

  const queryClient = useQueryClient()
  const id = useParams().id as string
  const [value, setValue] = useState<string>()

  const { data } = useQuery({
    queryKey: ['content', id],
    queryFn: () => db.contents.getById(id),
  })

  useOnReady(
    () => {
      if (data?.content) {
        setValue(data.content)
      }
    },
    () => data?.content !== undefined
  )

  const { mutate: updateItem } = useMutation({
    mutationFn: async (content?: string) => {
      await db.contents.update({ ...data, id, content })
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['content', id] })
      console.log('update success')
    },
  })

  const updateToDB = useCallback(
    (content?: string) => {
      const t = setTimeout(() => {
        if (content !== data?.content) {
          updateItem(content)
        }
      }, 500)

      return () => clearTimeout(t)
    },
    [data?.content, updateItem]
  )

  return (
    <>
      <section className='flex flex-col h-full'>
        <TopNavs />

        <div className='flex-1 relative'>
          <article data-name='fixed-wrapper' className='absolute inset-0'>
            <MonacoEditor
              language='json'
              theme={editorOptions.theme}
              options={{ fontSize: editorOptions.fontSize }}
              loading={null}
              value={value}
              onChange={(val) => {
                setValue(val)
                updateToDB(val)
              }}
            />
          </article>
        </div>

        {/* <DiffEditor
          language='json'
          theme={editorOptions.theme}
          options={{ fontSize: editorOptions.fontSize }}
          modified={value}
          original={data?.text}
        /> */}
      </section>
    </>
  )
}
