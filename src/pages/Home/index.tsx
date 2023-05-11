/**
 * @name Home
 * @description
 * @author darcrand
 */

import { useItems } from '@/stores/items'
import { FileAddOutlined, GithubOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useCallback, useEffect, useState } from 'react'

import NavItem from './NavItem'
import ViewItem from './ViewItem'

const MAX_COUNT = 20
const PROJECT_URL = 'https://github.com/Darcrandex/json-viewer'

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
      <section className='flex flex-col h-screen bg-gray-800'>
        <header className='flex items-center p-2'>
          <span className='w-40'></span>
          <h1 className='flex-1 text-center text-blue-400 font-bold'>JSON Viewer</h1>
          <span className='w-40 text-right'>
            <Button
              type='link'
              href={PROJECT_URL}
              target='_blank'
              icon={<GithubOutlined className='text-white text-lg' />}
            />
          </span>
        </header>

        <section className='flex-1 flex overflow-auto'>
          <aside className='w-60 flex flex-col h-full'>
            <section className='flex items-center justify-between px-2 bg-gray-700 text-white'>
              <span className='font-bold py-1'>FILES</span>
              <Button
                size='small'
                type='text'
                icon={<FileAddOutlined className='text-white/50 hover:text-white' />}
                onClick={onInsert}
              />
            </section>

            <section className='flex-1 overflow-auto'>
              {ids.map((id) => (
                <NavItem key={id} id={id} onSelect={setId} active={id === currId} />
              ))}
            </section>
          </aside>

          <main className='flex-1 flex flex-col bg-gray-700 border-l border-gray-600'>
            {ids
              .filter((id) => id === currId)
              .map((id) => (
                <ViewItem key={id} id={id} />
              ))}

            {ids.length === 0 && (
              <div className='flex-1 flex items-center justify-center'>
                <span className='text-white text-lg mr-2'>Nothing here</span>
                <Button type='primary' onClick={onInsert}>
                  Create A New One
                </Button>
              </div>
            )}
          </main>
        </section>
      </section>
    </>
  )
}
