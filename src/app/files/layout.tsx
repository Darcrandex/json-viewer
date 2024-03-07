/**
 * @name FilesLayout
 * @description
 * @author darcrand
 */

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { PropsWithChildren } from 'react'

const AsideBar = dynamic(() => import('@/components/AsideBar'), {
  ssr: false,
})

export default function FilesLayout(props: PropsWithChildren) {
  return (
    <>
      <section className='h-screen flex flex-col'>
        <header className='p-2'>
          <nav>
            <Link href='/files'>Files</Link>
          </nav>
        </header>

        <section className='flex-1 flex'>
          <AsideBar />

          <main className='flex-1' style={{ backgroundColor: 'rgb(30,30,30)' }}>
            {props.children}
          </main>
        </section>
      </section>
    </>
  )
}
