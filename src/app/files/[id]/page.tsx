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
import MonacoEditor, { DiffEditor } from '@monaco-editor/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export default function ContentPage() {
  const { editorOptions } = useEditorOptions()
  const router = useRouter()

  const queryClient = useQueryClient()
  const fileId = useParams().id as string
  const compareId = useSearchParams().get('compareId')
  const [value, setValue] = useState<string>()

  const { data, error } = useQuery({
    queryKey: ['content', fileId],
    enabled: !!fileId,
    queryFn: async () => {
      const res = await db.contents.getById(fileId)

      if (res) {
        return res
      } else {
        throw new Error('not found')
      }
    },
  })

  useEffect(() => {
    if (error) {
      router.replace('/files')
      queryClient.invalidateQueries({ queryKey: [] })
    }
  }, [error, router, queryClient])

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
      if (data?.id) {
        await db.contents.update({ ...data, content })
      }
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['content', fileId] })
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

  // compare

  const { data: compareFile } = useQuery({
    queryKey: ['content', compareId],
    enabled: !!compareId,
    queryFn: () => db.contents.getById(compareId || ''),
  })

  return (
    <>
      <section className='flex flex-col h-full'>
        <TopNavs />

        <div className='flex-1 relative'>
          <article data-name='fixed-wrapper' className='absolute inset-0'>
            {!!compareFile ? (
              <DiffEditor
                language='json'
                loading={null}
                theme={editorOptions.theme}
                options={{ fontSize: editorOptions.fontSize, readOnly: true }}
                original={compareFile.content}
                modified={value}
              />
            ) : (
              <MonacoEditor
                language='json'
                loading={null}
                theme={editorOptions.theme}
                options={{ fontSize: editorOptions.fontSize }}
                value={value}
                onChange={(val) => {
                  setValue(val)
                  updateToDB(val)
                }}
              />
            )}
          </article>
        </div>
      </section>
    </>
  )
}
