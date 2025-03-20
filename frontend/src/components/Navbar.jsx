import { Link } from "react-router-dom";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { IoIosSearch } from "react-icons/io";
import { LuCircleUserRound } from "react-icons/lu";
import { CgHeart } from "react-icons/cg";
import { FiShoppingCart } from "react-icons/fi";





const Navbar = () => {
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
                            <LuCircleUserRound className="size-6"/>
                            <button className="hidden sm:block ">
                                    <CgHeart className="size-6"/>
                            </button>
                                                                         {/* when user click on the cart icon its need to route to another page that why use a Link*/}
                           <Link to="/cart" className="bg-amber-500 p-1 sm:px-5 py-1.5 flex items-center rounded-md">
                                <FiShoppingCart className="size-6"/>
                                <span className="text-sm font-semibold sm:ml-1">0</span>  
                            </Link> 

                        </div>

                    </nav>
            </header>
  
  
  
  </>
  )
}

export default Navbar;
