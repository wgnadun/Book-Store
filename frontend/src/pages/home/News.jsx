import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import { Pagination, Autoplay, EffectCoverflow, Navigation, A11y } from 'swiper/modules';

// Images
import news1 from '../../assets/news/news-1.png';
import news2 from '../../assets/news/news-2.png';
import news3 from '../../assets/news/news-3.png';
import news4 from '../../assets/news/news-4.png';

// News data
const news = [
  {
    id: 1,
    title: 'Global Climate Summit Calls for Urgent Action',
    description: 'World leaders gather at the Global Climate Summit to discuss urgent strategies to combat climate change, focusing on reducing carbon emissions and fostering renewable energy solutions.',
    image: news1,
    category: 'Environment',
    date: '2025-05-10'
  },
  {
    id: 2,
    title: 'Breakthrough in AI Technology Announced',
    description: 'A major breakthrough in artificial intelligence has been announced by researchers, with new advancements promising to revolutionize industries from healthcare to finance.',
    image: news2,
    category: 'Technology',
    date: '2025-05-12'
  },
  {
    id: 3,
    title: 'New Space Mission Aims to Explore Distant Galaxies',
    description: 'NASA has unveiled plans for a new space mission that will aim to explore distant galaxies, with hopes of uncovering insights into the origins of the universe.',
    image: news3,
    category: 'Science',
    date: '2025-05-14'
  },
  {
    id: 4,
    title: 'Stock Markets Reach Record Highs Amid Economic Recovery',
    description: 'Global stock markets have reached record highs as signs of economic recovery continue to emerge following the challenges posed by the global pandemic.',
    image: news4,
    category: 'Finance',
    date: '2025-05-15'
  },
  {
    id: 5,
    title: 'Innovative New Smartphone Released by Leading Tech Company',
    description: 'A leading tech company has released its latest smartphone model, featuring cutting-edge technology, improved battery life, and a sleek new design.',
    image: news2,
    category: 'Technology',
    date: '2025-05-17'
  }
];

// Category color mapping - adjusted for dark theme
const categoryColors = {
  Environment: {
    bg: 'bg-emerald-900/40',
    text: 'text-emerald-400',
    gradient: 'from-emerald-500 to-teal-500',
    icon: '🌿'
  },
  Technology: {
    bg: 'bg-violet-900/40',
    text: 'text-violet-400',
    gradient: 'from-violet-500 to-purple-500',
    icon: '💻'
  },
  Science: {
    bg: 'bg-blue-900/40',
    text: 'text-blue-400',
    gradient: 'from-blue-500 to-cyan-500',
    icon: '🔬'
  },
  Finance: {
    bg: 'bg-amber-900/40',
    text: 'text-amber-400',
    gradient: 'from-amber-500 to-orange-500',
    icon: '📈'
  }
};

