/**
 * @name Content
 * @description
 * @author darcrand
 */

'use client'
import { cls } from '@/utils/cls'
import { AnimatePresence, motion } from 'framer-motion'
import { PropsWithChildren, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { usePopoverContext } from './context'

export default function Content(props: PropsWithChildren<{ className?: string }>) {
  const { ref, open, setOpen } = usePopoverContext()
  const tiggerRect = useMemo(() => {
    if (!ref.current || typeof open === 'undefined') return null
    return ref.current.getBoundingClientRect()
  }, [ref, open])

  const position = useMemo(() => {
    if (!tiggerRect) return { top: 0, left: 0 }
    return {
      top: tiggerRect.top + tiggerRect.height,
      left: tiggerRect.left,
    }
  }, [tiggerRect])

  if (typeof window === 'undefined') return null

  return createPortal(
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className={cls('fixed z-10', props.className)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={position}
            onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
            }}
          >
            {props.children}
          </motion.div>
        )}
      </AnimatePresence>
    </>,

    window.document.body
  )
}
