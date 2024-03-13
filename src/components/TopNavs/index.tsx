/**
 * @name TopNavs
 * @description
 * @author darcrand
 */

import { NavSchema, db } from '@/lib/db'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { head } from 'ramda'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function TopNavs() {
  const { data: navList } = useQuery({
    queryKey: ['navs'],
    queryFn: () => db.navs.getAll(),
  })

  return (
    <>
      <section>
        <p>navs</p>
        {navList?.map((v) => (
          <NavItem key={v.id} data={v} />
        ))}
      </section>
    </>
  )
}

function queryFileById(id?: string) {
  return {
    enabled: !!id,
    retry: false,
    queryKey: ['file', id],
    queryFn: async () => {
      const res = await db.files.getById(id || '')
      if (res) {
        return res
      } else {
        throw new Error('file not found')
      }
    },
  }
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

  return (
    <span>
      <Link to={props.data.url} className={`text-sm ${hasError && 'line-through'}`}>
        {hasError ? 'file removed' : label}
      </Link>

      <button className='p-2 bg-rose-400' onClick={() => removeNav()}>
        x
      </button>
    </span>
  )
}
