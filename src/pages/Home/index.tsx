/**
 * @name Home
 * @description
 * @author darcrand
 */

import { useItems } from '@/stores/items'
import { useCallback } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import NavItem from './NavItem'

export default function Home() {
  const navigate = useNavigate()
  const { ids, insert } = useItems()

  const onInsert = useCallback(() => {
    const id = insert()
    navigate(`/item/${id}`)
  }, [insert, navigate])

  return (
    <>
      <section className='flex flex-col h-screen'>
        <header className='border-b'>
          <h1>JSON Viewer</h1>
        </header>

        <section className='flex-1 flex'>
          <aside className='w-60'>
            <ul>
              <li className='m-4 border border-emerald-400 rounded-md' onClick={onInsert}>
                +
              </li>
              {ids.map((id) => (
                <NavItem key={id} id={id} />
              ))}
            </ul>
          </aside>

          <i className='border-l' />

          <main className='flex-1'>
            <Outlet />
          </main>
        </section>
      </section>
    </>
  )
}
