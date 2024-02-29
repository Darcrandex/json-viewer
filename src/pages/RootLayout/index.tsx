/**
 * @name RootLayout
 * @description
 * @author darcrand
 */

import { Outlet } from 'react-router-dom'

export default function RootLayout() {
  return (
    <>
      <section className='flex h-screen'>
        <aside>
          <nav>menus</nav>
        </aside>

        <section className='flex-1 flex flex-col'>
          <header>
            <p>hhhh</p>
          </header>

          <main className='flex-1'>
            <Outlet />
          </main>
        </section>
      </section>
    </>
  )
}
