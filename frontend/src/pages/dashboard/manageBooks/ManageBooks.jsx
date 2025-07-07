import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDeleteBookMutation, useFetchAllBooksQuery } from '../../../redux/features/books/booksApi';
import { getImgUrl } from '../../../utils/getImgUrl';

const ManageBooks = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);

    const {data, refetch, isLoading, error} = useFetchAllBooksQuery();

    // More flexible data extraction - try multiple possible structures
    let books = [];
    if (data) {
        if (Array.isArray(data)) {
            books = data;
        } else if (data.books && Array.isArray(data.books)) {
            books = data.books;
        } else if (data.data && Array.isArray(data.data)) {
            books = data.data;
        } else if (data.result && Array.isArray(data.result)) {
            books = data.result;
        }
    }

    // Filter books based on search and category
    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             book.author?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Get unique categories for filter
    const categories = [...new Set(books.map(book => book.category).filter(Boolean))];

    const [deleteBook] = useDeleteBookMutation();

    // Handle deleting a book with confirmation
    const handleDeleteClick = (book) => {
        setBookToDelete(book);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteBook(bookToDelete._id || bookToDelete.id).unwrap();
            alert('Book deleted successfully!');
            refetch();
            setShowDeleteModal(false);
            setBookToDelete(null);
        } catch (error) {
            console.error('Failed to delete book:', error.message);
            alert('Failed to delete book. Please try again.');
        }
    };

    // Show loading state
    if (isLoading) {
        return (
            <section className="py-2 sm:py-4 lg:py-8 bg-gray-900 min-h-screen">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
                    <div className="bg-gray-800 rounded-lg sm:rounded-xl shadow-xl sm:shadow-2xl border border-gray-700 p-4 sm:p-6 lg:p-8">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-blue-400 mx-auto"></div>
                            <p className="mt-3 sm:mt-4 text-gray-300 text-sm sm:text-base lg:text-lg">Loading books...</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Show error state
    if (error) {
        return (
            <section className="py-2 sm:py-4 lg:py-8 bg-gray-900 min-h-screen">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
                    <div className="bg-gray-800 rounded-lg sm:rounded-xl shadow-xl sm:shadow-2xl border border-gray-700 p-4 sm:p-6 lg:p-8">
                        <div className="text-center text-red-400">
                            <div className="mb-4 sm:mb-6">
                                <svg className="mx-auto h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">Error Loading Books</h2>
                            <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">{error.message || 'An unexpected error occurred while loading books.'}</p>
                            <button 
                                onClick={refetch}
                                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-sm sm:text-base"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-2 sm:py-4 lg:py-8 bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
                <div className="space-y-4 sm:space-y-6">
                    {/* Header Section */}
                    <div className="bg-gray-800 rounded-lg sm:rounded-xl shadow-xl sm:shadow-2xl border border-gray-700 overflow-hidden">
                        <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6 border-b border-gray-700">
                            <div className="flex flex-col space-y-3 sm:space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                                    <div className="min-w-0 flex-1">
                                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">Book Management</h1>
                                        <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
                                            Organize and manage your book inventory with ease
                                        </p>
                                    </div>
                                    <div className="flex flex-row sm:flex-col lg:flex-row items-start sm:items-end lg:items-center space-x-2 sm:space-x-0 lg:space-x-4 space-y-0 sm:space-y-2 lg:space-y-0">
                                        <div className="text-xs sm:text-sm text-gray-400 bg-gray-700 px-2 sm:px-3 py-1 sm:py-2 rounded-md sm:rounded-lg whitespace-nowrap">
                                            <span className="font-medium text-white">{filteredBooks.length}</span> of{' '}
                                            <span className="font-medium text-white">{books.length}</span> books
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Search and Filter Section */}
                        <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 bg-gray-750 border-b border-gray-700">
                            <div className="flex flex-col space-y-3 sm:space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                                {/* Search Input */}
                                <div className="flex-1 relative">
                                    <svg className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search books by title or author..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-gray-700 border border-gray-600 rounded-md sm:rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm sm:text-base"
                                    />
                                </div>
                                
                                {/* Category Filter */}
                                <div className="md:w-40 lg:w-48">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-700 border border-gray-600 rounded-md sm:rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm sm:text-base"
                                    >
                                        <option value="all">All Categories</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Books Table/Cards */}
                    <div className="bg-gray-800 rounded-lg sm:rounded-xl shadow-xl sm:shadow-2xl border border-gray-700 overflow-hidden">
                        {/* Desktop Table View - Hidden on mobile and tablet */}
                        <div className="hidden xl:block overflow-x-auto">
                            <table className="w-full divide-y divide-gray-700">
                                <thead className="bg-gray-750">
                                    <tr>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">#</th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Book Details</th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Category</th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Price</th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">
                                    {filteredBooks.map((book, index) => (
                                        <tr key={book._id || book.id || index} className="hover:bg-gray-750 transition-colors duration-200">
                                            <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-8 lg:h-12 lg:w-9 flex-shrink-0 bg-gray-700 rounded-md lg:rounded-lg overflow-hidden shadow-sm">
                                                        {book.coverImage ? (
                                                            <img 
                                                                src={book?.coverImage} 
                                                                alt={book?.title}
                                                                className="h-10 w-8 lg:h-12 lg:w-9 object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-8 lg:h-12 lg:w-9 bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                                                                <svg className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-3 lg:ml-4 min-w-0 flex-1">
                                                        <div className="text-sm font-semibold text-white max-w-xs truncate">
                                                            {book.title || 'Untitled'}
                                                        </div>
                                                        {book.author && (
                                                            <div className="text-xs lg:text-sm text-gray-400">
                                                                by {book.author}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-200 border border-blue-800/50">
                                                    {book.category || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm font-bold text-green-400">
                                                ${book.newPrice || book.price || '0.00'}
                                            </td>
                                            <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2 lg:space-x-3">
                                                    <Link
                                                        to={`/dashboard/edit-book/${book._id || book.id}`}
                                                        className="inline-flex items-center px-2 lg:px-3 py-1.5 lg:py-2 border border-gray-600 text-xs lg:text-sm font-medium rounded-md lg:rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 hover:border-gray-500 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                                                    >
                                                        <svg className="w-3 h-3 lg:w-4 lg:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDeleteClick(book)}
                                                        className="inline-flex items-center px-2 lg:px-3 py-1.5 lg:py-2 border border-red-600 text-xs lg:text-sm font-medium rounded-md lg:rounded-lg text-red-400 bg-gray-700 hover:bg-red-900/50 hover:border-red-500 hover:text-red-300 transition-all duration-200 shadow-sm hover:shadow-md"
                                                    >
                                                        <svg className="w-3 h-3 lg:w-4 lg:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile and Tablet Card View */}
                        <div className="xl:hidden divide-y divide-gray-700">
                            {filteredBooks.map((book, index) => (
                                <div key={book._id || book.id || index} className="p-3 sm:p-4 hover:bg-gray-750 transition-colors duration-200">
                                    <div className="flex items-start space-x-3 sm:space-x-4">
                                        {/* Book Cover */}
                                        <div className="h-14 w-10 sm:h-16 sm:w-12 lg:h-20 lg:w-14 flex-shrink-0 bg-gray-700 rounded-md sm:rounded-lg overflow-hidden shadow-sm">
                                            {book.coverImage ? (
                                                <img 
                                                    src={getImgUrl(book?.coverImage)} 
                                                    alt={book?.title}
                                                    className="h-14 w-10 sm:h-16 sm:w-12 lg:h-20 lg:w-14 object-cover"
                                                />
                                            ) : (
                                                <div className="h-14 w-10 sm:h-16 sm:w-12 lg:h-20 lg:w-14 bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                                                    <svg className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Book Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                                                        {book.title || 'Untitled'}
                                                    </h3>
                                                    {book.author && (
                                                        <p className="text-xs sm:text-sm text-gray-400 truncate mt-0.5 sm:mt-1">by {book.author}</p>
                                                    )}
                                                    
                                                    {/* Category and Price - Mobile Layout */}
                                                    <div className="flex flex-col xs:flex-row xs:items-center xs:space-x-3 space-y-1.5 xs:space-y-0 mt-2">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-200 border border-blue-800/50 w-fit">
                                                            {book.category || 'Uncategorized'}
                                                        </span>
                                                        <span className="text-sm sm:text-base font-bold text-green-400 w-fit">
                                                            ${book.newPrice || book.price || '0.00'}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {/* Large screens show index number */}
                                                <div className="hidden lg:block text-xs text-gray-400 font-medium ml-2">
                                                    #{index + 1}
                                                </div>
                                            </div>
                                            
                                            {/* Action Buttons */}
                                            <div className="flex flex-col xs:flex-row items-stretch xs:items-center space-y-2 xs:space-y-0 xs:space-x-2 sm:space-x-3 mt-3 sm:mt-4">
                                                <Link
                                                    to={`/dashboard/edit-book/${book._id || book.id}`}
                                                    className="flex-1 xs:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-600 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 hover:border-gray-500 hover:text-white transition-all duration-200 shadow-sm"
                                                >
                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit Book
                                                </Link>
                                                <button 
                                                    onClick={() => handleDeleteClick(book)}
                                                    className="flex-1 xs:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-red-600 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg text-red-400 bg-gray-700 hover:bg-red-900/50 hover:border-red-500 hover:text-red-300 transition-all duration-200 shadow-sm"
                                                >
                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Empty State - No search results */}
                        {filteredBooks.length === 0 && books.length > 0 && (
                            <div className="text-center py-8 sm:py-12 px-4">
                                <div className="text-gray-500 mb-3 sm:mb-4">
                                    <svg className="mx-auto h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-base sm:text-lg font-medium text-white mb-2">No books match your search</h3>
                                <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">Try adjusting your search terms or filters.</p>
                                <button 
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('all');
                                    }}
                                    className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm sm:text-base"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}

                        {/* Empty State - No books at all */}
                        {filteredBooks.length === 0 && books.length === 0 && (
                            <div className="text-center py-8 sm:py-12 px-4">
                                <div className="text-gray-500 mb-3 sm:mb-4">
                                    <svg className="mx-auto h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-base sm:text-lg font-medium text-white mb-2">No books in your library yet</h3>
                                <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">Start building your collection by adding your first book.</p>
                                <div className="flex flex-col xs:flex-row items-center justify-center space-y-2 xs:space-y-0 xs:space-x-3 sm:space-x-4">
                                    <Link
                                        to="/dashboard/add-book"
                                        className="w-full xs:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-lg hover:shadow-xl text-sm sm:text-base text-center"
                                    >
                                        Add Your First Book
                                    </Link>
                                    <button 
                                        onClick={refetch}
                                        className="w-full xs:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium text-sm sm:text-base text-center"
                                    >
                                        Refresh
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
                    <div className="bg-gray-800 rounded-lg sm:rounded-xl shadow-2xl border border-gray-700 max-w-sm sm:max-w-md w-full mx-3 sm:mx-0">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center mb-3 sm:mb-4">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <h3 className="ml-2 sm:ml-3 text-base sm:text-lg font-semibold text-white">Confirm Deletion</h3>
                            </div>
                            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                                Are you sure you want to delete "<span className="font-medium text-white break-words">{bookToDelete?.title}</span>"? This action cannot be undone.
                            </p>
                            <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setBookToDelete(null);
                                    }}
                                    className="flex-1 px-3 sm:px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium text-sm sm:text-base"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium text-sm sm:text-base"
                                >
                                    Delete Book
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default ManageBooks