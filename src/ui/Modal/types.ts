import { ReactNode } from 'react'

export type ModalProps = {
  open?: boolean
  onClose?: () => void
  title?: string

  children?: ReactNode
  bodyClassName?: string

  footer?: ReactNode
  footerClassName?: string
}
