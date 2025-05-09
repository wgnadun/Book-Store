import {  Link, useNavigate } from "react-router-dom";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { IoIosSearch } from "react-icons/io";
import { LuCircleUserRound } from "react-icons/lu";
import { CgHeart } from "react-icons/cg";

import { FiShoppingCart } from "react-icons/fi";
import avatarImg from "../assets/avatar.png"; 

import { useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";



// initialize dropdown content
const navigation = [
    {name : "Dashboard", href : "/dashboard" },               
    {name : "Orders", href : "/orders" },
    {name : "Cart Page", href : "/cart" },
    {name : "Check Out", href : "/checkout" },
]



const Navbar = () => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const cartItems = useSelector (state =>state.cart.cartItems);

     const navigate = useNavigate();
    const {currentUser,logout } = useAuth();

   const handleLogOut = async () => {
    try {
        await logout();
        navigate("/login");
    } catch (error) {
        console.error("Logout error:", error);
    }
};


  return (
  <>
            <header className='max-w-screen-2x1 mx-auto px-4 py-6'>
                    <nav className='flex justify-between items-center'>
                 
                    {/* left side dive */}
                       
                        <div className="flex items-center md:gap-16 gap-4">
                            <Link to="/">
                                  <HiMiniBars3BottomLeft className="size-6"/>
                            </Link>
                        

                        {/* Search field */}
                        <div className="relative sm:w-72 w-40 space-x-2">
                            
                            <IoIosSearch className=" absolute inline-block left-3 inset-y-2"/>
                            
                            <input type="text" placeholder="Search here" 
                            className="bg-[#EAEAEA] w-full py-1 md:px-8 px-6 rounded-md
                             focus:outline-none"
                             />
                        
                        </div>
                  </div>

                        {/* right side dive */}
                        <div className="relative flex items-center md:space-x-3 space-x-2">
                            <div>
                                {
                                    currentUser ? 
                                    <>
                                    
                                    <button onClick={()=>setIsDropdownOpen(!isDropdownOpen)}>
                                        <img src={avatarImg} alt="" className={`size-7 rounded-full ${currentUser ? 'ring-4 ring-blue-200' :''}`} />
                                    </button>

                                    {/* show drop down list when click */}
                                     {
                                          isDropdownOpen && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40">
                                                    <ul className="py-2">
                                                        {
                                                            navigation.map((item)=>(
                                                                <li key={item.name} onClick={()=>setIsDropdownOpen(false)}>
                                                                    <Link to ={item.href} className="block px-4 py-2 hover:bg-gray-100 text-sm">
                                                                        {item.name}
                                                                    </Link>
                                                                </li>
                                                            ))
                                                        }
                                                        {/* Logoout button */}
                                                        <li>
                                                            <button onClick={handleLogOut}
                                                            className="w-full text-left block px-4 py-2 hover:bg-gray-100 text-sm">Logout</button>
                                                        </li>
                                                    </ul>
                                                </div>

                                          )
                                          
                                          
                                          }
                                    
                                    </> : <Link to="/login"><LuCircleUserRound className="size-6"/></Link>
                                }
                            </div>

                            
                            <button className="hidden sm:block ">
                                    <CgHeart className="size-6"/>
                            </button>
                                                                         {/* when user click on the cart icon its need to route to another page that why use a Link*/}
                           <Link to="/cart" className="bg-amber-500 p-1 sm:px-5 py-1.5 flex items-center rounded-md">
                                <FiShoppingCart className="size-6"/>
                                {
                                    cartItems.length > 0 ?  <span className="text-sm font-semibold sm:ml-1">{cartItems.length}</span> :<span className="text-sm font-semibold sm:ml-1">0</span>
                                }
                                  
                            </Link> 

                        </div>

                    </nav>
            </header>
  
  
  
  </>
  )
}

export default Navbar;
