/**
 * @name TopNavs
 * @description
 * @author darcrand
 */

import { NavSchema, db } from '@/lib/db'
import { cls } from '@/utils/cls'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import * as R from 'ramda'
import { useEffect, useRef } from 'react'

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

  // 水平滚动
  const refNav = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!refNav.current) return
    const ele = refNav.current

    const handleScroll = (e: any) => {
      if (!ele || !e) return

      e.preventDefault()
      const delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail))
      ele.scrollLeft -= delta * 40 // 滚动速度
    }

    ele.addEventListener('wheel', handleScroll, { passive: false })
    return () => {
      ele.removeEventListener('wheel', handleScroll)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      const targetId = generateEleId(fileId, compareId)
      const ele = document.getElementById(targetId)

      if (ele) {
        ele.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
      }
    }, 200)
    return () => clearTimeout(t)
  }, [fileId, compareId])

  return (
    <>
      <nav ref={refNav} className='flex flex-nowrap overflow-auto scrollbar-none'>
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
      id={generateEleId(navFileId, navCompareId)}
      className={cls(
        'group flex items-center',
        'px-4 py-2 space-x-2 text-white cursor-pointer select-none',
        isActive ? 'bg-dark-500' : ''
      )}
      onClick={() => props.onClick?.()}
    >
      {!!navCompareId ? (
        <span className='truncate'>
          <span>{fileData?.name}</span>
          <span>--</span>
          <span>{compareFileData?.name}</span>
        </span>
      ) : (
        <span className='truncate'>{fileData?.name}</span>
      )}

      <button
        type='button'
        className={cls(
          'inline-flex w-6 h-6 items-center justify-center rounded-full p-1 hover:bg-gray-500 transition-all',
          isActive ? 'text-white hover:text-blue-300' : 'opacity-0 group-hover:opacity-100'
        )}
        onClick={(e) => {
          e.stopPropagation()
          props.onRemove?.()
        }}
      >
        <FontAwesomeIcon icon={faXmark} size='sm' />
      </button>
    </div>
  )
}

function generateEleId(fileId: string, compareId?: string) {
  return compareId ? `nav-${fileId}-${compareId}` : `nav-${fileId}`
}
