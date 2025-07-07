import { Link, Outlet, useNavigate } from 'react-router-dom';
import { HiViewGridAdd } from "react-icons/hi";
import { MdOutlineManageHistory } from "react-icons/md";
import { useState, useEffect } from 'react';
import image from "../../assets/fav.png"

const AdminPortalLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(window.location.pathname);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, [window.location.pathname]);

  const logout = async() => {
    localStorage.removeItem('token');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!isProfileMenuOpen);
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-menu-container')) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen]);

  return (
    <section className="flex bg-black min-h-screen overflow-hidden font-sans">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-20 md:hidden backdrop-blur-sm transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-30 w-72 transform transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } flex flex-col bg-gradient-to-br  border-gray-800 bg-gray-900 text-white shadow-2xl`}
      >
        {/* Brand Logo */}
        <div className="flex items-center justify-center h-20 bg-gradient-to-r from-black to-gray-900 border-b border-red-900/20">
          <Link to="/dashboard/manage-book" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-red-950 flex items-center justify-center shadow-lg transform transition-all duration-400 group-hover:scale-105">
              <img src={image} alt="Logo" className="w-8 h-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">Admin Portal</span>
              <span className="text-xs text-gray-300">BookStore Management</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-grow py-8 px-4 space-y-2">
         

          <Link 
            to="/dashboard/add-new-book" 
            className={`flex items-center px-4 py-3 rounded-xl transition-all duration-400 ease-in-out group ${
              activeLink === '/dashboard/add-new-book' 
                ? 'bg-gradient-to-r from-gray-800 text-yellow-300 shadow-md transform scale-102 border border-red-900/30' 
                : 'text-white hover:bg-gray-800/40 hover:border-l-2 hover:border-yellow-500/70'
            }`}
            onClick={() => setActiveLink('/dashboard/add-new-book')}
          >
            <HiViewGridAdd className={`h-5 w-5 mr-3 transition-all duration-300 ${
              activeLink === '/dashboard/add-new-book' ? 'text-yellow-300' : 'text-gray-300 group-hover:text-yellow-300 group-hover:scale-110'
            }`} />
            <span className="font-medium">Add Book</span>
          </Link>

          <Link 
            to="/dashboard/manage-book" 
            className={`flex items-center px-4 py-3 rounded-xl transition-all duration-400 ease-in-out group ${
              activeLink === '/dashboard/manage-book' 
                ? 'bg-gradient-to-r from-gray-800 text-yellow-300 shadow-md transform scale-102 border border-red-900/30' 
                : 'text-white hover:bg-gray-800/40 hover:border-l-2 hover:border-yellow-500/70'
            }`}
            onClick={() => setActiveLink('/dashboard/manage-book')}
          >
            <MdOutlineManageHistory className={`h-5 w-5 mr-3 transition-all duration-300 ${
              activeLink === '/dashboard/manage-book' ? 'text-yellow-300' : 'text-gray-300 group-hover:text-yellow-300 group-hover:scale-110'
            }`} />
            <span className="font-medium">Manage Books</span>
          </Link>

          <div className="pt-8 px-4">
            <div className="border-t border-red-900/50 pt-6">
              <button 
                className="flex items-center px-4 py-3 w-full rounded-xl transition-all duration-400 ease-in-out text-white hover:bg-gray-800/30 hover:border hover:border-red-800/30 group"
                onClick={handleLogout}
              >
                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" 
                  className="h-5 w-5 mr-3 text-red-400 group-hover:scale-110 group-hover:text-red-300 transition-all duration-300">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                  />
                </svg>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Admin Help */}
        <div className="p-4 mb-6">
          <div className="bg-gradient-to-r from-black to-gray-900/90 rounded-xl p-4 border border-red-900/10 backdrop-blur-sm">
            <h4 className="text-sm font-semibold text-yellow-300 mb-2">Need Help?</h4>
            <p className="text-xs text-gray-300 mb-3">Contact our support team for assistance with the admin portal.</p>
            <button className="text-xs bg-gray-800 hover:bg-gray-700 text-white py-2 px-3 rounded-lg transition-all duration-400 w-full transform hover:scale-102 hover:shadow hover:shadow-red-900/30">
              Contact Support
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center h-16 px-6 bg-gradient-to-r from-black to-gray-900 shadow-md z-10 border-b border-red-900/20">
          <button 
            className="md:hidden relative p-2 mr-3 text-gray-300 rounded-full hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-700 transition-all duration-300"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
             
          
          <div className="flex-1"></div>
          
          <div className="flex items-center space-x-4">

            <div className="relative profile-menu-container ">
              <button 
                className="flex items-center space-x-3 focus:outline-none group"
                onClick={toggleProfileMenu}
              >
              

              </button>
              
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-gray-900 rounded-lg shadow-xl py-2 z-50 border border-gray-700/50 transition-all duration-200">
                  <div className="px-4 py-3 border-b border-gray-700/30">
                    <p className="text-sm font-semibold text-yellow-300">Admin User</p>
                    <p className="text-xs text-gray-400">Admin.User@example.com</p>
                  </div>
                  <a href="#" className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/40 hover:text-yellow-300 transition-all duration-300">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Your Profile
                    </div>
                  </a>
                  <a href="#" className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/40 hover:text-yellow-300 transition-all duration-300">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </div>
                  </a>
                  <div className="border-t border-gray-700/30 my-1"></div>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-800/40 hover:text-red-300 transition-all duration-300">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-red-900/20 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-yellow-300">Admin Portal</h1>
                <p className="mt-1 text-sm text-gray-400">Book Store Inventory Management</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                <Link
                  to="/dashboard/manage-book"
                  className="inline-flex items-center justify-center px-4 py-2.5 bg-gray-800 text-white border border-gray-700 rounded-lg shadow hover:bg-gray-700 hover:text-yellow-300 hover:border-yellow-500/30 transition-all duration-400 transform hover:-translate-y-0.5"
                >
                  <svg
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="flex-shrink-0 h-5 w-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Manage Books
                </Link>

                <Link
                  to="/dashboard/add-new-book"
                  className="inline-flex items-center justify-center px-4 py-2.5 bg-gray-900 text-yellow-300 border border-gray-700 rounded-lg shadow hover:bg-gray-800 hover:text-white hover:border-yellow-500/30 transition-all duration-400 transform hover:-translate-y-0.5"
                >
                  <svg
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="flex-shrink-0 h-5 w-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add New Book
                </Link>
              </div>
            </div>
            
            {/* Content Area */}
            <div className="bg-gradient-to-br from-gray-900  rounded-xl shadow p-6 border border-gray-800/30 transition-all duration-400 hover:shadow hover:shadow-gray-900/20">
              <Outlet />
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                © 2025 BookStore Admin Portal. All rights reserved.
              </p>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default AdminPortalLayout;