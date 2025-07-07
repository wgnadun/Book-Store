import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';

function App() {
  const location = useLocation();

  // Paths where Navbar and Footer should be hidden
  const hideHeaderFooterRoutes = ['/login', '/register'];

  // Check if current path starts with any of the hide routes
  const shouldHideHeaderFooter = hideHeaderFooterRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <AuthProvider>
      {!shouldHideHeaderFooter && <Navbar />}

      <main>
        <Outlet />
      </main>

      {!shouldHideHeaderFooter && <Footer />}
    </AuthProvider>
  );
}

export default App;
