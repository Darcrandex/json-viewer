/**
 * @name Trigger
 * @description
 * @author darcrand
 */

'use client'
import { useClickAway } from 'ahooks'
import { PropsWithChildren } from 'react'
import { usePopoverContext } from './context'

export default function Trigger(
  props: PropsWithChildren<{ className?: string | ((status: { isOpen: boolean }) => string) }>
) {
  const { ref, open, setOpen } = usePopoverContext()
  useClickAway(() => setOpen(false), ref)

  return (
    <>
      <button
        ref={ref}
        type='button'
        className={typeof props.className === 'function' ? props.className({ isOpen: open }) : props.className}
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
      >
        {props.children}
      </button>
    </>
  )
}
