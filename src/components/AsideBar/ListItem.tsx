/**
 * @name ListItem
 * @description
 * @author darcrand
 */

import { FileSchema } from '@/lib/db'
import { PopoverContent, PopoverRoot, PopoverTrigger } from '@/ui/Popover'
import { cls } from '@/utils/cls'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'

export type ListItemProps = {
  value: FileSchema
  onRemove: (id: string) => void
  onChange: (data: FileSchema) => void
  onCompare: (id: string) => void

  active?: boolean
  canCompare?: boolean
  className?: string
}

export default function ListItem(props: ListItemProps) {
  const [value, setValue] = useState(props.value.name)
  const [editing, setEditing] = useState(false)

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
          'group relative flex justify-between items-center p-2 cursor-pointer transition-all',
          'text-white',
          props.active ? 'bg-white/20' : 'hover:bg-white/10',
          props.className
        )}
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
          <span className='mr-auto truncate text-white'>{props.value.name}</span>
        )}

        <PopoverRoot>
          <PopoverTrigger
            className={({ isOpen }) =>
              cls('shrink-0 ml-2 w-8 transition-all', isOpen ? '' : 'opacity-0 group-hover:opacity-100')
            }
          >
            <FontAwesomeIcon icon={faEllipsis} size='sm' />
          </PopoverTrigger>

          <PopoverContent>
            <menu className='flex flex-col w-48 p-2 space-y-2 bg-gray-800'>
              <button
                type='button'
                className='cursor-pointer hover:bg-blue-300'
                onClick={() => props.onRemove(props.value.id)}
              >
                remove
              </button>

              <button type='button' className='cursor-pointer hover:bg-blue-300' onClick={() => setEditing(true)}>
                rename
              </button>

              {props.canCompare && (
                <button
                  type='button'
                  className='cursor-pointer hover:bg-blue-300'
                  onClick={() => props.onCompare(props.value.id)}
                >
                  compare to current
                </button>
              )}
            </menu>
          </PopoverContent>
        </PopoverRoot>
      </div>
    </>
  )
}
