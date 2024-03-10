/**
 * @name AsideBar
 * @description
 * @author darcrand
 */

'use client'
import { FileSchema, db } from '@/lib/db'
import { cls } from '@/utils/cls'
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import * as R from 'ramda'

import ClearButton from './ClearButton'
import ListItem from './ListItem'

const MAX_FILES = 100

export default function AsideBar(props: { className?: string }) {
  const router = useRouter()
  const fileId = useParams().id as string
  const compareId = useSearchParams().get('compareId')
  const queryClient = useQueryClient()

  const { data: list } = useQuery({
    queryKey: ['files'],
    queryFn: () => db.files.getAll(),
    select: (arr) => R.sortWith([R.ascend(R.prop('createdAt'))], arr),
  })

  const { mutate: onCreate } = useMutation({
    mutationFn: async (data: Omit<FileSchema, 'id' | 'createdAt' | 'updatedAt'>) => {
      const id = await db.files.create(data)

      // 这一步比较特殊
      // 因为本来 content 是 file 中的一个字段
      // 为了查询优化把它单独存储起来
      // 但是它的 id 应该与 file 的 id 一致
      await db.contents.update({ id, fileId: id, content: '' })
      return id
    },
    onSuccess: (createdId) => {
      queryClient.invalidateQueries({ queryKey: [] })
    },
  })

  const { mutate: onUpdate } = useMutation({
    mutationFn: async (data: FileSchema) => {
      await db.files.update(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [] })
    },
  })

  const { mutate: onRemove } = useMutation({
    mutationFn: async (id: string) => {
      await db.files.remove(id)
      await db.contents.remove(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [] })
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

  const onCompare = async (id: string) => {
    const matchedNav = (await db.navs.getAll()).find((v) => v.fileId === fileId && v.compareId === id)

    if (!matchedNav) {
      await db.navs.create({ fileId, compareId: id })
      queryClient.invalidateQueries({ queryKey: ['navs'] })
    }

    router.push(`/files/${fileId}?compareId=${id}`)
  }

  const onClear = async () => {
    await db.contents.clear()
    await db.files.clear()
    await db.navs.clear()
    router.replace('/files')
    queryClient.invalidateQueries({ queryKey: [] })
  }

  return (
    <>
      <aside className={cls('flex flex-col w-64 overflow-auto', props.className)}>
        <header className='space-x-2 text-white'>
          <button
            type='button'
            disabled={typeof list?.length === 'number' && list?.length >= MAX_FILES}
            className='p-2 my-2'
            onClick={() => onCreate({ name: 'new file' })}
          >
            <FontAwesomeIcon icon={faFileCirclePlus} size='sm' />
          </button>

          <ClearButton onClear={onClear} />
        </header>

        <ul className='flex-1 overflow-auto'>
          {list?.map((item) => (
            <li key={item.id} onClick={() => onNavigate(item.id)}>
              <ListItem
                value={item}
                active={fileId === item.id}
                canCompare={!!fileId && fileId !== item.id && !compareId}
                onChange={onUpdate}
                onRemove={onRemove}
                onCompare={onCompare}
              />
            </li>
          ))}
        </ul>
      </aside>
    </>
  )
}
