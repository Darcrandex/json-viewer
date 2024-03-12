/**
 * @name Page
 * @description
 * @author darcrand
 */

'use client'
import { useViewStatus } from '@/store/view-status'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const { viewStatus } = useViewStatus()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (pathname === '/' && viewStatus.lastPath) {
      router.replace(viewStatus?.lastPath || '/files')
    }
  }, [viewStatus, pathname, router])

  return null
}
