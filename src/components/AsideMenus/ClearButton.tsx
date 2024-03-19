/**
 * @name ClearButton
 * @description
 * @author darcrand
 */

import IconButton from '@/ui/IconButton'
import Modal from '@/ui/Modal'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

export default function ClearButton(props: { onClear?: () => void; className?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconButton onClick={() => setOpen(true)} icon={faTrashCan} />

      <Modal
        title='Warning'
        bodyClassName='w-96 max-w-full'
        open={open}
        onClose={() => setOpen(false)}
      >
        <p>are you sure to clear all files?</p>

        <p className='mt-10 text-right'>
          <button
            className='px-2 py-1 rounded-md text-gray-100 bg-gray-800 hover:bg-gray-700'
            onClick={() => {
              props.onClear?.()
              setOpen(false)
            }}
          >
            clear
          </button>
        </p>
      </Modal>
    </>
  )
}
