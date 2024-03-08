/**
 * @name TopNavs
 * @description
 * @author darcrand
 */

import { NavSchema, db } from '@/lib/db'
import { cls } from '@/utils/cls'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import * as R from 'ramda'

export default function TopNavs() {
  const { data } = useQuery({
    queryKey: ['navs'],
    queryFn: () => db.navs.getAll(),
    select: (arr) => R.sortWith([R.ascend(R.prop('updatedAt'))], arr),
  })

  const router = useRouter()
  const queryClient = useQueryClient()
  const fileId = useParams().id as string
  const compareId = useSearchParams().get('compareId') || undefined

  const { mutate: onRemove } = useMutation({
    mutationFn: async (navItem: NavSchema) => {
      let nextPath = `/files/${fileId}`

      // 是否关闭当前显示的页签
      const isCloseCurrent = navItem.fileId === fileId && navItem.compareId === compareId

      if (isCloseCurrent) {
        const firstMathed = data?.find((v) => v.fileId !== navItem.fileId || v.compareId !== navItem.compareId)
        if (firstMathed) {
          nextPath = `/files/${firstMathed.fileId}`
        } else {
          nextPath = '/files'
        }
      }

      await db.navs.remove(navItem.id)
      return nextPath
    },
    onSuccess: (nextPath) => {
      queryClient.invalidateQueries({ queryKey: ['navs'] })
      router.replace(nextPath)
    },
  })

  const onNavigate = (data: NavSchema) => {
    router.replace(`/files/${data.fileId}`)
  }

  return (
    <>
      <nav className='flex flex-nowrap'>
        {data?.map((v) => (
          <NavItem key={v.id} data={v} onClick={() => onNavigate(v)} onRemove={() => onRemove(v)} />
        ))}
      </nav>
    </>
  )
}

function NavItem(props: { data: NavSchema; onClick?: () => void; onRemove?: () => void }) {
  const fileId = useParams().id as string
  const navFileId = props.data.fileId

  const { data: fileData } = useQuery({
    queryKey: ['file', 'item', navFileId],
    enabled: !!navFileId,
    queryFn: () => db.files.getById(navFileId || ''),
  })

  const isActive = navFileId === fileId

  return (
    <div
      className={cls('p-4 space-x-2 text-white', isActive ? 'bg-gray-500 text-blue-300' : '')}
      onClick={() => props.onClick?.()}
    >
      <span>{fileData?.name}</span>
      <button
        type='button'
        onClick={(e) => {
          e.stopPropagation()
          props.onRemove?.()
        }}
      >
        x
      </button>
    </div>
  )
}
