import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome'

export type IconButtonProps = {
  className?: string
  onClick?: () => void
  icon: FontAwesomeIconProps['icon']

  title?: string
}
