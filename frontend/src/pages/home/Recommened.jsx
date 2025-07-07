import React, { useState } from 'react';
import BookCard from '../books/BookCard';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// import required modules
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Recommended = () => {
  const [showMore, setShowMore] = useState(false);
  const { data } = useFetchAllBooksQuery();
 
  const books = Array.isArray(data) ? data : data?.books || [];
  const recommendedBooks = books.slice(8, 18);
  
  // Initially show only first 3 books, or all if showMore is true
  const initialDisplayCount = 3;
  const booksToDisplay = showMore ? recommendedBooks : recommendedBooks.slice(0, initialDisplayCount);
  const hasMoreBooks = recommendedBooks.length > initialDisplayCount;
  
  const handleViewMoreClick = () => {
    setShowMore(true);
  };

  return (
    <div className="text-white">
      <div className="py-12">
        <div className="container mx-auto">
          {/* Section Header with Accent */}
          <div className="flex items-center justify-between mb-8 border-b border-gray-700 pb-4">
            <h2 className="text-2xl font-bold text-black relative">
              Recommended for you
            </h2>
          </div>

          {/* Swiper for initial display with autoplay */}
          {!showMore && (
            <div className="mb-8">
              <Swiper
                slidesPerView={1}
                spaceBetween={20}
                navigation={false}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                loop={recommendedBooks.length > 3}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },
                  1280: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                  }
                }}
                modules={[Pagination, Autoplay]}
                className="mySwiper"
              >
                {recommendedBooks.length > 0 && recommendedBooks.map((book, index) => (
                  <SwiperSlide key={index}>
                    <div className="flex justify-center">
                      <BookCard book={book} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          {/* Grid layout when "View More" is clicked */}
          {showMore && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-8">
              {recommendedBooks.length > 0 && recommendedBooks.map((book, index) => (
                <div key={index} className="flex justify-center">
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          )}

          {/* View More Button - Centered */}
          {hasMoreBooks && !showMore && (
            <div className="flex justify-center">
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
          {recommendedBooks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No recommended books available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommended;