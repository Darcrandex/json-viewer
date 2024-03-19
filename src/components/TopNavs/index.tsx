/**
 * @name TopNavs
 * @description
 * @author darcrand
 */

import { NavSchema, db } from '@/lib/db'
import { queryFileById } from '@/queries/queryFileById'
import CloseButton from '@/ui/CloseButton'
import { cls } from '@/utils/cls'
import { getUrlData } from '@/utils/getUrlData'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { head } from 'ramda'
import { useEffect, useMemo, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function TopNavs() {
  const { data: navList } = useQuery({
    queryKey: ['navs'],
    queryFn: () => db.navs.getAll(),
  })

  // 水平滚动
  const refNav = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!refNav.current) return
    const ele = refNav.current

    const handleScroll = (e: any) => {
      if (!ele || !e) return

      e.preventDefault()
      const delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail))
      ele.scrollLeft -= delta * 40 // 滚动速度
    }

    ele.addEventListener('wheel', handleScroll, { passive: false })
    return () => {
      ele.removeEventListener('wheel', handleScroll)
    }
  }, [])

  const location = useLocation()
  const { fid, cid } = getUrlData(`${location.pathname}${location.search}`)

  useEffect(() => {
    const t = setTimeout(() => {
      const targetId = generateEleId(fid, cid)
      const ele = document.getElementById(targetId)

      if (ele) {
        ele.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
      }
    }, 200)
    return () => clearTimeout(t)
  }, [fid, cid])

  return (
    <>
      <section ref={refNav} className='flex flex-nowrap overflow-auto bg-[var(--header-color)]'>
        {navList?.map((v) => (
          <NavItem key={v.id} data={v} />
        ))}
      </section>
    </>
  )
}

function NavItem(props: { data: NavSchema }) {
  const { fid, cid } = props.data

  const fileRes = useQuery(queryFileById(fid))
  const compareFileRes = useQuery(queryFileById(cid))

  const label = useMemo(() => {
    if (fileRes.data) {
      if (compareFileRes.data) {
        return `${fileRes.data.name} - ${compareFileRes.data.name}`
      } else {
        return fileRes.data.name
      }
    }
  }, [fileRes, compareFileRes])

  const hasError = fileRes.error || compareFileRes.error

  const location = useLocation()
  const { fid: _fid, cid: _cid } = getUrlData(`${location.pathname}${location.search}`)
  const isActive = _fid === fid && _cid === cid

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { mutateAsync: removeNav } = useMutation({
    mutationFn: async () => {
      const removedId = props.data.id
      const navs = await db.navs.getAll()
      const removedIndex = navs.findIndex((v) => v.id === removedId)
      await db.navs.remove(removedId)

      const nextNavs = await db.navs.getAll()
      const nextNav = nextNavs[removedIndex] || nextNavs[removedIndex - 1]
      const firstNav = head(nextNavs)

      return isActive ? nextNav?.url || firstNav?.url || '/' : undefined
    },
    onSuccess(url) {
      queryClient.invalidateQueries({ queryKey: ['navs'] })
      !!url && navigate(url)
    },
  })

  return (
    <Link
      id={generateEleId(props.data.fid, props.data.cid)}
      to={props.data.url}
      className={cls(
        'group flex items-center space-x-4 pl-4 pr-2 py-2 border-b border-transparent select-none',
        isActive && 'border-gray-500 bg-[var(--content-wrap-color)]'
      )}
    >
      <span
        className={cls(
          'text-white transition-all truncate hover:opacity-75',
          hasError && 'line-through'
        )}
      >
        {hasError ? 'file removed' : label}
      </span>

      <CloseButton
        className={cls(!isActive && 'invisible group-hover:visible')}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          removeNav()
        }}
      />
    </Link>
  )
}

function generateEleId(fileId: string, compareId?: string) {
  return compareId ? `nav-${fileId}-${compareId}` : `nav-${fileId}`
}
