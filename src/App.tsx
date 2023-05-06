/**
 * @name App
 * @description
 * @author darcrand
 */

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import NotFound from './pages/404'
import Home from './pages/Home'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
