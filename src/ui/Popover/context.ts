'use client'
import { createContext, useContext } from 'react'
import { PopoverContextValue } from './types'

const PopoverContext = createContext<PopoverContextValue>({
  open: false,
  setOpen: () => {},
  ref: { current: null },
})

export default PopoverContext

export function usePopoverContext() {
  return useContext(PopoverContext)
}
