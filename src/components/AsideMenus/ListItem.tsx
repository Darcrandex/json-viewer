/**
 * @name ListItem
 * @description
 * @author darcrand
 */

import { FileSchema } from '@/lib/db'
import { PopoverContent, PopoverRoot, PopoverTrigger } from '@/ui/Popover'
import { cls } from '@/utils/cls'
import { getUrlData } from '@/utils/getUrlData'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

export type ListItemProps = {
  value: FileSchema
  onRemove: (id: string) => void
  onChange: (data: FileSchema) => void
  onCompare: (id: string) => void

  className?: string
}

export default function ListItem(props: ListItemProps) {
  const navigate = useNavigate()
  const [value, setValue] = useState(props.value.name)
  const [editing, setEditing] = useState(false)
  const isActive = useParams().id === props.value.id

  // 当前路由信息
  const location = useLocation()
  const { fid, cid } = useMemo(() => {
    const url = `${location.pathname}${location.search}`
    return getUrlData(url)
  }, [location])

  const menus = useMemo(() => {
    const canCompare = fid && fid !== props.value.id && !cid

    return [
      { value: 'rename', label: 'Rename', disabled: false, action: () => setEditing(true) },
      {
        value: 'compare',
        label: 'Compare',
        disabled: !canCompare,
        action: () => props.onCompare(props.value.id),
      },
      {
        value: 'remove',
        label: 'Delete',
        disabled: false,
        action: () => props.onRemove(props.value.id),
      },
    ]
  }, [props, fid, cid])

  const onConfirm = () => {
    setEditing(false)
    props.onChange({ ...props.value, name: value || 'unnamed' })
  }

  const onCancel = () => {
    setValue(props.value.name)
    setEditing(false)
  }

  return (
    <>
      <div
        className={cls(
          'group relative flex justify-between items-center p-2 cursor-pointer transition-all text-gray-100',
          isActive ? 'bg-white/20' : 'hover:bg-white/10',
          props.className
        )}
        onClick={() => navigate(`/${props.value.id}`)}
      >
        {editing ? (
          <input
            type='text'
            value={value}
            className='w-full bg-transparent outline-none'
            autoFocus
            maxLength={20}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onConfirm}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                onConfirm()
              }

              if (e.key === 'Escape') {
                onCancel()
              }
            }}
          />
        ) : (
          <span className='flex-1 truncate'>{props.value.name}</span>
        )}

        <PopoverRoot>
          <PopoverTrigger
            className={({ isOpen }) =>
              cls(
                'shrink-0 ml-2 w-8 transition-all',
                isOpen ? '' : 'opacity-0 group-hover:opacity-100'
              )
            }
          >
            <FontAwesomeIcon icon={faEllipsis} size='sm' />
          </PopoverTrigger>

          <PopoverContent className='shadow bg-white rounded-md'>
            <menu className='flex flex-col bg-dark-300 space-y-2 p-2 rounded'>
              {menus
                .filter((v) => !v.disabled)
                .map((v) => (
                  <button
                    key={v.value}
                    type='button'
                    className='px-2 py-1 text-left text-gray-700 rounded cursor-pointer transition-all hover:bg-gray-800/10'
                    onClick={() => v.action()}
                  >
                    {v.label}
                  </button>
                ))}
            </menu>
          </PopoverContent>
        </PopoverRoot>
      </div>
    </>
  )
}
