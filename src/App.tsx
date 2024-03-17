/**
 * @name App
 * @description
 * @author darcrand
 */

import { Suspense } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import CodeView from './pages/CodeView'
import Hello from './pages/Hello'
import Root from './pages/Root'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Hello /> },
      { path: '/:id', element: <CodeView /> },
    ],
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
