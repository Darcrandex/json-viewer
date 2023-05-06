/**
 * @name Home
 * @description
 * @author darcrand
 */

import { useItems } from '@/stores/items'
import { useCallback, useState } from 'react'
import NavItem from './NavItem'
import ViewItem from './ViewItem'

export default function Home() {
  const { ids, insert } = useItems()
  const [currId, setId] = useState<string>()

  const onInsert = useCallback(() => {
    setId(insert())
  }, [insert])

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
                <NavItem key={id} id={id} onSelect={setId} active={id === currId} />
              ))}
            </ul>
          </aside>

          <i className='border-l' />

          <main className='flex-1'>
            <p>{currId}</p>
            {ids
              .filter((id) => id === currId)
              .map((id) => (
                <ViewItem key={id} id={id} />
              ))}
          </main>
        </section>
      </section>
    </>
  )
}