const formatDate = (dateString) => {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const News = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const swiperRef = useRef(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);

  // Responsive screen size handler
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle autoplay
  const toggleAutoplay = () => {
    if (swiperRef.current?.swiper) {
      const swiper = swiperRef.current.swiper;
      if (isAutoplayPaused) {
        swiper.autoplay.start();
      } else {
        swiper.autoplay.stop();
      }
      setIsAutoplayPaused(!isAutoplayPaused);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (swiperRef.current?.swiper) {
        if (e.key === 'ArrowLeft') swiperRef.current.swiper.slidePrev();
        if (e.key === 'ArrowRight') swiperRef.current.swiper.slideNext();
        if (e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          toggleAutoplay();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAutoplayPaused]);

  return (
    <section className="py-12 bg-gradient-to-br w-full px-4" aria-labelledby="news-section-title">
      <div className="max-w-7xl mx-auto mb-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 id="news-section-title" className="inline-block relative text-2xl font-bold text-gray-100 mb-3">
            <span className="relative z-10 inline-flex items-center text-black">
              <span className="mr-2">📰</span>
              <span>Latest News</span>
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-2"></div>
          <p className="text-black-300 mt-4 max-w-2xl mx-auto">
            Stay updated with the latest headlines and developments from around the world
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex space-x-2">
            <button 
              onClick={toggleAutoplay} 
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300"
              aria-label={isAutoplayPaused ? 'Resume autoplay' : 'Pause autoplay'}
            >
              {isAutoplayPaused ? (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <div className="text-sm text-black-300 flex items-center">
              <span className="hidden md:inline">Slide</span> {activeIndex + 1} of {news.length}
            </div>
          </div>

          <div className="flex space-x-4">
            {/* Previous Button */}
            <button className="swiper-button-prev-custom group" aria-label="Previous slide">
              <div className="flex items-center justify-center p-2 border bg-gray-800 backdrop-blur-sm rounded-md hover:border-white/50 transition-colors duration-300">
                <svg className="h-5 w-5 text-gray-300 group-hover:text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </button>

            {/* Next Button (same style, different arrow direction) */}
            <button className="swiper-button-next-custom group" aria-label="Next slide">
              <div className="flex items-center justify-center p-2 border bg-gray-800 backdrop-blur-sm rounded-md hover:border-white/50 transition-colors duration-300">
                <svg className="h-5 w-5 text-gray-300 group-hover:text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Swiper */}
        <Swiper
          ref={swiperRef}
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView={isLargeScreen ? 'auto' : 1}
          coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 2, slideShadows: false }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
            renderBullet: (index, className) =>
              `<span class="${className} !bg-blue-500 !w-3 !h-3"></span>`,
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          navigation={{ prevEl: '.swiper-button-prev-custom', nextEl: '.swiper-button-next-custom' }}
          speed={800}
          loop
          modules={[EffectCoverflow, Pagination, Autoplay, Navigation, A11y]}
          className="news-swiper"
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          a11y={{
            prevSlideMessage: 'Previous slide',
            nextSlideMessage: 'Next slide',
            firstSlideMessage: 'This is the first slide',
            lastSlideMessage: 'This is the last slide',
          }}
          style={{ width: '100%', padding: '50px 0 70px' }}
        >
          {news.map((item, index) => {
            const catStyle = categoryColors[item.category] || {
              bg: 'bg-gray-700/40',
              text: 'text-gray-300',
              gradient: 'from-gray-500 to-slate-500',
              icon: '📄'
            };
            return (
              <SwiperSlide
                key={item.id}
                style={{ width: isLargeScreen ? '80%' : '100%', maxWidth: '700px' }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={`flex flex-col md:flex-row items-stretch bg-gray-800 border border-gray-700 rounded-xl transition-all duration-500 ease-out ${hoveredIndex === index ? 'scale-105 shadow-lg shadow-blue-900/20' : ''}`} style={{ height: 'auto' }}>
                  {/* Image */}
                  <div className="w-full md:w-2/5 h-48 md:h-auto relative group overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/70 to-transparent z-10"></div>
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                    <span className={`absolute top-4 left-4 ${catStyle.bg} ${catStyle.text} text-xs font-semibold py-1.5 px-3 rounded-full z-20 flex items-center backdrop-blur-sm`}>
                      <span className="mr-1">{catStyle.icon}</span>
                      {item.category}
                    </span>

                  </div>

                  {/* Content */}
                  <div className="p-6 w-full md:w-3/5 flex flex-col justify-center">
                    <Link to={`/news/${item.id}`} className="block mb-3 group" aria-label={`Read article: ${item.title}`}>
                      <h3 className="text-xl font-bold text-gray-200 group-hover:text-blue-400 transition-colors">{item.title}</h3>
                    </Link>
                    <div className={`w-16 h-1 bg-gradient-to-r ${catStyle.gradient} mb-4 rounded-full`}></div>
                    <p className="text-gray-400 mb-5">{item.description}</p>
                    <div className="flex items-center mt-auto">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-400">{formatDate(item.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* CSS for animations */}
        <style jsx>{`
          .ticker-wrap {
            width: 100%;
            overflow: hidden;
            height: 1.5rem;
          }
          
          .ticker {
            display: inline-block;
            white-space: nowrap;
            padding-right: 100%;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
            animation-name: ticker;
            animation-duration: 5s;
          }
          
          .ticker-item {
            display: inline-block;
            padding: 0 1.5rem;
          }
          
          @keyframes ticker {
            0% {
              transform: translate3d(0, 0, 0);
            }
            
            100% {
              transform: translate3d(-50%, 0, 0);
            }
          }
          
          /* Custom pagination style */
          :global(.swiper-pagination-bullet) {
            background: rgba(156, 163, 175, 0.5) !important;
          }
          
          :global(.swiper-pagination-bullet-active) {
            background: rgb(59, 130, 246) !important;
          }
        `}</style>
      </div>
    </section>
  );
};

export default News;