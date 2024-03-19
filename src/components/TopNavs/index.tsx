/**
 * @name TopNavs
 * @description
 * @author darcrand
 */

import { NavSchema, db } from '@/lib/db'
import { queryFileById } from '@/queries/queryFileById'
import IconButton from '@/ui/IconButton'
import { cls } from '@/utils/cls'
import { getUrlData } from '@/utils/getUrlData'
import { faClose } from '@fortawesome/free-solid-svg-icons'
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
      <section ref={refNav} className='flex flex-nowrap overflow-auto'>
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
        return `${fileRes.data.name} vs ${compareFileRes.data.name}`
      } else {
        return fileRes.data.name
      }
    }
  }, [fileRes, compareFileRes])

  const hasError = fileRes.error || compareFileRes.error

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { mutateAsync: removeNav } = useMutation({
    mutationFn: async () => {
      await db.navs.remove(props.data.id)
      const navs = await db.navs.getAll()
      const firstNav = head(navs)
      return firstNav ? firstNav.url : '/'
    },
    onSuccess(url) {
      queryClient.invalidateQueries({ queryKey: ['navs'] })
      navigate(url)
    },
  })

  const location = useLocation()
  const { fid: _fid, cid: _cid } = getUrlData(`${location.pathname}${location.search}`)
  const isActive = _fid === props.data.fid && _cid === props.data.cid

  return (
    <span
      id={generateEleId(props.data.fid, props.data.cid)}
      className={cls(
        'flex items-center space-x-4 p-2 border-b border-transparent',
        isActive && 'bg-zinc-900 border-primary'
      )}
    >
      <Link
        to={props.data.url}
        className={cls(
          'text-white transition-all truncate hover:opacity-75',
          hasError && 'line-through'
        )}
      >
        {hasError ? 'file removed' : label}
      </Link>

      <IconButton icon={faClose} onClick={() => removeNav()} />
    </span>
  )
}

function generateEleId(fileId: string, compareId?: string) {
  return compareId ? `nav-${fileId}-${compareId}` : `nav-${fileId}`
}
