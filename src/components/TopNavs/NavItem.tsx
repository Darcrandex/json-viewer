/**
 * @name NavItem
 * @description 顶部导航单项
 */

import { NavSchema, db } from '@/lib/db'
import { cls } from '@/utils/cls'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export default function NavItem(props: { data: NavSchema; onClick?: () => void; onRemove?: () => void }) {
  const fileId = useParams().id as string
  const compareId = useSearchParams().get('compareId') || undefined
  const navFileId = props.data.fileId
  const navCompareId = props.data.compareId

  const { data: fileData, error } = useQuery({
    queryKey: ['file', 'item', navFileId],
    enabled: !!navFileId,
    queryFn: async () => {
      const res = await db.files.getById(navFileId || '')
      if (res) {
        return res
      } else {
        throw new Error('file not found')
      }
    },
    retry: false,
  })

  const { data: compareFileData } = useQuery({
    queryKey: ['file', 'item', navCompareId],
    enabled: !!navCompareId,
    queryFn: () => db.files.getById(navCompareId || ''),
    retry: false,
  })

  const isActive = fileId === navFileId && compareId === navCompareId

  const label = useMemo(() => {
    if (error) return 'removed'

    if (fileData && compareFileData) return `${fileData.name} - ${compareFileData.name}`

    if (fileData) return fileData.name
  }, [error, fileData, compareFileData])

  return (
    <div
      id={generateEleId(navFileId, navCompareId)}
      className={cls(
        'group flex items-center',
        'p-2 space-x-2 text-white cursor-pointer select-none',
        isActive ? 'bg-dark-500' : ''
      )}
      onClick={() => props.onClick?.()}
    >
      <span className={cls('truncate min-w-8 text-sm', error && 'line-through')}>{label}</span>

      <button
        type='button'
        className={cls(
          'inline-flex w-6 h-6 ml-auto items-center justify-center rounded-full p-1 transition-all',
          'hover:bg-white/20',
          !isActive && 'opacity-0 group-hover:opacity-100'
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

export function generateEleId(fileId: string, compareId?: string) {
  return compareId ? `nav-${fileId}-${compareId}` : `nav-${fileId}`
}
