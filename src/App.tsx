/**
 * @name App
 * @description
 * @author darcrand
 */

import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CodeView from './pages/CodeView'
import Root from './pages/Root'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [{ path: '/:id', element: <CodeView /> }],
  },
])

export default function App() {
  return (
    <>
      <Suspense fallback='loading...'>
        <RouterProvider router={router} />
      </Suspense>
    </>
  )
}
