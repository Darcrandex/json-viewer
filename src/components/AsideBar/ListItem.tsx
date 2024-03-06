/**
 * @name ListItem
 * @description
 * @author darcrand
 */

import { FileItem } from '@/lib/db/scheme/file-item'
import { cls } from '@/utils/cls'
import { useClickAway } from 'ahooks'
import { useRef, useState } from 'react'

export type ListItemProps = {
  value: FileItem
  onRemove: (id: string) => void
  onChange: (data: FileItem) => void

  active?: boolean
  className?: string
}

export default function ListItem(props: ListItemProps) {
  const [open, setOpen] = useState(false)
  const refMenu = useRef<HTMLElement>(null)
  useClickAway(() => setOpen(false), refMenu)

  const [value, setValue] = useState(props.value.name)
  const [editing, setEditing] = useState(false)
  const onConfirm = () => {
    setEditing(false)
    props.onChange({ ...props.value, name: value || 'unnamed' })
  }

  return (
    <>
      <div
        className={cls(
          'relative flex justify-between items-center p-2 cursor-pointer',
          props.active ? 'bg-blue-300' : 'bg-red-300',

          props.className
        )}
      >
        {editing ? (
          <input
            type='text'
            value={value}
            className='w-full'
            autoFocus
            maxLength={50}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onConfirm}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                onConfirm()
              }
            }}
          />
        ) : (
          <span className='mr-auto truncate'>{props.value.name}</span>
        )}

        <button
          type='button'
          className='shrink-0 ml-2 w-8'
          onClick={(e) => {
            e.stopPropagation()
            setOpen(!open)
          }}
        >
          {open ? '-' : '+'}
        </button>

        {open && (
          <menu ref={refMenu} className='absolute z-10 top-full left-full bg-red-300'>
            <button
              type='button'
              className='cursor-pointer hover:bg-blue-300'
              onClick={(e) => {
                e.stopPropagation()
                props.onRemove(props.value.id)
              }}
            >
              remove
            </button>

            <button
              type='button'
              className='cursor-pointer hover:bg-blue-300'
              onClick={(e) => {
                e.stopPropagation()
                setEditing(true)
                setOpen(false)
              }}
            >
              rename
            </button>
          </menu>
        )}
      </div>
    </>
  )
}
