export type PopoverContextValue = {
  open: boolean
  setOpen: (open: boolean) => void

  ref: React.RefObject<HTMLButtonElement>
}
