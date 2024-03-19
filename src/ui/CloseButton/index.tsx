/**
 * @name CloseButton
 * @description
 * @author darcrand
 */

import { cls } from '@/utils/cls'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export type CloseButtonProps = {
  className?: string
  onClick?: React.MouseEventHandler
}

export default function CloseButton(props: CloseButtonProps) {
  return (
    <>
      <button
        type='button'
        className={cls(
          'inline-flex items-center justify-center w-6 h-6 rounded-full text-gray-100 transition-all hover:bg-white/10',
          props.className
        )}
        onClick={props.onClick}
      >
        <FontAwesomeIcon icon={faClose} size='sm' />
      </button>
    </>
  )
}
