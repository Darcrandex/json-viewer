/**
 * @name Root
 * @description
 * @author darcrand
 */

import { NavLink, Outlet } from 'react-router-dom'

export default function Root() {
  return (
    <>
      <section className='flex flex-col h-screen overflow-auto'>
        <header className='p-4 border-b'>hhh</header>

        <section className='flex-1 flex'>
          <aside className='w-64 shrink-0'>
            <nav className='space-y-4 p-2'>
              <NavLink to='/'>Home</NavLink>
              <NavLink to='/123'>123</NavLink>
              <NavLink to='/abc'>abc</NavLink>
              <NavLink to='/xyz'>xyz</NavLink>
            </nav>
          </aside>

          <main className='flex-1 overflow-auto'>
            <Outlet />
          </main>
        </section>
      </section>
    </>
  )
}
