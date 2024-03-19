import { db } from '@/lib/db'
import { getUrlData } from '@/utils/getUrlData'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function useAddNav() {
  const location = useLocation()
  const queryClient = useQueryClient()

  useEffect(() => {
    const fn = async () => {
      const navs = await db.navs.getAll()
      const isExist = navs.find((v) => v.url === `${location.pathname}${location.search}`)

      if (!isExist) {
        const { fid, cid } = getUrlData(`${location.pathname}${location.search}`)
        await db.navs.create({
          url: `${location.pathname}${location.search}`,
          fid,
          cid,
        })
        queryClient.invalidateQueries({ queryKey: ['navs'] })
      }
    }

    fn()
  }, [location, queryClient])
}
