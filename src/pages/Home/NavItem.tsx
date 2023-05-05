/**
 * @name NavItem
 * @description 导航按钮
 * @author darcrand
 */

import { useItems, useItemState } from '@/stores/items'
import * as R from 'ramda'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export type NavItemProps = { id: string }

export default function NavItem(props: NavItemProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { remove } = useItems()
  const { itemState, setItem } = useItemState(props.id)

  const onClick = useCallback(() => {
    const to = `/item/${itemState.id}`
    if (to !== location.pathname) {
      navigate(to)
    }
  }, [itemState.id, location.pathname, navigate])

  const onRemove = useCallback(() => {
    remove(itemState.id)
    navigate('/', { replace: true })
  }, [itemState.id, navigate, remove])

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
      <li className='flex items-center justify-between cursor-pointer' onClick={onClick}>
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
