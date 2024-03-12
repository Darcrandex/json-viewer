'use client'

import copyAPI from 'copy-to-clipboard'
import { useState } from 'react'

export function useCopy() {
  const [value, setValue] = useState<string>()
  const [success, setSuccess] = useState(false)

  const copy = (text?: string) => {
    if (!text?.trim()) return

    const result = copyAPI(text)
    setSuccess(result)

    if (result) {
      setValue(text)
    } else {
    }
  }

  const copyAsync = async (text?: string) => {
    if (!text?.trim()) return Promise.resolve(false)
    const isSuccess = copyAPI(text)
    setSuccess(isSuccess)
    if (isSuccess) {
      setValue(text)
    }

    return isSuccess
  }

  return {
    value,
    success,
    copy,
    copyAsync,
  }
}
