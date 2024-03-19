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
        <header className='p-4 space-x-4 bg-zinc-900'>
          <span className='inline-block text-primary' style={{ fontFamily: 'Monoton-Regular' }}>
            &#123;&nbsp;&#125;
          </span>
        </header>

        <section className='flex-1 flex'>
          <AsideMenus className='w-64 shrink-0 bg-zinc-800' />

          <main className='flex-1 overflow-auto bg-[#2d2d2d]'>
            <Outlet />
          </main>
        </section>
      </section>
    </>
  )
}
