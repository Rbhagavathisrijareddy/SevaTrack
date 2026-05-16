
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import '@mantine/core/styles.css'
document.title = 'SevaTrack | Smart Disaster Relief Management'

const metaDescription = document.createElement('meta')
metaDescription.name = 'description'
metaDescription.content = 'SevaTrack - Smart Disaster Relief Management for NGOs. Track reports, manage workers, and coordinate disaster response.'
document.head.appendChild(metaDescription)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)