/**
 * @name IconButton
 * @description
 * @author darcrand
 */

import { cls } from '@/utils/cls'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconButtonProps } from './types'

export default function IconButton(props: IconButtonProps) {
  return (
    <>
      <button
        title={props.title}
        className={cls(
          'inline-flex items-center justify-center w-6 h-6 rounded-md text-white transition-all hover:bg-white/10',
          props.className
        )}
        onClick={props.onClick}
      >
        <FontAwesomeIcon icon={props.icon} size='sm' />
      </button>
    </>
  )
}
