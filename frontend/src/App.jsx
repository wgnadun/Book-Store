
import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import {  AuthProvider } from './context/AuthContext'
function App() {

  return (
    <>
    <AuthProvider>      {/* {wrap the childrens from Authprovider } */}

        <Navbar/>        {/* Navbar and footer will not change ,it will static in always,only outlet element (routers) will dyanamic(render)*/}
        
        <main className='min-h-screen max-w-screen-2x1 mx-auto px-4 py-6 font-primary'>
            <Outlet />  
        </main>
      <Footer/>    {/* Outlet will render all the  child routes in router.jsx*/}
    </AuthProvider>
    </>
  )
}

export default App
