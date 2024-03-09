/**
 * @name FilesLayout
 * @description
 * @author darcrand
 */

import dynamic from 'next/dynamic'
import { PropsWithChildren } from 'react'

const AsideBar = dynamic(() => import('@/components/AsideBar'), {
  ssr: false,
})

export default function FilesLayout(props: PropsWithChildren) {
  return (
    <>
      <section className='h-screen flex flex-col'>
        <header className='p-2 bg-gray-800'>
          <nav className='text-white'>
            <b className='font-bold'>{`{:}`}</b>
            <span>JSON Viewer</span>
          </nav>
        </header>

        <section className='flex-1 flex'>
          <AsideBar className='bg-gray-700' />

          <main className='flex-1 bg-gray-600'>{props.children}</main>
        </section>
      </section>
    </>
  )
}
