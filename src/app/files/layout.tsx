/**
 * @name FilesLayout
 * @description
 * @author darcrand
 */

import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dynamic from 'next/dynamic'
import { PropsWithChildren } from 'react'

const AsideBar = dynamic(() => import('@/components/AsideBar'), {
  ssr: false,
})

export default function FilesLayout(props: PropsWithChildren) {
  return (
    <>
      <section className='h-screen flex flex-col'>
        <header className='p-2 bg-dark-500'>
          <nav className='text-white'>
            <b className='font-bold'>{`{:}`}</b>
            <span>JSON Viewer</span>
            <FontAwesomeIcon icon={faGithub} className='text-base' />
          </nav>
        </header>

        <section className='flex-1 flex overflow-auto'>
          <AsideBar className='bg-gray-700' />

          <main className='flex-1 bg-gray-600 overflow-auto'>{props.children}</main>
        </section>
      </section>
    </>
  )
}
