import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './tailwind.css'
import { RouterProvider } from 'react-router-dom'
import router from './routers/router.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/> 
  
   </StrictMode>,
)
