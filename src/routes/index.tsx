import CodeEdit from '@/pages/CodeEdit'
import RootLayout from '@/pages/RootLayout'
import { RouteObject } from 'react-router-dom'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [{ path: '/:id', element: <CodeEdit /> }],
  },
]
