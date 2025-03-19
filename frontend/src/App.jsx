
import { Outlet } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <>
    <nav>Navbar</nav>         {/* Navbar and footer will not change ,it will static in always,only outlet element (routers) will dyanamic(render)*/}
      
      <main className='min-h-screen max-w-screen-2x1 mx-auto px-4 py-6 font-primary'>
          <Outlet />  
      </main>
    <footer>Footer</footer>     {/* Outlet will render all the  child routes in router.jsx*/}
    </>
  )
}

export default App
