import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
const Admin = React.lazy(()=>import('./Admin'))
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode>{window.location.pathname.startsWith('/admin')?<React.Suspense fallback={<p className="admin-loading">Chargement…</p>}><Admin/></React.Suspense>:<App/>}</React.StrictMode>)
