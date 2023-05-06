/**
 * @name NavItem
 * @description 导航按钮
 * @author darcrand
 */

import { useItems, useItemState } from '@/stores/items'
import clsx from 'clsx'
import * as R from 'ramda'
import React, { useCallback, useEffect, useRef, useState } from 'react'

export type NavItemProps = { id: string; active?: boolean; onSelect?: (id?: string) => void }

export default function NavItem(props: NavItemProps) {
  const { remove } = useItems()
  const { itemState, setItem } = useItemState(props.id)

  const onRemove = useCallback(() => {
    remove(props.id)
    props.onSelect?.(undefined)
  }, [props, remove])

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(itemState.name)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && ref.current) ref.current.focus()
  }, [editing])

  const onConfirm = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (name?.trim() && e.key === 'Enter') {
        setEditing(false)
        setItem((curr) => R.mergeLeft({ name }, curr))
      }
    },
    [name, setItem]
  )

  const onCancel = useCallback(() => {
    setEditing(false)
    setName(itemState.name)
  }, [itemState.name])

  return (
    <>
      <li
        className={clsx('flex items-center justify-between cursor-pointer', props.active ? 'bg-emerald-100' : '')}
        onClick={() => props.onSelect?.(props.id)}
      >
        {editing ? (
          <>
            <input
              ref={ref}
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={onCancel}
              onKeyUp={onConfirm}
            />
          </>
        ) : (
          <>
            <span className='flex-1 truncate'>{itemState.name}</span>

            <b className='space-x-2' onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setEditing(true)}>e</button>
              <button onClick={onRemove}>r</button>
            </b>
          </>
        )}
      </li>
    </>
  )
}
