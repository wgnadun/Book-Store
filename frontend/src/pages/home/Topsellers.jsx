import React, { useState } from 'react'
import BookCard from '../books/BookCard';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';

const categories = ["Choose a genre", "Business", "Fiction", "Horror", "Adventure"];

const Topsellers = () => {
  const [selectedCategory, setSelectedCategory] = useState("Choose a genre");
  const [showMore, setShowMore] = useState(false);
  const { data } = useFetchAllBooksQuery();

  const books = Array.isArray(data) ? data : data?.books || [];
  
  const filteredBooks = selectedCategory === "Choose a genre" 
    ? books 
    : books.filter((book) => book.category === selectedCategory.toLowerCase());
  
  // Initially show only first 6 books, or all if showMore is true
  const initialDisplayCount = 6;
  const booksToDisplay = showMore ? filteredBooks : filteredBooks.slice(0, initialDisplayCount);
  const hasMoreBooks = filteredBooks.length > initialDisplayCount;
  
  const handleViewMoreClick = () => {
    setShowMore(true);
  };

  return (
    <div className=" text-white">
      <div className="py-12">
        <div className="container mx-auto">
          {/* Section Header with Accent */}
          <div className="flex items-center justify-between mb-8 border-b border-gray-700 pb-4">
            <h2 className="text-2xl font-bold text-black relative">
              Top Sellers
            </h2>
            
            {/* Filter System for Category */}
            <div className="relative">
              <select 
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setShowMore(false); // Reset showMore when category changes
                }}
                name="category" 
                id="category" 
                className="appearance-none bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer text-gray-200 font-medium text-sm"
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Books Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-8">
            {booksToDisplay.length > 0 && booksToDisplay.map((book, index) => (
              <div key={index} className="flex justify-center ">
                <BookCard book={book} />
              </div>
            ))}
          </div>

          {/* View More Button */}
          {hasMoreBooks && !showMore && (
            <div className="flex justify-center pb-8">
                          <button 
              onClick={handleViewMoreClick}
              className="border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-medium py-2 px-4 rounded-md transition-all duration-200 flex items-center text-sm"
            >
              View More
              <svg className="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            </div>
          )}

          {/* No Books Found Message */}
          {filteredBooks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No books found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Topsellers