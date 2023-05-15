/**
 * @name NavItem
 * @description 导航按钮
 * @author darcrand
 */

import { useItemState, useItems } from '@/stores/items'
import { DeleteOutlined, HighlightOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import clsx from 'clsx'
import * as R from 'ramda'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

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
    } else {
      toast.error('name is required', {
        autoClose: 1000,
        closeButton: false,
        progressStyle: { visibility: 'hidden' },
      })
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
          'group flex items-center justify-between cursor-pointer text-white transition-all select-none',
          props.active ? 'bg-gray-600' : 'hover:bg-white/5'
        )}
        onClick={() => props.onSelect?.(props.id)}
      >
        {editing ? (
          <>
            <input
              ref={ref}
              className='w-full outline-none flex-1 pl-4 pr-2 py-1 bg-blue-400/20'
              type='text'
              maxLength={20}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={onCancel}
              onKeyUp={onKeyUp}
            />
          </>
        ) : (
          <>
            <span title={itemState.name} className='flex-1 pl-4 pr-2 py-1 truncate'>
              {itemState.name}
            </span>

            <span className='flex space-x-1 mr-2 transition-all opacity-0 group-hover:opacity-100'>
              <Button
                size='small'
                type='text'
                title='edit'
                icon={<HighlightOutlined className='text-white/50 hover:text-white' />}
                onClick={(e) => {
                  e.stopPropagation()
                  setEditing(true)
                }}
              />
              <Button
                size='small'
                type='text'
                title='remove'
                icon={<DeleteOutlined className='text-white/50 hover:text-white' />}
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove()
                }}
              />
            </span>
          </>
        )}
      </nav>
    </>
  )
}
