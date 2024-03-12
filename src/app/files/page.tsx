/**
 * @name FilesPage
 * @description
 * @author darcrand
 */

'use client'
import { FileSchema, db } from '@/lib/db'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export default function FilesPage() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: total } = useQuery({
    queryKey: ['files', 'length'],
    queryFn: () => db.files.count(),
  })

  const { mutate: onCreate } = useMutation({
    mutationFn: async (data: Omit<FileSchema, 'id' | 'createdAt' | 'updatedAt'>) => {
      const id = await db.files.create(data)

      // 这一步比较特殊
      // 因为本来 content 是 file 中的一个字段
      // 为了查询优化把它单独存储起来
      // 但是它的 id 应该与 file 的 id 一致
      await db.contents.update({ id, fileId: id, content: '' })
      await db.navs.create({ fileId: id })
      return id
    },
    onSuccess: (createdId) => {
      queryClient.invalidateQueries({ queryKey: [] })
      router.push(`/files/${createdId}`)
    },
  })

  return (
    <>
      {!!total ? (
        <h1 className='text-center mt-24 text-white'>json viewer</h1>
      ) : (
        <p className='text-center mt-24'>
          <button
            type='button'
            className='px-2 py-1 bg-dark-500 text-white rounded-md'
            onClick={() => onCreate({ name: 'new file' })}
          >
            create new one
          </button>
        </p>
      )}
    </>
  )
}
