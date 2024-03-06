/**
 * @name ContentPage
 * @description json 文件内容页面
 * @author darcrand
 */

'use client'
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
    queryKey: ['file', 'data', id],
    queryFn: () => db.items.getById(id),
  })

  useOnReady(
    () => {
      if (data?.text) {
        setValue(data.text)
      }
    },
    () => data?.text !== undefined
  )

  const { mutate: updateItem } = useMutation({
    mutationFn: async (text?: string) => {
      await db.items.update({ ...data, id, text })
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['file', 'data', id] })
      console.log('update success')
    },
  })

  const updateToDB = useCallback(
    (content?: string) => {
      const t = setTimeout(() => {
        if (content !== data?.text) {
          updateItem(content)
        }
      }, 1000)

      return () => clearTimeout(t)
    },
    [data?.text, updateItem]
  )

  return (
    <>
      <section className='h-full relative' style={{ backgroundColor: 'rgb(30,30,30)' }}>
        <div data-name='fixed-wrapper' className='absolute inset-0'>
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
