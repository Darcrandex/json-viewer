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
        className={cls('text-white transition-all hover:opacity-75', props.className)}
        onClick={props.onClick}
      >
        <FontAwesomeIcon icon={props.icon} size='sm' />
      </button>
    </>
  )
}
