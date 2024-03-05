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
      <section className='flex h-screen'>
        <AsideBar />

        <main className='flex-1'>{props.children}</main>
      </section>
    </>
  )
}
