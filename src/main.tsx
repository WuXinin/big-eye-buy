import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import "./style/index.css"
import "./style/fonts.css"
import { ApiContextWrapper } from './context/ApiContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <ApiContextWrapper>
        <App />
    </ApiContextWrapper>
)
