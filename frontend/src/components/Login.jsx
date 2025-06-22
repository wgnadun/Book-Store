import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { useAuth } from '../context/AuthContext';
import loginImg from '../assets/login.jpg';

const Login = () => {
  const [message, setMessage] = useState("");
  const { loginUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [fallingElements, setFallingElements] = useState([]);
 
  const {
    register,
    handleSubmit, 
    formState: { errors },
  } = useForm();

  // Generate falling elements on component mount
  useEffect(() => {
    const elements = [];
    const types = ['page', 'book', 'bookmark'];
    
    // Responsive element count based on screen size
    const elementCount = window.innerWidth < 768 ? 15 : 30;
    
    for (let i = 0; i < elementCount; i++) {
      elements.push({
        id: i,
        type: types[Math.floor(Math.random() * types.length)],
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 10}s`,
        duration: `${7 + Math.random() * 15}s`,
        size: window.innerWidth < 768 ? `${Math.max(6, Math.random() * 18)}px` : `${Math.max(8, Math.random() * 24)}px`,
        rotation: `${Math.random() * 360}deg`,
        horizontalMovement: Math.random() > 0.5 ? 
          `translateX(${Math.random() * 20 - 10}px)` : 'none'
      });
    }
    
    setFallingElements(elements);
  }, []);

  const onSubmit = async (data) => {
    try {
      await loginUser(data.email, data.password);
      alert("Login successful!")
      navigate("/")
    } catch (error) {
      setMessage("Invalid email or password")
      console.log(error)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      alert("Login successful!");
      navigate("/")
    } catch (error) {
      setMessage("Sign in failed!")
      console.log(error)
    }
  }

  // SVG elements for falling animations
  const renderFallingElement = (element) => {
    switch (element.type) {
      case 'page':
        return (
          <svg width={element.size} height={element.size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="white" strokeOpacity="0.4" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'book':
        return (
          <svg width={element.size} height={element.size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="white" strokeOpacity="0.3" strokeWidth="1"/>
          </svg>
        );
      case 'bookmark':
        return (
          <svg width={element.size} height={element.size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" stroke="white" strokeOpacity="0.35" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Left side with image and brand text - now on top on mobile */}
      <div className="w-full lg:w-1/2 bg-white relative z-10 overflow-hidden group order-1 h-[30vh] sm:h-[35vh] md:h-[40vh] lg:min-h-screen flex-shrink-0">
        {/* Image container with hover effect */}
        <div className="w-full h-full flex items-center justify-center relative">
          <img 
            src={loginImg} 
            alt="BookMart" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-100 scale-110 brightness-110 group-hover:brightness-100"
          />
          
          {/* ReadMore text in top left corner with responsive sizing */}
          <div className="absolute top-3 sm:top-4 lg:top-6 left-3 sm:left-4 lg:left-6 z-20 animate-float">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-blue-950 tracking-wider lg:tracking-widest drop-shadow-lg font-sans">
              Read<span className="text-white">More</span>
            </h1>
          </div>
          
          {/* Curved footer with hover effect - responsive */}
          <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 lg:h-40 bg-gradient-to-t from-black/70 to-transparent transition-all duration-500 
                          group-hover:h-32 sm:group-hover:h-48 lg:group-hover:h-64 group-hover:from-black/80 group-hover:backdrop-blur-sm overflow-visible
                          before:content-[''] before:absolute before:left-0 before:right-0 before:top-0 before:h-px 
                          before:bg-white/70 before:transition-opacity before:duration-300 group-hover:before:opacity-0">

            {/* "LOG TO EXPLORE" text visible before hover - responsive */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 
                         transition-opacity duration-500 group-hover:opacity-0 opacity-100">
              <h2 className="text-sm sm:text-lg lg:text-2xl font-semibold text-white/80 tracking-wider drop-shadow-xl font-sans text-center">
                LOG TO EXPLORE
              </h2>
            </div>
            
            {/* Book icon positioned at the center top - responsive */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <button 
                className="rounded-full p-2 sm:p-3 lg:p-4 border-2 border-white shadow-lg transition-all duration-300 
                          hover:scale-110 focus:outline-none active:scale-95
                          bg-gray-900 hover:bg-gray-950"
                aria-label="Book icon"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </button>
            </div>
            
            {/* Welcome text content - responsive, hidden on very small screens */}
            <div className="hidden sm:block absolute top-8 sm:top-12 lg:top-16 left-0 right-0 opacity-0 transition-all duration-500 transform translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 px-4 sm:px-6 lg:px-10 text-center">
              <h2 className="text-lg sm:text-2xl lg:text-4xl font-bold text-white mb-2 lg:mb-4">Welcome to the ReadMore</h2>
              <p className="font-sans font-extralight text-gray-200 leading-tight text-xs sm:text-sm lg:text-base hidden lg:block">
                ReadMore is a cozy and modern online bookstore where readers can discover, explore, and purchase a wide range of books from bestsellers to hidden gems. Whether you're into fiction, non-fiction, academic texts, or children's stories, ReadMore offers something for every kind of reader. With a clean interface and easy checkout, finding your next favorite book is just a click away.
              </p>
              <p className="font-sans font-extralight text-gray-200 leading-tight text-xs sm:text-sm block lg:hidden">
                Discover, explore, and purchase your favorite books with ease. From bestsellers to hidden gems, we have something for every reader.
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-blue-300 mt-2 sm:mt-3 lg:mt-5">
                Sign in to explore and buy your favorite books!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side with form - now stacks below on mobile */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-gray-800 to-gray-900 flex justify-center items-center p-4 sm:p-6 lg:p-8 z-10 relative order-2 flex-1 min-h-0">
        {/* Falling elements container */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {fallingElements.map(element => (
            <div 
              key={element.id}
              className="absolute opacity-40"
              style={{
                left: element.left,
                top: '-20px',
                transform: `rotate(${element.rotation})`,
                animation: `fall-${element.id} ${element.duration} linear ${element.delay} infinite`
              }}
            >
              {renderFallingElement(element)}
            </div>
          ))}
        </div>

        <style jsx>{`
          @keyframes fall {
            0% {
              transform: translateY(-20px) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 0.6;
            }
            90% {
              opacity: 0.4;
            }
            100% {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }

          ${fallingElements.map(element => `
            @keyframes fall-${element.id} {
              0% {
                transform: translateY(-20px) rotate(0deg);
                opacity: 0;
              }
              10% {
                opacity: 0.6;
                transform: translateY(10vh) rotate(${Math.random() * 60}deg) ${element.horizontalMovement};
              }
              30% {
                transform: translateY(30vh) rotate(${Math.random() * 120}deg) ${element.horizontalMovement};
              }
              60% {
                transform: translateY(60vh) rotate(${Math.random() * 240}deg) ${element.horizontalMovement};
                opacity: 0.5;
              }
              90% {
                opacity: 0.3;
              }
              100% {
                transform: translateY(100vh) rotate(${180 + Math.random() * 180}deg);
                opacity: 0;
              }
            }
          `).join('')}
        `}</style>

        <div className="w-full max-w-md p-3 sm:p-4 lg:p-8 space-y-3 sm:space-y-4 lg:space-y-6 bg-gradient-to-br from-gray-900/90 to-gray-950/90 rounded-xl shadow-xl border border-gray-800/50 backdrop-blur-sm 
                        animate-fadeSlideIn transition-all duration-300 hover:shadow-blue-950/20 hover:shadow-lg relative my-4">
          {/* Small decorative book icons - hidden on small screens */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10 hidden sm:block">
            <svg className="absolute top-4 left-4" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 19.5V4.5C4 3.4 4.4 2.5 5.2 1.7C6 0.9 6.9 0.5 8 0.5H19V19.5H8C6.9 19.5 6 19.9 5.2 20.7C4.4 21.5 4 22.4 4 23.5M8 23.5C6.9 23.5 6 23.1 5.2 22.3C4.4 21.5 4 20.6 4 19.5C4 18.4 4.4 17.5 5.2 16.7C6 15.9 6.9 15.5 8 15.5H19V23.5H8Z" stroke="white" strokeWidth="1"/>
            </svg>
            <svg className="absolute bottom-8 right-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 19.5V4.5C4 3.4 4.4 2.5 5.2 1.7C6 0.9 6.9 0.5 8 0.5H19V19.5H8C6.9 19.5 6 19.9 5.2 20.7C4.4 21.5 4 22.4 4 23.5M8 23.5C6.9 23.5 6 23.1 5.2 22.3C4.4 21.5 4 20.6 4 19.5C4 18.4 4.4 17.5 5.2 16.7C6 15.9 6.9 15.5 8 15.5H19V23.5H8Z" stroke="white" strokeWidth="1"/>
            </svg>
            <svg className="absolute top-1/2 left-1/3" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="white" strokeWidth="1"/>
            </svg>
          </div>

          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Login</h2>
            <p className="text-gray-300 text-sm">Please sign in to continue</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 lg:space-y-6">
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <input
                  {...register("email", { required: true })}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="you@example.com"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/70 border border-gray-700 rounded-lg 
                            focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 
                            transition-all duration-200 text-white placeholder-gray-500 backdrop-blur-sm text-sm sm:text-base"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">Email is required</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-200 text-sm font-medium" htmlFor="password">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  {...register("password", { required: true })}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/70 border border-gray-700 rounded-lg 
                            focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 
                            transition-all duration-200 text-white placeholder-gray-500 backdrop-blur-sm text-sm sm:text-base"
                />
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">Password is required</p>
              )}
            </div>

            {message && (
              <div className="text-red-400 text-sm py-2">{message}</div>
            )}

            <div>
              <button
                type="submit"
                className="w-full px-4 py-2.5 sm:py-3 text-white font-medium rounded-lg 
                  bg-blue-700 hover:bg-blue-600
                  transform transition-all duration-200 hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  relative overflow-hidden group text-sm sm:text-base"
              >
                <span className="relative z-10">Sign in</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/30 to-blue-600/0 
                              -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center space-x-2">
            <div className="flex-1 h-px bg-gray-800"></div>
            <div className="text-gray-400 font-medium text-sm">OR</div>
            <div className="flex-1 h-px bg-gray-800"></div>
          </div>

          <div>
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center px-4 py-2.5 sm:py-3 border border-gray-700 rounded-lg
                bg-gray-800 hover:bg-gray-700 
                transform transition-all duration-200 hover:shadow-sm
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 text-gray-200
                relative overflow-hidden group text-sm sm:text-base"
            >
              <div className="relative z-10 flex items-center">
                <FcGoogle className="text-lg sm:text-xl mr-2" />
                <span className="font-medium">Continue with Google</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-700/0 via-gray-700/20 to-gray-700/0 
                            -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-300 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 font-medium hover:text-blue-300 transition-colors duration-200
                                            relative">
                Create account
              </Link>
            </p>
          </div>

          <div className="text-center mt-3 sm:mt-4 lg:mt-6">
            <p className="text-gray-500 text-xs">
              &copy; 2025 ReadMore. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;