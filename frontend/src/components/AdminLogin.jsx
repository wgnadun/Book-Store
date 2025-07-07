import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import getBaseUrl from '../utils/baseURL';

const AdminLogin = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit, 
    formState: { errors } ,
  } = useForm();

  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true);
    console.log(data)
    try {
      const response = await axios.post(`${getBaseUrl()}/api/auth/admin`,data,{
        headers :{
          'Content-Type' : 'application/json',
        }
      });
        
      const auth = response.data;  
      console.log(auth)
      if(auth.token){
        localStorage.setItem('token',auth.token);
        setTimeout(()=>{
          localStorage.removeItem('token')
          alert('Token has been expired,Please login again.')
          navigate('/')
        },3600 * 1000)
      }

      // Add subtle success transition
      const loginElement = document.getElementById('login-container');
      if (loginElement) {
        loginElement.classList.add('opacity-95');
        setTimeout(() => {
          alert("Admin Login successful!")
          navigate("/dashboard/manage-book")
        }, 200);
      } else {
        alert("Admin Login successful!")
        navigate("/dashboard/manage-book")
      }
    } catch (error) {
      setMessage("Invalid username or password")
      console.error(error)
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      {/* Static subtle gradient elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-indigo-900 opacity-5 blur-3xl"></div>
        <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-indigo-900 opacity-5 blur-3xl"></div>
        <div className="absolute bottom-10 left-1/4 w-72 h-72 rounded-full bg-indigo-800 opacity-5 blur-3xl"></div>
      </div>
      
      <div 
        id="login-container"
        className="w-full max-w-md mx-auto bg-gradient-to-b from-gray-800 via-gray-850 to-gray-900 shadow-2xl rounded-lg px-8 pt-6 pb-8 mb-4 transition-all duration-300 backdrop-blur-sm border border-gray-700 relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8 relative">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 rounded-full flex items-center justify-center shadow-lg mb-5 p-1 border border-gray-600">
            <div className="bg-gray-900 rounded-full w-full h-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-1 text-gray-200">Admin Portal</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full mb-3"></div>
          <p className="text-gray-400 text-sm">Enter your credentials to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="username">
              Username
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-500 group-hover:text-indigo-400 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                {...register("username", { required: true })}
                type="text" 
                name="username" 
                id="username" 
                placeholder="@Admin"
                className="bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-3 rounded-lg text-gray-200 placeholder-gray-500 transition-all duration-200"
              />
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-gray-500 to-gray-600 transition-all duration-300 group-hover:w-full"></div>
            </div>
            {errors.username && <p className="mt-1 text-yellow-400/60 text-xs">Username is required</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-500 group-hover:text-indigo-400 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                {...register("password", { required: true })}
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Password"
                className="bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 py-3 rounded-lg text-gray-200 placeholder-gray-500 transition-all duration-200"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-indigo-400 focus:outline-none transition-colors duration-200"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-gray-500 to-gray-600 transition-all duration-300 group-hover:w-full"></div>
            </div>
            {errors.password && <p className="mt-1 text-yellow-400/60 text-xs">Password is required</p>}
          </div>

          {/* Error Message */}
          {message && (
            <div className="p-4 bg-gradient-to-r from-red-900/40 to-red-800/40 border border-red-700 rounded-lg text-center backdrop-blur-sm">
              <p className="text-red-400 text-sm flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {message}
              </p>
            </div>
          )}

          {/* Login Button */}
          <div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-medium py-3 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-900"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Sign In
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-center text-gray-500 text-xs">© 2025 Book Store. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin