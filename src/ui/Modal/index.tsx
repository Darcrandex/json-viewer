/**
 * @name Modal
 * @description
 * @author darcrand
 */

'use client'
import { cls } from '@/utils/cls'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { ModalProps } from './types'

export default function Modal(props: ModalProps) {
  return createPortal(
    <>
      <AnimatePresence>
        {props.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed top-0 right-0 bottom-0 left-0 bg-black/25'
            onClick={props.onClose}
          ></motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {props.open && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cls('fixed top-12 left-1/2 -translate-x-1/2 p-4 rounded-md bg-white', props.bodyClassName)}
          >
            <header className='flex items-center justify-between font-bold mb-4'>
              <span>{props.title}</span>

              <i
                className='flex items-center justify-center cursor-pointer p-1 hover:text-gray-500 transition-all'
                onClick={props.onClose}
              >
                <FontAwesomeIcon icon={faXmark} className='text-base' />
              </i>
            </header>

            <main>{props.open && props.children}</main>

            {!!props.footer && <footer className='flex justify-end space-x-2 mt-4'>{props.footer}</footer>}
          </motion.section>
        )}
      </AnimatePresence>
    </>,

    window.document.body
  )
}
