/**
 * @name AsideBar
 * @description
 * @author darcrand
 */

'use client'

import Link from 'next/link'

export default function AsideBar() {
  return (
    <>
      <aside className='w-64 border-r'>
        <ul className='space-y-2'>
          <li>
            <Link href='/123'>123</Link>
          </li>
          <li>
            <Link href='/456'>456</Link>
          </li>
        </ul>
      </aside>
    </>
  )
}
