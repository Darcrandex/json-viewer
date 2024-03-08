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
  const { data: navList } = useQuery({
    queryKey: ['navs'],
    queryFn: () => db.navs.getAll(),
    select: (arr) => R.sortWith([R.ascend(R.prop('createdAt'))], arr),
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
        const firstMathed = navList?.find((v) => v.fileId !== navItem.fileId || v.compareId !== navItem.compareId)
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
    const href = data.compareId ? `/files/${data.fileId}?compareId=${data.compareId}` : `/files/${data.fileId}`
    router.replace(href)
  }

  return (
    <>
      <nav className='flex flex-nowrap'>
        {navList?.map((v) => (
          <NavItem key={v.id} data={v} onClick={() => onNavigate(v)} onRemove={() => onRemove(v)} />
        ))}
      </nav>
    </>
  )
}

function NavItem(props: { data: NavSchema; onClick?: () => void; onRemove?: () => void }) {
  const fileId = useParams().id as string
  const compareId = useSearchParams().get('compareId') || undefined
  const navFileId = props.data.fileId
  const navCompareId = props.data.compareId

  const { data: fileData } = useQuery({
    queryKey: ['file', 'item', navFileId],
    enabled: !!navFileId,
    queryFn: () => db.files.getById(navFileId || ''),
  })

  const { data: compareFileData } = useQuery({
    queryKey: ['file', 'item', navCompareId],
    enabled: !!navCompareId,
    queryFn: () => db.files.getById(navCompareId || ''),
  })

  const isActive = fileId === navFileId && compareId === navCompareId

  return (
    <div
      className={cls('p-4 space-x-2 text-white', isActive ? 'bg-gray-500 text-blue-300' : '')}
      onClick={() => props.onClick?.()}
    >
      {!!navCompareId ? (
        <span>
          <span>{fileData?.name}</span>
          <span>--</span>
          <span>{compareFileData?.name}</span>
        </span>
      ) : (
        <span>{fileData?.name}</span>
      )}

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
