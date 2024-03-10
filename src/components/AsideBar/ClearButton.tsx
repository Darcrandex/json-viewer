/**
 * @name ClearButton
 * @description
 * @author darcrand
 */

import Modal from '@/ui/Modal'
import { cls } from '@/utils/cls'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'

export default function ClearButton(props: { onClear?: () => void; className?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type='button' className={cls('p-2 my-2', props.className)} onClick={() => setOpen(true)}>
        <FontAwesomeIcon icon={faTrashCan} size='sm' />
      </button>

      <Modal title='tips' bodyClassName='w-96 max-w-full' open={open} onClose={() => setOpen(false)}>
        <p>are you sure to clear all files?</p>
        <button
          onClick={() => {
            props.onClear?.()
            setOpen(false)
          }}
        >
          clear
        </button>
      </Modal>
    </>
  )
}