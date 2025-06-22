import React, { useState } from 'react';
import { FiShoppingCart, FiBookOpen, FiStar, FiHeart, FiEye, FiTag } from 'react-icons/fi';
import { getImgUrl } from '../../utils/getImgUrl';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import Swal from 'sweetalert2';

const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.cartItems);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Check if book is already in cart
  const isBookInCart = cartItems.some(item => item._id === book._id);
  
  const handleAddToCart = (product) => {
    // Check if book is already in cart
    if (isBookInCart) {
      Swal.fire({
        title: 'Already exists',
        confirmButtonText: 'OK'
      });
      return;
    }

    dispatch(addToCart(product));
  };

  const discountPercentage = book?.oldPrice && book?.newPrice 
    ? Math.round(((book.oldPrice - book.newPrice) / book.oldPrice) * 100) 
    : 0;
  
  return (
    <div className="group relative w-full max-w-sm mx-auto h-[520px] bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-slate-300">
      
      {/* Top Section - Image Container */}
      <div className="relative h-[280px] overflow-hidden bg-slate-50">
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-30">
          {/* Category Badge */}
          {book.category && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white/95 text-slate-700 shadow-sm border border-slate-200/60 backdrop-blur-sm">
              <FiTag size={11} />
              {book.category}
            </span>
          )}
          
          {/* Trending Badge */}
          {book.trending && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
              <FiStar size={11} />
              TRENDING
            </span>
          )}
        </div>
        
        {/* Book Cover */}
        <Link to={`/books/${book._id}`} className="block w-full h-full relative">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
          )}
          
          <img
            src={getImgUrl(book?.coverImage)}
            alt={book.title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.02] ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop&crop=center";
              e.target.onerror = null;
              setImageLoaded(true);
            }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2.5 flex items-center gap-2 text-slate-800 font-medium shadow-lg border border-white/20">
                <FiEye size={15} />
                <span className="text-sm">Quick Preview</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Bottom Section - Content */}
      <div className="h-[240px] p-5 flex flex-col justify-between">
        
        {/* Title and Author */}
        <div className="mb-3">
          <Link to={`/books/${book._id}`} className="group/title">
            <h3 className="text-lg font-semibold text-slate-900 mb-1.5 line-clamp-2 leading-snug group-hover/title:text-blue-700 transition-colors duration-200">
              {book.title}
            </h3>
          </Link>
          
          {book.author && (
            <p className="text-sm text-slate-600 font-medium">
              by {book.author}
            </p>
          )}
        </div>
        
        {/* Description */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed flex-grow">
          {book?.description?.length > 100
            ? `${book.description.slice(0, 100)}...`
            : book?.description || 'Discover this amazing book with captivating content and engaging storyline.'}
        </p>
        
        {/* Price Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">
              ${book?.newPrice}
            </span>
            
            {book?.oldPrice && (
              <span className="text-sm text-red-500 line-through font-medium">
                ${book.oldPrice}
              </span>
            )}
          </div>
          
          {discountPercentage > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md shadow-sm">
              {discountPercentage}% OFF
            </span>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => handleAddToCart(book)}
            className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            <FiShoppingCart size={16} />
            <span className="text-sm font-medium">Add to Cart</span>
          </button>
          
          <Link
            to={`/books/${book._id}`}
            className="px-4 py-3 border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 rounded-lg transition-all duration-200 flex items-center justify-center hover:bg-slate-50 shadow-sm active:scale-[0.98]"
          >
            <FiBookOpen size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;