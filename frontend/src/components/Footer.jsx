import React, { useState, useEffect } from 'react'
import footerLogo from "../assets/footer-logo.png"
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa'
import { FiSend, FiArrowRight } from 'react-icons/fi'
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [isVisible, setIsVisible] = useState(false)
  
  // Animation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById('footer')
      if (footer) {
        const position = footer.getBoundingClientRect()
        if (position.top < window.innerHeight) {
          setIsVisible(true)
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check on initial load
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  return (
    <footer id="footer" className="relative">      
      {/* Main Footer Content - dark theme matching login */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16 pb-10 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Section */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Company Info */}
            <div className="col-span-1 lg:col-span-1">
              <img src={footerLogo} alt="Logo" className="mb-6 w-40 hover:scale-105 transition-all duration-300" />
              <p className="text-gray-300 mb-6">Discover a world of knowledge through our carefully curated collection of books. Your journey to wisdom begins here.</p>
              <div className="flex space-x-4">
                {[
                  { icon: FaFacebook, href: "https://facebook.com", hoverColor: "hover:bg-blue-600", label: "Facebook" },
                  { icon: FaTwitter, href: "https://twitter.com", hoverColor: "hover:bg-sky-500", label: "Twitter" },
                  { icon: FaInstagram, href: "https://instagram.com", hoverClass: "hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-pink-600 hover:to-purple-700", label: "Instagram" },
                  { icon: FaLinkedin, href: "https://linkedin.com", hoverColor: "hover:bg-blue-700", label: "LinkedIn" },
                  { icon: FaYoutube, href: "https://youtube.com", hoverColor: "hover:bg-red-600", label: "YouTube" }
                ].map((social, index) => (
                  <a 
                    key={social.label}
                    href={social.href} 
                    aria-label={social.label}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`group bg-white/5 backdrop-blur-sm p-2.5 rounded-full ${social.hoverColor || social.hoverClass} hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <social.icon size={18} className="text-white" />
                    <span className="sr-only">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="col-span-1">
              <h3 className="text-lg font-bold text-white mb-6 relative">
                Quick Links
                <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-indigo-500 to-indigo-400"></span>
              </h3>
              <ul className="space-y-3">
                {['Home', 'Books', 'About Us', 'Contact', 'Blog', 'FAQ'].map((link, index) => (
                  <li key={link} className="group" style={{ transitionDelay: `${index * 50}ms` }}>
                    <a 
                      href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} 
                      className="text-gray-300 flex items-center hover:text-white transition-colors duration-300 group"
                    >
                      <span className="relative mr-2 flex h-5 w-5 items-center justify-center">
                        <span className="absolute h-4 w-4 rounded-full bg-indigo-500/20 group-hover:scale-150 group-hover:bg-indigo-500/30 transition-all duration-300"></span>
                        <FiArrowRight className="relative text-indigo-400 z-10 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact Info */}
            <div className="col-span-1">
              <h3 className="text-lg font-bold text-white mb-6 relative">
                Contact Us
                <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-indigo-500 to-indigo-400"></span>
              </h3>
              <ul className="space-y-4">
                {[
                  { icon: FaMapMarkerAlt, text: "123 BookLover Ave, Reading District, New York, 10001" },
                  { icon: FaPhone, text: "+1 (555) 123-4567" },
                  { icon: FaEnvelope, text: "info@bookstore.com" }
                ].map((item, index) => (
                  <li key={index} className="flex items-start group hover:translate-x-1 transition-transform duration-300">
                    <div className="bg-white/5 backdrop-blur-sm p-2 rounded-lg mr-3 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-indigo-500 transition-colors duration-300">
                      <item.icon className="text-indigo-400 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="text-gray-300 mt-1">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Newsletter */}
            <div className="col-span-1 lg:col-span-1">
              <h3 className="text-lg font-bold text-white mb-6 relative">
                Newsletter
                <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-indigo-500 to-indigo-400"></span>
              </h3>
              <p className="text-gray-300 mb-4">Subscribe to receive updates on new arrivals and special offers</p>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-gray-800/70 backdrop-blur-sm text-white placeholder-gray-400 px-5 py-3.5 pr-14 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500 transition-all duration-300"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 p-2 rounded-full text-white transform group-hover:scale-110 transition-all duration-300 shadow-lg shadow-indigo-500/50">
                  <FiSend size={18} className="group-hover:animate-pulse" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Middle Section - Categories */}
          <div className={`border-t border-white/10 py-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              <h4 className="text-white font-bold mr-4">Popular Categories:</h4>
              {['Fiction', 'Science', 'Biography', 'Self-Help', 'Business', 'History', 'Children', 'Art & Design'].map((category, index) => (
                <a 
                  key={category} 
                  href={`#${category.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-indigo-400 hover:to-indigo-300 transition-all duration-300"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {category}
                </a>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className={`border-t border-white/10 pt-8 mt-4 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-gray-400">
              <p>&copy; {currentYear} ReaDMore. All rights reserved.</p>
              
              {/* Payment Methods with Icons */}
              <div className="flex items-center gap-5">
                <span className="text-sm mr-2">We Accept:</span>
                <div className="flex space-x-5">
                  <div className=" backdrop-blur-sm h-8 w-12 rounded-md flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300">
                    <FaCcVisa className="text-white text-xl" />
                  </div>
                  <div className=" backdrop-blur-sm h-8 w-12 rounded-md flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300">
                    <FaCcMastercard className="text-white text-xl" />
                  </div>
                  <div className="backdrop-blur-sm h-8 w-12 rounded-md flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300">
                    <FaCcAmex className="text-white text-xl" />
                  </div>
                  <div className=" backdrop-blur-sm h-8 w-12 rounded-md flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300">
                    <FaCcPaypal className="text-white text-xl" />
                  </div>
                </div>
              </div>
              
              {/* Privacy Links */}
              <ul className="flex gap-6 text-sm">
                {['Privacy Policy', 'Terms of Service'].map(item => (
                  <li key={item}>
                    <a 
                      href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                      className="relative group hover:text-white transition-colors duration-300"
                    >
                      <span className="relative z-10">{item}</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-indigo-400 group-hover:w-full transition-all duration-300"></span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modern Rectangular Bottom */}
      {/* <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-2">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-gray-500">
          <p>Designed with <span className="text-indigo-500">♥</span> for book lovers everywhere</p>
        </div>
      </div> */}
    </footer>
  )
}

export default Footer