import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './tailwind.css'
import { RouterProvider } from 'react-router-dom'
import router from './routers/router.jsx'
import 'sweetalert2/dist/sweetalert2.js'

import { Provider } from 'react-redux'
import { store } from './redux/store.js'

createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <RouterProvider router={router}/> 
   </Provider>,
)
