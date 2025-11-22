import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { AppContextProvider } from './context/AppContext.jsx' // ADD THIS
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AppContextProvider> {/* WRAP YOUR APP WITH CONTEXT PROVIDER */}
        <App />
      </AppContextProvider>
    </HashRouter>
  </React.StrictMode>,
)
