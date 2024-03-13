/**
 * @name Root
 * @description
 * @author darcrand
 */

'use client'
import { PropsWithChildren, useRef, useState } from 'react'
import PopoverContext from './context'

export default function Root(props: PropsWithChildren) {
  const ref = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const value = { open, setOpen, ref }

  return (
    <>
      <PopoverContext.Provider value={value}>{props.children}</PopoverContext.Provider>
    </>
  )
}
