import React from 'react'
import BannerImg from '../../assets/ban.jpg'; 
import { useState, useEffect, useContext } from 'react';
import { Book, Sparkles, Star, Heart, BookOpen, Users, Award, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Add this import for navigation
// import { AuthContext } from '../../context/AuthContext'; // Uncomment if using AuthContext

// Enhanced hero section with modern effects
const Banner = ({ isLoggedIn }) => { // Remove default value to make it required
    const navigate = useNavigate(); // Add navigation hook
    const [books, setBooks] = useState([]);
    const [currentStats, setCurrentStats] = useState({
        books: 0,
        readers: 0,
        authors: 0
    });
    const [isVisible, setIsVisible] = useState(false);
    // Removed mousePosition state since we're removing the mouse effect

    // Removed mouse parallax effect useEffect

    // Scroll reveal effect
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Animated counter for stats
    useEffect(() => {
        const targetStats = { books: 10000, readers: 50000, authors: 1200 };
        const duration = 2000;
        const steps = 60;
        const stepTime = duration / steps;
        
        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            
            setCurrentStats({
                books: Math.floor(targetStats.books * progress),
                readers: Math.floor(targetStats.readers * progress),
                authors: Math.floor(targetStats.authors * progress)
            });
            
            if (step >= steps) {
                clearInterval(timer);
                setCurrentStats(targetStats);
            }
        }, stepTime);
        
        return () => clearInterval(timer);
    }, []);

    // Floating books animation (reduced and more elegant)
    useEffect(() => {
        const interval = setInterval(() => {
            setBooks(prevBooks => {
                const visibleBooks = prevBooks.filter(book => 
                    Date.now() - book.startTime < parseFloat(book.duration) * 1000);
                const newBooksCount = Math.random() > 0.7 ? 1 : 0; // Less frequent
                const newBooks = Array.from({ length: newBooksCount }, createBook);
                
                return [...visibleBooks, ...newBooks];
            });
        }, 3000); // Slower interval
        return () => clearInterval(interval);
    }, []);

    const createBook = () => ({
        id: Math.random().toString(36).substring(2, 9),
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2}s`,
        duration: `${10 + Math.random() * 10}s`, // Much slower fall
        size: Math.random() > 0.8 ? 'lg' : 'md',
        rotation: `${Math.random() * 360}deg`,
        startTime: Date.now(),
    });

    const getBookSize = (size) => {
        switch (size) {
            case 'lg': return 'w-6 h-6';
            case 'md': return 'w-4 h-4';
            default: return 'w-4 h-4';
        }
    };

    const getBookColor = () => {
        const colors = ['text-blue-300', 'text-purple-300', 'text-indigo-300'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const formatNumber = (num) => {
        return num.toLocaleString();
    };

    // Handle navigation to registration page
    const handleJoinCommunity = () => {
        navigate('/register'); // Change this path to match your registration route
    };

    // Handle navigation to explore page
    const handleExplore = () => {
        navigate('/explore'); // Change this path to match your explore route
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Full Background Image */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={BannerImg} 
                    alt="Background" 
                    className="w-full h-full object-cover object-center transform scale-110 animate-slow-zoom"
                />
                {/* Dark overlay for content readability */}
                <div className="absolute inset-0 bg-black/50"></div>
                {/* Dynamic gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60 animate-gradient-shift"></div>
                {/* Enhanced blur overlay for modern effect */}
                <div className="absolute inset-0 backdrop-blur-[0.5px]"></div>
            </div>

            {/* Advanced Background Effects - REMOVED MOUSE EFFECT */}
            <div className="absolute inset-0 z-10">
                {/* REMOVED: Animated mesh gradient that followed mouse */}
                
                {/* Geometric patterns */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full animate-pulse-slow"></div>
                    <div className="absolute top-40 right-32 w-24 h-24 border border-white/15 rounded-lg rotate-45 animate-float-slow"></div>
                    <div className="absolute bottom-32 left-32 w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-full animate-bounce-gentle"></div>
                    <div className="absolute bottom-20 right-20 w-20 h-20 border-2 border-white/20 rounded-full animate-rotate-slow"></div>
                </div>

               
            </div>

            {/* Main Content */}
            <div className="relative z-20">
                <div className="flex flex-col items-center justify-center text-center py-20 md:py-32 px-4">
                    
                    {/* Enhanced Professional Badge */}
                    <div className={`mb-12 transform transition-all duration-1000 ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>

                    </div>

                    {/* Enhanced Text Content */}
                    <div className={`max-w-5xl space-y-8 transform transition-all duration-1000 delay-300 ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight">
                                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-gradient-x drop-shadow-lg">
                                    New Arrivals
                                </span>
                                <br />
                                <span className="text-white relative drop-shadow-lg">
                                    This Week
                                </span>
                            </h1>
                            
                            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto drop-shadow-md text-center">
                                Dive into the latest picks in our collection - expertly curated titles that bring 
                                <span className="font-semibold text-white hover:scale-105 hover:drop-shadow-lg transition-all duration-300 cursor-default inline-block"> inspiration</span>, 
                                <span className="font-semibold text-white hover:scale-105 hover:drop-shadow-lg transition-all duration-300 cursor-default inline-block"> insight</span>, and 
                                <span className="font-semibold text-white hover:scale-105 hover:drop-shadow-lg transition-all duration-300 cursor-default inline-block"> imagination</span> to every reader.
                            </p>
                        </div>

                        {/* Conditional CTA Button */}
                        <div className={`flex justify-center items-center pt-6 transform transition-all duration-1000 delay-500 ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}>
                            {isLoggedIn ? (
                                // Show Explore button for logged-in users
                                <button 
                                    onClick={handleExplore}
                                    className="group border-2 border-white/60 text-white px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-white/80 flex items-center gap-2 backdrop-blur-sm"
                                >
                                    <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                    <span>Explore</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </button>
                            ) : (
                                // Show Join Community button for non-logged-in users
                                <button 
                                    onClick={handleJoinCommunity}
                                    className="group border-2 border-white/60 text-white px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-white/80 flex items-center gap-2 backdrop-blur-sm"
                                >
                                    <Users className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                    <span>Join Community</span>
                                </button>
                            )}
                        </div>

                        {/* Enhanced Call to Action */}
                        <div className={`mt-12 flex flex-col items-center space-y-4 transform transition-all duration-1000 delay-900 ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}>
                            <div className="flex items-center gap-3 text-white/80 text-xs">
                                <span className="font-medium tracking-wider uppercase">Begin Your Journey</span>
                            </div>
                            <blockquote className="text-white/90 text-base font-medium italic max-w-xl text-center drop-shadow-md">
                                "A room without books is like a body without a soul"
                                <cite className="block text-xs text-white/70 mt-1 not-italic">- Cicero -</cite>
                            </blockquote>
                        </div>
                    </div>
                </div>
                
                {/* Subtle floating books animation */}
                {books.map((book) => (
                    <div
                        key={book.id}
                        className={`absolute top-0 text-white/10 animate-fall pointer-events-none opacity-10`}
                        style={{
                            left: book.left,
                            animationDelay: book.delay,
                            animationDuration: book.duration,
                            transform: `rotate(${book.rotation})`,
                        }}
                    >
                        <Book className={`${getBookSize(book.size)} drop-shadow-lg`} />
                    </div>
                ))}
            </div>
            
            {/* Enhanced custom animations */}
            <style jsx>{`
                @keyframes slow-zoom {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                
                @keyframes gradient-shift {
                    0%, 100% { background: linear-gradient(135deg, rgba(0,0,0,0.4) 0%, transparent 50%, rgba(0,0,0,0.6) 100%); }
                    50% { background: linear-gradient(135deg, rgba(0,0,0,0.6) 0%, transparent 50%, rgba(0,0,0,0.4) 100%); }
                }
                
                @keyframes fall {
                    0% { transform: translateY(-30px) rotate(0deg); opacity: 0; }
                    10% { opacity: 0.2; }
                    90% { opacity: 0.1; }
                    100% { transform: translateY(120vh) rotate(360deg); opacity: 0; }
                }
                
                @keyframes gradient-x {
                    0%, 100% { background-size: 200% 200%; background-position: left center; }
                    50% { background-size: 200% 200%; background-position: right center; }
                }
                
                @keyframes pulse-slow { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
                @keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                @keyframes bounce-gentle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
                @keyframes rotate-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes float-gentle { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-10px, -10px); } }
                @keyframes float-gentle-reverse { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(10px, 10px); } }
                
                .animate-slow-zoom { animation: slow-zoom 20s ease-in-out infinite; }
                .animate-gradient-shift { animation: gradient-shift 15s ease-in-out infinite; }
                .animate-fall { animation: fall linear both; }
                .animate-gradient-x { animation: gradient-x 6s ease infinite; }
                .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
                .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
                .animate-bounce-gentle { animation: bounce-gentle 4s ease-in-out infinite; }
                .animate-rotate-slow { animation: rotate-slow 20s linear infinite; }
                .animate-float-gentle { animation: float-gentle 8s ease-in-out infinite; }
                .animate-float-gentle-reverse { animation: float-gentle-reverse 10s ease-in-out infinite; }
                
                .perspective-1000 { perspective: 1000px; }
                .rotate-y-12 { transform: rotateY(12deg); }
                .shadow-4xl { box-shadow: 0 40px 80px -12px rgba(0, 0, 0, 0.3); }
            `}</style>
        </div>
    )
}

export default Banner