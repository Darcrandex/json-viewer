/**
 * @name Item
 * @description
 * @author darcrand
 */

import { useItemState } from '@/stores/items'
import * as R from 'ramda'
import React, { useCallback } from 'react'
import { useParams } from 'react-router-dom'

export default function Item() {
  const { id = '' } = useParams()
  const { itemState, setItem } = useItemState(id)

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setItem((curr) => R.mergeLeft({ jsonStr: e.target.value }, curr))
    },
    [setItem]
  )

  return (
    <>
      <h1>Item</h1>
      <p>{JSON.stringify(itemState)}</p>

      <textarea value={itemState.jsonStr} onChange={onChange}></textarea>
    </>
  )
}
