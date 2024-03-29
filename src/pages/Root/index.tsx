/**
 * @name Root
 * @description
 * @author darcrand
 */

import AsideMenus from '@/components/AsideMenus'
import { useOnReady } from '@/hooks/useOnReady'
import { useViewStatus } from '@/stores/view-status'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

export default function Root() {
  const { viewStatus, setViewStatus } = useViewStatus()
  const location = useLocation()
  const navigate = useNavigate()

  useOnReady(() => {
    // 重定向
    const url = `${location.pathname}${location.search}`
    if (viewStatus.lastPath && viewStatus.lastPath !== url) {
      navigate(viewStatus.lastPath!)
    }
  }, !!viewStatus.lastPath)

  useEffect(() => {
    // 缓存最后打开的文件
    const t = setTimeout(() => {
      setViewStatus({ lastPath: `${location.pathname}${location.search}` })
    }, 1000)
    return () => clearTimeout(t)
  }, [location, setViewStatus])

  return (
    <>
      <section className='flex flex-col h-screen overflow-auto'>
        <header className='p-2 text-center bg-[var(--header-color)]'>
          <span className='text-gray-500'>JSON Viewer React</span>
        </header>

        <section className='flex-1 flex'>
          <AsideMenus className='w-64 shrink-0 bg-[var(--sidebar-color)]' />

          <main className='flex-1 overflow-auto bg-[var(--content-wrap-color)]'>
            <Outlet />
          </main>
        </section>
      </section>
    </>
  )
}
