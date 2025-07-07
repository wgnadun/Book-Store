import React, { useState, useEffect } from 'react';
import { getImgUrl } from '../../utils/getImgUrl';
import { FiShoppingCart, FiArrowLeft, FiTruck, FiShield, FiRefreshCw, FiStar, FiCheck } from 'react-icons/fi';
import { useParams, Link } from 'react-router-dom';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { useDispatch } from 'react-redux';
import { useFetchBookByIdQuery } from '../../redux/features/books/booksApi';

const SingleBook = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useFetchBookByIdQuery(id);
  const book = data?.book || data;
  const dispatch = useDispatch();
  
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (product) => {
    setIsAdding(true);
    
    // Create the cart item with the selected quantity
    const cartItem = {
      ...product,
      quantity: quantity // Use the current quantity state
    };
    
    dispatch(addToCart(cartItem));
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1200);
  };

  const handleQuantityChange = (newQuantity) => {
    const validQuantity = Math.max(1, Math.min(99, parseInt(newQuantity) || 1));
    setQuantity(validQuantity);
  };

  const increaseQuantity = () => {
    setQuantity(prev => Math.min(99, prev + 1));
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  if (isLoading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 text-sm">Loading product details...</p>
      </div>
    </div>
  );
  
  if (isError) return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-semibold text-slate-900 mb-3">Product Not Found</h2>
        <p className="text-slate-600 mb-6">The requested book could not be found in our catalog.</p>
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-medium rounded-none hover:bg-slate-800 transition-colors"
        >
          <FiArrowLeft className="mr-2" size={16} />
          Return to Catalog
        </Link>
      </div>
    </div>
  );

  const discountPercentage = book?.oldPrice && book?.newPrice 
    ? Math.round(((book.oldPrice - book.newPrice) / book.oldPrice) * 100) 
    : null;

  const savings = book?.oldPrice && book?.newPrice 
    ? (book.oldPrice - book.newPrice).toFixed(2)
    : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/" 
              className="inline-flex items-center text-slate-600 hover:text-slate-900 font-medium"
            >
              <FiArrowLeft className="mr-2" size={18} />
              Back to Catalog
            </Link>
            
            <nav className="text-sm text-slate-500">
              <Link to="/" className="hover:text-slate-700">Books</Link>
              <span className="mx-2">/</span>
              <span className="text-slate-900">{book?.title}</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Product Images */}
          <div className="lg:col-span-5">
            <div className="sticky top-8">
              <div className="aspect-[3/4] bg-slate-50 border border-slate-200">
                {!imageLoaded && (
                  <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center">
                    <div className="text-slate-400">Loading...</div>
                  </div>
                )}
                
                <img
                  src={getImgUrl(book?.coverImage)}
                  alt={book?.title}
                  className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&h=700&fit=crop";
                    e.target.onerror = null;
                    setImageLoaded(true);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="lg:col-span-7">
            <div className="space-y-6">
              
              {/* Product Title & Author */}
              <div>
                <h1 className="text-3xl font-semibold text-slate-900 mb-3 leading-tight">
                  {book?.title}
                </h1>
                
                {book?.author && (
                  <p className="text-lg text-slate-600 mb-4">
                    by <span className="font-medium">{book.author}</span>
                  </p>
                )}
                
                {book?.category && (
                  <div className="inline-flex items-center">
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-none border border-slate-200">
                      {book.category.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="border-t border-b border-slate-200 py-6">
                <div className="flex items-baseline space-x-4">
                  <span className="text-3xl font-semibold text-slate-900">
                    ${book?.newPrice}
                  </span>
                  
                  {book?.oldPrice && book?.oldPrice !== book?.newPrice && (
                    <>
                      <span className="text-xl text-slate-500 line-through">
                        ${book.oldPrice}
                      </span>
                      <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded-none">
                        Save ${savings}
                      </span>
                    </>
                  )}
                </div>
                
                {discountPercentage && (
                  <p className="text-sm text-slate-600 mt-2">
                    {discountPercentage}% discount applied
                  </p>
                )}
                
                {/* Total Price Preview */}
                {quantity > 1 && (
                  <div className="mt-4 p-3 bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">
                        Total for {quantity} items:
                      </span>
                      <span className="text-lg font-semibold text-slate-900">
                        ${(book?.newPrice * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Purchase Options */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-slate-700">Quantity:</label>
                  <div className="flex items-center border border-slate-300">
                    <button
                      onClick={decreaseQuantity}
                      className="px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className="w-16 px-3 py-2 text-center border-0 focus:outline-none focus:ring-0 text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={increaseQuantity}
                      className="px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity >= 99}
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Quantity indicator */}
                  <span className="text-sm text-slate-500">
                    {quantity} {quantity === 1 ? 'item' : 'items'}
                  </span>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleAddToCart(book)}
                    disabled={isAdding}
                    className={`flex-1 bg-slate-900 text-white px-6 py-4 font-medium hover:bg-slate-800 transition-colors ${
                      isAdding ? 'bg-green-600 hover:bg-green-600' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2 ">
                      {isAdding ? (
                        <FiCheck size={18} />
                      ) : (
                        <FiShoppingCart size={18} />
                      )}
                      <span>
                        {isAdding 
                          ? `Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to Cart` 
                          : `Add ${quantity} to Cart`
                        }
                      </span>
                    </div>
                  </button>
                
                </div>
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-slate-200">
                <div className="text-center">
                  <FiTruck className="mx-auto text-slate-600 mb-2" size={20} />
                  <p className="text-xs font-medium text-slate-900">Free Shipping</p>
                  <p className="text-xs text-slate-600">On orders over $25</p>
                </div>
                <div className="text-center">
                  <FiShield className="mx-auto text-slate-600 mb-2" size={20} />
                  <p className="text-xs font-medium text-slate-900">Secure Payment</p>
                  <p className="text-xs text-slate-600">256-bit SSL encrypted</p>
                </div>
                <div className="text-center">
                  <FiRefreshCw className="mx-auto text-slate-600 mb-2" size={20} />
                  <p className="text-xs font-medium text-slate-900">Easy Returns</p>
                  <p className="text-xs text-slate-600">30-day return policy</p>
                </div>
              </div>

              {/* Product Details Tabs */}
              <div>
                <div className="border-b border-slate-200">
                  <nav className="flex space-x-8">
                    {[
                      { id: 'overview', label: 'Overview' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? 'border-slate-900 text-slate-900'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="py-6">
                  {activeTab === 'overview' && (
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-700 leading-relaxed">
                        {book?.description || 'Product description not available.'}
                      </p>
                    </div>
                  )}
                  
                  {activeTab === 'specifications' && (
                    <div className="space-y-4">
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm font-medium text-slate-900">Author</dt>
                          <dd className="text-sm text-slate-600">{book?.author || 'Not specified'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-slate-900">Category</dt>
                          <dd className="text-sm text-slate-600">{book?.category || 'General'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-slate-900">Publication Date</dt>
                          <dd className="text-sm text-slate-600">
                            {book?.createdAt ? new Date(book.createdAt).toLocaleDateString() : 'Not specified'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-slate-900">Format</dt>
                          <dd className="text-sm text-slate-600">Paperback</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-slate-900">Language</dt>
                          <dd className="text-sm text-slate-600">English</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-slate-900">Pages</dt>
                          <dd className="text-sm text-slate-600">{book?.pages || 'Not specified'}</dd>
                        </div>
                      </dl>
                    </div>
                  )}
                  
                  {activeTab === 'shipping' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Shipping Information</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Free standard shipping on orders over $25</li>
                          <li>• Express shipping available for $9.99</li>
                          <li>• International shipping rates apply</li>
                          <li>• Orders processed within 1-2 business days</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Return Policy</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• 30-day return window</li>
                          <li>• Items must be in original condition</li>
                          <li>• Free return shipping for defective items</li>
                          <li>• Refunds processed within 5-7 business days</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SingleBook;