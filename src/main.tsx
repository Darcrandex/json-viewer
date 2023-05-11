import { StyleProvider } from '@ant-design/cssinjs'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <StyleProvider hashPriority='high'>
      <App />
    </StyleProvider>
  </>
)
