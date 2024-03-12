/**
 * @name FilesLayout
 * @description
 * @author darcrand
 */

'use client'
import { useViewStatus } from '@/store/view-status'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { PropsWithChildren, useEffect } from 'react'

const AsideBar = dynamic(() => import('@/components/AsideBar'), {
  ssr: false,
})

export default function FilesLayout(props: PropsWithChildren) {
  const { setViewStatus } = useViewStatus()
  const pathname = usePathname()
  useEffect(() => {
    const t = setTimeout(() => {
      setViewStatus({ lastPath: pathname })
    }, 1000)
    return () => clearTimeout(t)
  }, [pathname, setViewStatus])

  return (
    <>
      <section className='h-screen flex flex-col'>
        <header className='p-2 bg-dark-300 border-b border-gray-500'>
          <nav className='text-white text-center'>
            <span>json viewer</span>
          </nav>
        </header>

        <section className='flex-1 flex overflow-auto'>
          <AsideBar className='bg-dark-400' />

          <main className='flex-1 bg-dark-300 overflow-auto'>{props.children}</main>
        </section>
      </section>
    </>
  )
}
