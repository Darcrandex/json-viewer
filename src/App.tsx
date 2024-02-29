/**
 * @name App
 * @description
 * @author darcrand
 */

import { Suspense } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { routes } from './routes'

const router = createBrowserRouter(routes)

export default function App() {
  return (
    <>
      <Suspense fallback={<p>loading...</p>}>
        <RouterProvider router={router} />
        <ToastContainer />
      </Suspense>
    </>
  )
}
