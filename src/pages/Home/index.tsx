/**
 * @name Home
 * @description
 * @author darcrand
 */

import { useItems } from '@/stores/items'
import { GithubOutlined, PlusOutlined } from '@ant-design/icons'
import { useCallback, useEffect, useState } from 'react'

import clsx from 'clsx'
import NavItem from './NavItem'
import ViewItem from './ViewItem'
import './styles.less'

const MAX_COUNT = 20

export default function Home() {
  const { ids, insert } = useItems()
  const [currId, setId] = useState<string>()

  const onInsert = useCallback(() => {
    if (ids.length > MAX_COUNT) return
    setId(insert())
  }, [ids.length, insert])

  useEffect(() => {
    setId((currId) => {
      const isInclude = currId && ids.includes(currId)
      return isInclude ? currId : ids[0]
    })
  }, [ids])

  return (
    <>
      <section className='flex flex-col h-screen'>
        <header className='flex items-center border-b p-4'>
          <h1 className='font-extrabold text-emerald-500 mr-auto'>JSON Viewer</h1>

          <a href='https://github.com/Darcrandex/json-viewer' target='_blank'>
            <GithubOutlined className='text-2xl text-gray-800' />
          </a>
        </header>

        <section className='flex-1 flex overflow-auto'>
          <aside className='w-60 flex flex-col h-full'>
            <nav
              className={clsx(
                'mx-2 mt-2 mb-4 py-1 border border-dashed rounded-md text-center transition-all',
                ids.length > MAX_COUNT
                  ? 'border-gray-700 bg-gray-100 cursor-not-allowed'
                  : 'cursor-pointer hover:border-solid border-emerald-500'
              )}
              onClick={onInsert}
            >
              <PlusOutlined className={clsx(ids.length > MAX_COUNT ? 'text-gray-700' : 'text-emerald-500')} />
            </nav>
            <section className='flex-1 overflow-auto'>
              {ids.map((id) => (
                <NavItem key={id} id={id} onSelect={setId} active={id === currId} />
              ))}
            </section>
          </aside>

          <i className='border-l' />

          <main className='flex-1'>
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
