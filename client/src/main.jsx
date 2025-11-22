import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom' // CHANGE TO HashRouter
import App from './App.jsx'
import { AppContextProvider } from './context/AppContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter> {/* CHANGE FROM BrowserRouter TO HashRouter */}
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </HashRouter>
  </React.StrictMode>,
)
