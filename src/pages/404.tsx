/**
 * @name NotFound
 * @description
 * @author darcrand
 */

import { NavLink } from 'react-router-dom'

export default function NotFound() {
  return (
    <>
      <h1>404</h1>
      <NavLink to='/'>Back to home.</NavLink>
    </>
  )
}
