import { Link, useNavigate, useLocation } from "react-router-dom";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { IoIosSearch } from "react-icons/io";
import { LuCircleUserRound } from "react-icons/lu";
import { CgHeart } from "react-icons/cg";
import { FiShoppingCart } from "react-icons/fi";
import { IoChevronDown } from "react-icons/io5";
import { FiSettings, FiUser, FiPackage, FiCreditCard, FiLogOut, FiX } from "react-icons/fi";
import avatarImg from "../assets/avatar.png"; 

import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useFetchAllBooksQuery } from "../redux/features/books/booksApi";
import { getImgUrl } from "../utils/getImgUrl";

// initialize dropdown content with icons
const navigation = [               
    {name: "Orders", href: "/orders", icon: <FiPackage className="size-4" /> },
    {name: "Cart Page", href: "/cart", icon: <FiShoppingCart className="size-4" /> },
    {name: "Check Out", href: "/checkout", icon: <FiCreditCard className="size-4" /> },
];

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    
    // Search state
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    
    const cartItems = useSelector(state => state.cart.cartItems);
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, logout } = useAuth();
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);
    
    // Fetch books for search
    const { data: booksData } = useFetchAllBooksQuery();
    const books = Array.isArray(booksData) ? booksData : booksData?.books || [];
    
    // Check if we're on the login page
    const isLoginPage = location.pathname === "/login";

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [scrolled]);

    // Handle click outside to close dropdown and search
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Animation effect when user state changes
    useEffect(() => {
        if (currentUser !== null) {
            setIsAnimating(true);
            const timer = setTimeout(() => {
                setIsAnimating(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentUser]);

    // Search functionality
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setSearchResults([]);
            setShowSearchResults(false);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        
        // Debounce search
        const timeoutId = setTimeout(() => {
            const filtered = books.filter(book =>
                book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.category?.toLowerCase().includes(searchQuery.toLowerCase())
            ).slice(0, 8); // Limit to 8 results
            
            setSearchResults(filtered);
            setShowSearchResults(true);
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, books]);

    const handleLogOut = async () => {
        try {
            setIsAnimating(true);
            await logout();
            setIsDropdownOpen(false);
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setTimeout(() => {
                setIsAnimating(false);
            }, 500);
        }
    };

    const handleSignIn = () => {
        navigate("/login");
    };

    const handleSearchInputChange = (e) => {
        e.stopPropagation();
        setSearchQuery(e.target.value);
    };

    const handleKeyDown = (e) => {
        // Stop all event propagation to prevent conflicts
        e.stopPropagation();
        
        // Handle Enter key for search submission
        if (e.key === 'Enter') {
            e.preventDefault();
            if (searchQuery.trim()) {
                navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                setShowSearchResults(false);
                setSearchQuery("");
            }
        }
        
        // Handle Escape key to close search results
        if (e.key === 'Escape') {
            e.preventDefault();
            setShowSearchResults(false);
        }
    };

    const handleSearchFocus = (e) => {
        e.stopPropagation();
        if (searchQuery.trim() && searchResults.length > 0) {
            setShowSearchResults(true);
        }
    };

    const handleSearchResultClick = (book) => {
        navigate(`/books/${book._id}`);
        setShowSearchResults(false);
        setSearchQuery("");
    };

    const clearSearch = (e) => {
        e.stopPropagation();
        setSearchQuery("");
        setSearchResults([]);
        setShowSearchResults(false);
    };

    return (
        <>
            <header className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
                scrolled 
                ? "bg-gray-900/70 backdrop-blur-md border-b border-gray-800/50 shadow-lg" 
                : "bg-gray-900"
            }`}>
                <div className="max-w-7xl mx-auto">
                    <nav className="flex justify-between items-center px-6 md:px-8 py-4">
                        {/* Left side div */}
                        <div className="flex items-center gap-8">
                            <Link to="/" className="flex items-center gap-2 group">
                                <div className={`flex items-center justify-center p-1.5 rounded-lg transition-all ${
                                    scrolled 
                                    ? "bg-gray-800/80 group-hover:bg-gray-700/90" 
                                    : "bg-gray-800 group-hover:bg-gray-700"
                                }`}>
                                    <HiMiniBars3BottomLeft className="size-5 text-gray-300" />
                                </div>
                                <span className={`font-bold text-xl hidden md:block transition-colors ${
                                    scrolled 
                                    ? "text-white" 
                                    : "text-white"
                                } group-hover:text-gray-300 transition-all duration-300`}>ReaDMore</span>
                            </Link>

                            {/* Enhanced Search field */}
                            <div className="relative sm:w-64 md:w-80 w-40" ref={searchRef}>
                                <div className="relative group">
                                    <div className="absolute left-3.5 top-3 text-gray-400 group-focus-within:text-gray-200 transition-all duration-300 pointer-events-none z-10">
                                        <IoIosSearch className="size-5" />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={searchQuery}
                                        onChange={handleSearchInputChange}
                                        onFocus={handleSearchFocus}
                                        onKeyDown={handleKeyDown}
                                        autoComplete="off"
                                        spellCheck="false"
                                        placeholder="Search books, authors, categories..." 
                                        className={`w-full h-11 py-2 pl-11 pr-12 rounded-xl border transition-all focus:outline-none relative z-0 ${
                                            scrolled 
                                            ? "bg-gray-800/80 border-gray-700/50 text-gray-200 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50" 
                                            : "bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/50"
                                        }`}
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-200 transition-colors z-10 pointer-events-auto"
                                        >
                                            <FiX className="size-5" />
                                        </button>
                                    )}
                                    {isSearching && (
                                        <div className="absolute right-3 top-3 z-10 pointer-events-none">
                                            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>

                                {/* Search Results Dropdown */}
                                {showSearchResults && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-xl max-h-96 overflow-y-auto z-50">
                                        {searchResults.length > 0 ? (
                                            <>
                                                <div className="p-3 border-b border-gray-800/50">
                                                    <p className="text-sm text-gray-400">
                                                        Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                                                    </p>
                                                </div>
                                                <div className="py-2">
                                                    {searchResults.map((book) => (
                                                        <button
                                                            key={book._id}
                                                            onClick={() => handleSearchResultClick(book)}
                                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800/60 transition-colors text-left"
                                                        >
                                                            <div className="w-10 h-12 bg-gray-700 rounded flex-shrink-0 overflow-hidden">
                                                                <img
                                                                    src={getImgUrl(book.coverImage)}
                                                                    alt={book.title}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.src = 'https://via.placeholder.com/80x100/4B5563/9CA3AF?text=Book';
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-white font-medium text-sm truncate">
                                                                    {book.title}
                                                                </h4>
                                                                <p className="text-gray-400 text-xs truncate">
                                                                    by {book.author || 'Unknown Author'}
                                                                </p>
                                                                <p className="text-gray-500 text-xs">
                                                                    {book.category} • ${book.newPrice}
                                                                </p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                                {searchResults.length >= 8 && (
                                                    <div className="p-3 border-t border-gray-800/50">
                                                        <button
                                                            onClick={() => {
                                                                navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                                                                setShowSearchResults(false);
                                                                setSearchQuery("");
                                                            }}
                                                            className="w-full text-blue-400 hover:text-blue-300 text-sm font-medium py-2 transition-colors"
                                                        >
                                                            View all results →
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="p-6 text-center">
                                                <IoIosSearch className="size-8 text-gray-600 mx-auto mb-2" />
                                                <p className="text-gray-400 text-sm">
                                                    No books found for "{searchQuery}"
                                                </p>
                                                <p className="text-gray-500 text-xs mt-1">
                                                    Try searching for different keywords
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right side div */}
                        <div className="relative flex items-center gap-3 md:gap-5">
                            {/* User account section with smooth transition */}
                            <div className="relative" ref={dropdownRef}>
                                {/* Transition container */}
                                <div className="relative">
                                    {/* Sign In button - absolute positioned for transition */}
                                    {!currentUser && !isLoginPage && (
                                        <div
                                            className="relative z-10"
                                            style={{
                                                opacity: 1,
                                                transition: 'opacity 0.3s ease, transform 0.3s ease',
                                            }}
                                        >
                                            <button 
                                                onClick={handleSignIn}
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 
                                                bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                            >
                                                <LuCircleUserRound className="size-5" />
                                                <span className="text-sm font-medium hidden md:block">Sign In</span>
                                            </button>
                                        </div>
                                    )}
                                    
                                    {/* User profile section - absolute positioned for transition */}
                                    {currentUser && (
                                        <div 
                                            className="relative z-10"
                                            style={{
                                                animation: 'fadeInScale 0.4s ease-out forwards',
                                            }}
                                        >
                                            <button 
                                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                className={`flex items-center gap-2 focus:outline-none group py-2 px-3 rounded-xl transition-all duration-300 ${
                                                    isDropdownOpen && scrolled ? 'bg-gray-800/80' :
                                                    isDropdownOpen && !scrolled ? 'bg-gray-800' : ''
                                                } hover:bg-gray-800/80`}
                                                aria-expanded={isDropdownOpen}
                                                aria-haspopup="true"
                                            >
                                                <div className={`relative size-9 rounded-full border-2 overflow-hidden transition-all group-hover:scale-105 duration-300 ${
                                                    scrolled 
                                                    ? "border-gray-700/70" 
                                                    : "border-gray-700"
                                                } group-hover:border-gray-600`}>
                                                    <img 
                                                        src={avatarImg} 
                                                        alt="User" 
                                                        className="size-full object-cover"
                                                    />
                                                </div>
                                               
                                            </button>

                                            {/* Enhanced Dropdown menu with improved colors */}
                                            {isDropdownOpen && (
                                                <div 
                                                    className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl z-40 overflow-hidden border border-gray-700/50 shadow-xl"
                                                    style={{
                                                        animation: 'dropdownFade 0.3s ease-out forwards',
                                                    }}
                                                >
                                             
                                                    {/* Menu body with darker background */}
                                                    <div className="bg-gray-900/90 backdrop-blur-md">                                                        
                                                        {/* Navigation links with cleaner divider */}
                                                        <div className="border-t border-gray-800/50">
                                                            {navigation.map((item) => (
                                                                <Link 
                                                                    key={item.name}
                                                                    to={item.href} 
                                                                    className="flex items-center px-5 py-3 text-gray-200 hover:bg-gray-800/80 hover:text-gray-100 transition-all group"
                                                                    onClick={() => setIsDropdownOpen(false)}
                                                                >
                                                                    <span className="flex items-center justify-center size-8 rounded-full bg-gray-800/80 text-white group-hover:bg-gray-700/90 transition-all">
                                                                        {item.icon}
                                                                    </span>
                                                                    <span className="ml-3 font-medium group-hover:text-gray-100 transition-colors duration-300">{item.name}</span>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                        
                                                        {/* Logout button with cleaner styling */}
                                                        <div className="mt-1 pt-1 pb-2 border-t border-gray-800/50">
                                                            <button 
                                                                onClick={handleLogOut}
                                                                className="flex w-full items-center px-5 py-3 text-gray-200 hover:bg-gray-800/80 hover:text-red-400 transition-all group"
                                                            >
                                                                <span className="flex items-center justify-center size-8 rounded-full bg-red-900/90 text-white group-hover:bg-red-800/90 transition-all">
                                                                    <FiLogOut className="size-4" />
                                                                </span>
                                                                <span className="ml-3 font-medium text-gray-200 group-hover:text-red-400 transition-colors duration-300">Logout</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Wishlist button */}
                            <div className="hidden sm:block">
                                <button className={`group relative size-10 flex items-center justify-center rounded-full transition-all duration-300 
                                    ${scrolled ? 'bg-gray-800/80' : 'bg-gray-800'} hover:bg-gray-700/90`}
                                >
                                    <CgHeart className="size-5 text-gray-300 group-hover:text-gray-100 transition-colors duration-300" />
                                    <span className="absolute -top-1 -right-1 size-5 flex items-center justify-center text-xs font-medium rounded-full 
                                        bg-blue-600 text-white group-hover:bg-blue-700 
                                        group-hover:scale-110 transition-all duration-300"
                                    >0</span>
                                </button>
                            </div>

                            {/* Cart button */}
                            <Link 
                                to="/cart" 
                                className={`relative group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
                                    ${scrolled ? 'bg-gray-800/80' : 'bg-gray-800'} hover:bg-gray-700/90
                                    text-gray-200 hover:text-white border ${scrolled ? 'border-gray-700/50' : 'border-gray-700'} hover:border-gray-600/70
                                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-opacity-50`}
                            >
                                <div className="relative">
                                    <FiShoppingCart className="size-5" />
                                    {cartItems.length > 0 && (
                                        <span className="absolute -top-2 -right-2 size-5 flex items-center justify-center text-xs font-medium rounded-full
                                            bg-blue-600 text-white
                                            group-hover:scale-110 transition-all duration-300"
                                        >{cartItems.length}</span>
                                    )}
                                </div>
                                <span className="hidden md:block text-sm font-medium">
                                    Cart
                                </span>
                            </Link>
                        </div>
                    </nav>
                </div>
            </header>
            
            {/* Add CSS animation for dropdown and user transition */}
            <style jsx="true">{`
                @keyframes dropdownFade {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.5);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                @keyframes fadeOutScale {
                    from {
                        opacity: 1;
                        transform: scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: scale(0.5);
                    }
                }
            `}</style>
        </>
    );
};

export default Navbar;