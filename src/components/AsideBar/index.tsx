/**
 * @name AsideBar
 * @description
 * @author darcrand
 */

'use client'
import { db } from '@/lib/db'
import { FileItem } from '@/lib/db/scheme/file-item'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import ListItem from './ListItem'

const MAX_FILES = 100

export default function AsideBar() {
  const router = useRouter()
  const id = useParams().id as string
  const queryClient = useQueryClient()

  const { data: list } = useQuery({
    queryKey: ['files'],
    queryFn: () => {
      return db.fileList.getAll()
    },
  })

  const { mutate: onCreate } = useMutation({
    mutationFn: async (data: Omit<FileItem, 'id'>) => {
      const id = await db.fileList.create(data)
      await db.items.create({ id, text: '' })
      return id
    },
    onSuccess: (createdId) => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      router.push(`/files/${createdId}`)
    },
  })

  const { mutate: onUpdate } = useMutation({
    mutationFn: async (data: FileItem) => {
      await db.fileList.update(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
    },
  })

  const { mutate: onRemove } = useMutation({
    mutationFn: async (id: string) => {
      await db.fileList.remove(id)
      await db.items.remove(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      router.replace('/files')
    },
  })

  return (
    <>
      <aside className='w-64' style={{ backgroundColor: 'rgb(50,50,50)' }}>
        <header>
          <button
            type='button'
            disabled={typeof list?.length === 'number' && list?.length >= MAX_FILES}
            className='p-2 my-2'
            onClick={() => onCreate({ name: 'new file' })}
          >
            add
          </button>
        </header>

        <ul>
          {list?.map((item) => (
            <li key={item.id} onClick={() => router.push(`/files/${item.id}`)}>
              <ListItem value={item} active={id === item.id} onChange={onUpdate} onRemove={onRemove} />
            </li>
          ))}
        </ul>
      </aside>
    </>
  )
}
