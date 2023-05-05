import { PrimitiveAtom, atom, useAtom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { nanoid } from 'nanoid'
import { useCallback } from 'react'

export type ItemData = {
  id: string
  name?: string
  jsonStr?: string
}

const listAtom = atom<string[]>([])
const itemFamily = atomFamily<string, PrimitiveAtom<ItemData>>(
  (id) => atom<ItemData>({ id, name: 'new one' }),
  (a, b) => a === b
)

export function useItems() {
  const [ids, setIds] = useAtom(listAtom)

  const insert = useCallback(() => {
    const id = nanoid()
    itemFamily(id)
    setIds((arr) => arr.concat(id))
    return id
  }, [setIds])

  const remove = useCallback(
    (id: string) => {
      itemFamily.remove(id)
      setIds((arr) => arr.filter((v) => v !== id))
    },
    [setIds]
  )

  return { ids, insert, remove }
}

export function useItemState(id: string) {
  const [itemState, setItem] = useAtom(itemFamily(id))
  const [ids, setIds] = useAtom(listAtom)

  if (!ids.includes(id)) {
    setIds((arr) => arr.concat(id))
  }

  return { itemState, setItem }
}
