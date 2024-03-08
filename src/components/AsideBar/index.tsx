/**
 * @name AsideBar
 * @description
 * @author darcrand
 */

'use client'
import { FileSchema, db } from '@/lib/db'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import * as R from 'ramda'
import ListItem from './ListItem'

const MAX_FILES = 100

export default function AsideBar() {
  const router = useRouter()
  const id = useParams().id as string
  const queryClient = useQueryClient()

  const { data: list } = useQuery({
    queryKey: ['files'],
    queryFn: () => db.files.getAll(),
    select: (arr) => R.sortWith([R.ascend(R.prop('updatedAt'))], arr),
  })

  const { mutate: onCreate } = useMutation({
    mutationFn: async (data: Omit<FileSchema, 'id' | 'createdAt' | 'updatedAt'>) => {
      const id = await db.files.create(data)
      await db.contents.create({ fileId: id, content: '' })
      await db.navs.create({ fileId: id })
      return id
    },
    onSuccess: (createdId) => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      queryClient.invalidateQueries({ queryKey: ['navs'] })
      router.push(`/files/${createdId}`)
    },
  })

  const { mutate: onUpdate } = useMutation({
    mutationFn: async (data: FileSchema) => {
      await db.files.update(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
    },
  })

  const { mutate: onRemove } = useMutation({
    mutationFn: async (id: string) => {
      await db.files.remove(id)
      await db.contents.remove(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      router.replace('/files')
    },
  })

  const onNavigate = async (id: string) => {
    const matchedNav = (await db.navs.getAll()).find((v) => v.fileId === id && v.compareId === undefined)

    if (!matchedNav) {
      await db.navs.create({ fileId: id })
      queryClient.invalidateQueries({ queryKey: ['navs'] })
    }
    router.push(`/files/${id}`)
  }

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
            <li key={item.id} onClick={() => onNavigate(item.id)}>
              <ListItem value={item} active={id === item.id} onChange={onUpdate} onRemove={onRemove} />
            </li>
          ))}
        </ul>
      </aside>
    </>
  )
}
