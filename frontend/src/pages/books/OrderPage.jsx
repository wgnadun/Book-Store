import React, { useState, useEffect } from 'react';
import { useGetOrderByEmailQuery } from '../../redux/features/orders/ordersApi';
import { useAuth } from '../../context/AuthContext';
import { useFetchBookByIdQuery } from '../../redux/features/books/booksApi';

// Single Book Details Component - Enhanced with better error handling and fixed image loading
const BookDetailsWithProductId = ({ productId, index }) => {
  const [retryCount, setRetryCount] = useState(0);
  const [imageError, setImageError] = useState(false);
  
  const { 
    data: book, 
    isLoading, 
    error,
    isFetching,
    refetch 
  } = useFetchBookByIdQuery(productId, {
    skip: !productId,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: false, // Prevent auto-refetch on focus to avoid conflicts
    // Add a unique key to prevent cache conflicts
    selectFromResult: (result) => ({
      ...result,
      // Force unique cache entry for each book
      data: result.data,
    }),
  });

  // Enhanced retry logic with exponential backoff
  useEffect(() => {
    if (error && productId && retryCount < 3) {
      const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        refetch();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [error, productId, refetch, retryCount]);

  // Reset retry count and image error on successful fetch
  useEffect(() => {
    if (book && !error) {
      setRetryCount(0);
      setImageError(false);
    }
  }, [book, error]);

  // Helper function to get the correct image URL
  const getImageUrl = (book) => {
    if (!book?.coverImage) return "/placeholder-book.jpg";
    
    // If it's already a full URL, return as is
    if (book?.coverImage.startsWith('http://') || book.coverImage.startsWith('https://')) {
      return book?.coverImage;
    }
    
    // If it starts with '/', it's a relative path from root
    if (book.coverImage.startsWith('/')) {
      return book.coverImage;
    }
    
    // Otherwise, assume it needs to be prefixed (adjust this based on your backend setup)
    return `/${book.coverImage}`;
  };

  const handleImageError = (e) => {
    if (!imageError) {
      setImageError(true);
      // Try different fallback sources
      const fallbacks = [
        "/placeholder-book.jpg",
        "/images/placeholder-book.jpg",
        "/assets/placeholder-book.jpg",
        "https://via.placeholder.com/64x80/cccccc/666666?text=Book"
      ];
      
      const currentSrc = e.target.src;
      const nextFallback = fallbacks.find(fallback => !currentSrc.includes(fallback));
      
      if (nextFallback) {
        e.target.src = nextFallback;
      }
    }
  };
  
  if (error) {
    return (
      <div className="flex border border-red-200 rounded-lg p-3 bg-red-50 mb-2">
        <div className="text-red-600 text-sm flex items-center justify-between w-full">
          <div className="flex-1">
            <span className="block font-medium">Error loading book (ID: {productId})</span>
            <span className="text-xs text-red-500">
              {error?.data?.message || error?.message || 'Please try again.'}
              {retryCount > 0 && ` (Attempt ${retryCount}/3)`}
            </span>
          </div>
          <button 
            onClick={() => {
              setRetryCount(0);
              refetch();
            }}
            className="ml-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors flex-shrink-0"
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? 'Loading...' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }
  
  if (!isLoading && !isFetching && !book) {
    return (
      <div className="flex border border-yellow-200 rounded-lg p-3 bg-yellow-50 mb-2">
        <div className="text-yellow-700 text-sm flex items-center justify-between w-full">
          <span>Book not found (ID: {productId})</span>
          <button 
            onClick={() => refetch()}
            className="ml-2 px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  // Display loading skeleton
  if (isLoading || isFetching) {
    return (
      <div className="mb-2">
        <div className="animate-pulse bg-gray-200 h-24 rounded-lg w-full flex items-center p-3">
          <div className="w-16 h-20 bg-gray-300 rounded flex-shrink-0"></div>
          <div className="ml-4 flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Calculate discount percentage if both prices exist
  const discountPercentage = book?.oldPrice && book?.newPrice 
    ? Math.round(((book?.oldPrice - book?.newPrice) / book?.oldPrice) * 100)
    : 0;
    
  return (
    <div className="relative mb-2">
      {index !== undefined && (
        <div className="absolute left-0 top-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-br-lg z-10">
          #{index + 1}
        </div>
      )}
      <div className="flex border border-gray-200 rounded-lg p-3 bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="w-16 h-20 flex-shrink-0 relative overflow-hidden rounded-md shadow-md bg-gray-100">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-20"></div>
          <img 
            src={getImageUrl(book)}
            alt={book?.title || "Book cover"} 
            className="w-full h-full object-cover"
            onError={handleImageError}
            onLoad={() => setImageError(false)}
            style={{ 
              backgroundColor: '#f3f4f6',
              minHeight: '80px'
            }}
          />
          
          {/* Loading overlay for image */}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-xs text-gray-500 text-center p-1">
                <svg className="w-6 h-6 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                No Image
              </div>
            </div>
          )}
          
          {/* Trending badge */}
          {book?.trending && (
            <div className="absolute top-1 left-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              Trending
            </div>
          )}
        </div>
        <div className="ml-4 flex-grow">
          <h4 className="font-medium text-gray-800">{book?.title || "Unknown Title"}</h4>
          <p className="text-sm text-gray-600 line-clamp-2">
            {book?.description || "No description available"}
          </p>
          
          <div className="flex flex-wrap justify-between items-center mt-2 gap-2">
            {/* Category */}
            <span className="text-xs px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full text-gray-700 shadow-sm">
              {book?.category || "Uncategorized"}
            </span>
            
            {/* Price information */}
            <div className="flex items-center gap-2">
              {book?.oldPrice && (
                <span className="line-through text-gray-400 text-xs">
                  ${book?.oldPrice}
                </span>
              )}
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
                ${book?.newPrice || book?.price || "N/A"}
              </span>
              {discountPercentage > 0 && (
                <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full">
                  {discountPercentage}% OFF
                </span>
              )}
            </div>
          </div>        
        </div>
      </div>
    </div>
  );
};

// Books List Component - Handles multiple books efficiently
const BooksList = ({ productIds, refreshTrigger }) => {
  const [forceRefresh, setForceRefresh] = useState(0);
  
  if (!productIds || productIds.length === 0) {
    return (
      <div className="text-gray-500 text-sm bg-gray-50 p-4 rounded-lg border text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        No books found in this order
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {productIds.map((productId, index) => (
        <BookDetailsWithProductId 
          key={`${productId}-${index}-${refreshTrigger}-${forceRefresh}`} 
          productId={productId} 
          index={index}
        />
      ))}
      
      {/* Refresh all books button */}
      <div className="flex justify-center pt-2">
        <button 
          onClick={() => setForceRefresh(prev => prev + 1)}
          className="text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh All Books
        </button>
      </div>
    </div>
  );
};

// Order Details Modal Component - Enhanced version
const OrderDetailsModal = ({ order, onClose }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRefreshBooks = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-4 flex justify-between items-center z-10">
          <h3 className="text-xl font-bold">Order Details</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRefreshBooks}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
              title="Refresh book details"
            >  
            </button>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6 bg-gradient-to-b from-white to-gray-50">
          {/* Order summary */}
          <div className="mb-6 flex justify-between items-center pb-4 border-b">
            <div>
              <h4 className="text-lg font-semibold text-gray-800">Order #{order._id.substring(0, 8)}</h4>
              <p className="text-sm text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full font-bold shadow-md">
              ${order.totalPrice}
            </div>
          </div>
          
          {/* Books list */}
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-700 uppercase text-sm tracking-wider">
              Ordered Books ({order.productIds?.length || 0})
            </h4>
            <div className="text-sm text-gray-500">
              {order.productIds?.length > 1}
            </div>
          </div>
          
          <div className="mb-6 max-h-96 overflow-y-auto">
            <BooksList 
              productIds={order.productIds} 
              refreshTrigger={refreshTrigger}
            />
          </div>
          
          {/* Customer and shipping info */}
          <div className="grid md:grid-cols-2 gap-6 bg-gradient-to-b from-gray-50 to-gray-100 p-5 rounded-lg shadow-inner">
            <div>
              <h4 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 uppercase text-sm tracking-wider mb-3">Customer Details</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">{order.name}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-sm">{order.email}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="text-sm">{order.phone}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 uppercase text-sm tracking-wider mb-3">Shipping Address</h4>
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <div className="text-sm">
                  <p>{order.address?.street}</p>
                  <p>{order.address?.city}, {order.address?.state}</p>
                  <p>{order.address?.country}, {order.address?.zipcode}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 px-6 py-4 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderPage = () => {
  const { currentUser } = useAuth();
  const { data: orders = [], isLoading, isError, error, refetch } = useGetOrderByEmailQuery(
    currentUser?.email,
    {
      skip: !currentUser?.email,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Add a class to the body when modal is open to prevent scrolling
  useEffect(() => {
    if (selectedOrder) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedOrder]);

  // Auto-refresh orders every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentUser?.email) {
        refetch();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentUser?.email, refetch]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-t-2 border-blue-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border-l-4 border-red-500 text-red-700">
          <div className="flex justify-between items-center">
            <span>Error loading orders data: {error?.message || 'Please try again later.'}</span>
            <button 
              onClick={() => refetch()}
              className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser?.email) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border-l-4 border-yellow-500 text-yellow-700">
          Please log in to view your orders.
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-indigo-900 relative inline-block pb-2">
          Your Orders
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></span>
        </h2>
        <button
          onClick={() => refetch()}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center shadow-lg border border-dashed border-gray-300 bg-gradient-to-b from-white to-gray-50">
          <div className="bg-blue-50 p-6 rounded-full mx-auto w-24 h-24 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg">You haven't placed any orders yet</p>
          <button className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-md">
            Browse Books
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order, index) => (
            <div 
              key={order._id} 
              className="bg-white rounded-xl overflow-hidden group relative shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
            >
              {/* Order number badge */}
              <div className="absolute left-0 top-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-br-lg font-medium shadow-md z-10">
                Order #{index+1}
              </div>
              
              {/* Order header */}
              <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
                
                <div className="flex justify-between items-center pt-6 relative z-10">
                  <div className="bg-gray-600 bg-opacity-70 backdrop-blur-sm px-4 py-2 rounded-lg text-sm">
                    <span className="font-medium">ID:</span> {order._id.substring(0, 8)}...
                  </div>
                  <div className="bg-gradient-to-r from-white to-gray-100 text-gray-800 rounded-full px-4 py-2 font-bold transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-indigo-600 group-hover:text-white shadow-md">
                    ${order.totalPrice}
                  </div>
                </div>
              </div>
              
              {/* Order body */}
              <div className="p-6 bg-gradient-to-b from-white to-gray-50 border-l-4 border-transparent group-hover:border-blue-500 transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Customer info */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 uppercase text-sm tracking-wider border-b pb-2">Customer Details</h4>
                    <div className="space-y-2">
                      <p className="flex items-center text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        {order.name}
                      </p>
                      <p className="flex items-center text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        {order.email}
                      </p>
                      <p className="flex items-center text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        {order.phone}
                      </p>
                    </div>
                  </div>
                  
                  {/* Shipping info */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 uppercase text-sm tracking-wider border-b pb-2">Shipping Address</h4>
                    <p className="text-gray-700 flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>
                        {order.address?.street}, {order.address?.city}, {order.address?.state}, {order.address?.country}, {order.address?.zipcode}
                      </span>
                    </p>
                  </div>
                </div>
                
                {/* Product count */}
                <div className="mt-6">
                  <h4 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 uppercase text-sm tracking-wider border-b pb-2 mb-3">Products</h4>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">
                        {order.productIds?.length || 0} book{(order.productIds?.length || 0) !== 1 ? 's' : ''} in this order
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Order footer */}
              <div className="bg-gradient-to-b from-gray-50 to-gray-100 px-6 py-4 flex justify-end">
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="bg-gradient-to-r from-gray-200 to-gray-300 hover:from-blue-500 hover:to-indigo-600 text-gray-700 hover:text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 text-sm shadow-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Order details modal */}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
};

export default OrderPage;