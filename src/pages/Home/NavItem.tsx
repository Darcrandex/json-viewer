/**
 * @name NavItem
 * @description 导航按钮
 * @author darcrand
 */

import { useItems, useItemState } from '@/stores/items'
import { DeleteOutlined, HighlightOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import * as R from 'ramda'
import React, { useCallback, useEffect, useRef, useState } from 'react'

export type NavItemProps = { id: string; active?: boolean; onSelect?: (id?: string) => void }

export default function NavItem(props: NavItemProps) {
  const { remove } = useItems()
  const { itemState, setItem } = useItemState(props.id)

  const onRemove = useCallback(() => {
    remove(props.id)
  }, [props, remove])

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(itemState.name)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && ref.current) ref.current.focus()
  }, [editing])

  const onConfirm = useCallback(() => {
    if (name?.trim()) {
      setEditing(false)
      setItem((curr) => R.mergeLeft({ name }, curr))
    }
  }, [name, setItem])

  const onCancel = useCallback(() => {
    setEditing(false)
    setName(itemState.name)
  }, [itemState.name])

  const onKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Enter') onConfirm()
      if (e.key === 'Escape') onCancel()
    },
    [onCancel, onConfirm]
  )

  return (
    <>
      <nav
        className={clsx(
          'group flex items-center justify-between mb-2 mx-2 p-2 border rounded-md cursor-pointer transition-all  select-none',
          props.active ? 'bg-emerald-50 border-emerald-500' : 'border-emerald-200 hover:border-emerald-500'
        )}
        onClick={() => props.onSelect?.(props.id)}
      >
        {editing ? (
          <>
            <div>
              <input
                ref={ref}
                className='w-full outline-none px-1 rounded-md text-gray-800'
                type='text'
                maxLength={20}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={onCancel}
                onKeyUp={onKeyUp}
              />
            </div>
          </>
        ) : (
          <>
            <span
              title={itemState.name}
              className={clsx(
                'flex-1 mr-2 truncate transition-all',
                props.active ? 'text-emerald-500' : 'text-gray-800'
              )}
            >
              {itemState.name}
            </span>

            <span className='space-x-2 transition-all opacity-0 group-hover:opacity-100'>
              <button
                title='edit'
                className='px-1 transition-all opacity-75 hover:opacity-100'
                onClick={() => setEditing(true)}
              >
                <HighlightOutlined className={clsx(props.active ? 'text-emerald-500' : 'text-gray-600')} />
              </button>

              <button
                title='remove'
                className='px-1 transition-all opacity-75 hover:opacity-100'
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove()
                }}
              >
                <DeleteOutlined className={clsx(props.active ? 'text-emerald-500' : 'text-gray-600')} />
              </button>
            </span>
          </>
        )}
      </nav>
    </>
  )
}
