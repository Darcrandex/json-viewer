/**
 * @name App
 * @description
 * @author darcrand
 */

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import NotFound from './pages/404'
import Home from './pages/Home'
import Item from './pages/Item'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: 'item/:id',
        element: <Item />,
      },
    ],
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
