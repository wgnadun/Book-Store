import React, { useEffect, useState } from 'react'
import InputField from '../addBook/InputField'
import SelectField from '../addBook/SelectField'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import { useFetchBookByIdQuery, useUpdateBookMutation } from '../../../redux/features/books/booksApi'
import Loading from '../../../components/Loading'
import Swal from 'sweetalert2'
import axios from 'axios'
import getBaseUrl from '../../../utils/baseURL'

const UpdateBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState('');

    const { data: bookData, isLoading, isError, refetch } = useFetchBookByIdQuery(id);
    const [updateBook] = useUpdateBookMutation();
    
    const { register, handleSubmit, setValue, reset, formState: { errors }, watch } = useForm();

    // Watch the coverImage field to update preview
    const coverImageValue = watch('coverImage');

    // Populate form when book data is loaded
    useEffect(() => {
        if (bookData) {
            console.log('Book data loaded:', bookData); // Debug log
            
            // Set individual form values using setValue
            setValue('title', bookData.title || '');
            setValue('description', bookData.description || '');
            setValue('category', bookData.category || '');
            setValue('oldPrice', bookData.oldPrice || '');
            setValue('newPrice', bookData.newPrice || '');
            setValue('coverImage', bookData.coverImage || '');
            setValue('trending', bookData.trending || false);
            
            // Set image preview
            setImagePreview(bookData.coverImage || '');
        }
    }, [bookData, setValue])

    // Update image preview when coverImage changes
    useEffect(() => {
        if (coverImageValue && coverImageValue !== imagePreview) {
            setImagePreview(coverImageValue);
        }
    }, [coverImageValue, imagePreview]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const updateBookData = {
            title: data.title,
            description: data.description,
            category: data.category,
            trending: data.trending,
            oldPrice: Number(data.oldPrice),
            newPrice: Number(data.newPrice),
            coverImage: data.coverImage || bookData.coverImage,
        };

        try {
            await axios.put(
                `${getBaseUrl()}/api/books/edit/${id}`,
                updateBookData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            
            await refetch();
            
            Swal.fire({
                title: "Success!",
                text: "The book has been successfully updated",
                icon: "success",
                confirmButtonColor: "#6d28d9",
                confirmButtonText: "View All Books",
                showCancelButton: true,
                cancelButtonText: "Stay Here",
                cancelButtonColor: "#475569",
                background: "#0f172a",
                color: "#e2e8f0"
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/dashboard/manage-book');
                }
            });
        } catch (error) {
            console.error("Failed to update book:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to update book. Please try again.",
                icon: "error",
                confirmButtonColor: "#dc2626",
                background: "#0f172a",
                color: "#e2e8f0"
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleCancel = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Any unsaved changes will be lost!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6d28d9",
            confirmButtonText: "Yes, discard changes",
            cancelButtonText: "No, continue editing",
            background: "#0f172a",
            color: "#e2e8f0"
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/dashboard/manage-book');
            }
        });
    }

    if (isLoading) return <Loading />
    if (isError) return (
        <div className="flex flex-col items-center justify-center h-64 bg-slate-900 rounded-lg border border-red-800 backdrop-blur-sm shadow-lg shadow-red-900/20">
            <div className="text-white text-xl font-semibold mb-2">Error fetching book data</div>
            <p className="text-slate-200 mb-4">Unable to load book information. Please try again later.</p>
            <button 
                onClick={() => refetch()} 
                className="px-4 py-2 bg-violet-700 text-white rounded-lg hover:bg-violet-600 transition-colors duration-300 shadow-lg shadow-violet-900/50"
            >
                Retry
            </button>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto md:p-6 p-4 bg-gradient-to-br from-gray-900 to-slate-900 rounded-xl shadow-2xl text-white border border-gray-800 backdrop-filter backdrop-blur-sm">
            <div className="flex items-center justify-between mb-8 border-b border-slate-700 pb-5">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-1 bg-gradient-to-b from-violet-500 to-purple-700 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-violet-300">Update Book Details</h2>
                </div>
                <span className="px-4 py-1.5 bg-violet-900/60 text-violet-200 text-sm font-medium rounded-full border border-violet-700/50 shadow-inner shadow-violet-800/30">
                    ID: {id.substring(0, 8)}...
                </span>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Section - Form */}
                <div className="md:col-span-2">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="transition-all duration-300 hover:translate-x-1 hover:shadow-lg focus-within:translate-x-1 focus-within:shadow-lg">
                            <InputField
                                label="Book Title"
                                name="title"
                                placeholder="Enter book title"
                                register={register}
                                required="Title is required"
                                error={errors.title?.message}
                            />
                        </div>

                        <div className="transition-all duration-300 hover:translate-x-1 hover:shadow-lg focus-within:translate-x-1 focus-within:shadow-lg">
                            <InputField
                                label="Description"
                                name="description"
                                placeholder="Enter book description"
                                type="textarea"
                                register={register}
                                required="Description is required"
                                error={errors.description?.message}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="transition-all duration-300 hover:translate-x-1 hover:shadow-lg focus-within:translate-x-1 focus-within:shadow-lg">
                                <SelectField
                                    label="Category"
                                    name="category"
                                    options={[
                                        { value: '', label: 'Choose A Category' },
                                        { value: 'business', label: 'Business' },
                                        { value: 'technology', label: 'Technology' },
                                        { value: 'fiction', label: 'Fiction' },
                                        { value: 'horror', label: 'Horror' },
                                        { value: 'adventure', label: 'Adventure' },
                                    ]}
                                    register={register}
                                    required="Please select a category"
                                    error={errors.category?.message}
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm font-medium text-white ml-1">Pricing</label>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="transition-all duration-300 hover:translate-x-1 hover:shadow-lg focus-within:translate-x-1 focus-within:shadow-lg">
                                        <InputField
                                            label=""
                                            name="oldPrice"
                                            type="number"
                                            placeholder="Old Price"
                                            register={register}
                                            required="Old price is required"
                                            error={errors.oldPrice?.message}
                                        />
                                    </div>

                                    <div className="transition-all duration-300 hover:translate-x-1 hover:shadow-lg focus-within:translate-x-1 focus-within:shadow-lg">
                                        <InputField
                                            label=""
                                            name="newPrice"
                                            type="number"
                                            placeholder="New Price"
                                            register={register}
                                            required="New price is required"
                                            error={errors.newPrice?.message}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="transition-all duration-300 hover:translate-x-1 hover:shadow-lg focus-within:translate-x-1 focus-within:shadow-lg">
                            <InputField
                                label="Cover Image URL"
                                name="coverImage"
                                type="text"
                                placeholder="Enter image URL"
                                register={register}
                                required="Cover image URL is required"
                                error={errors.coverImage?.message}
                            />
                        </div>

                        <div className="flex items-center p-3 bg-slate-800/40 rounded-lg border border-slate-700/50 hover:border-violet-700/50 transition-colors duration-300 shadow-md">
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register('trending')}
                                    className="rounded bg-slate-700 border-slate-600 text-violet-500 focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-slate-800 w-5 h-5"
                                />
                                <span className="ml-2 text-sm font-medium text-white">Mark as Trending</span>
                            </label>
                            <div className="ml-2 group relative">
                                <span className="text-violet-300 cursor-help">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </span>
                                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 invisible group-hover:visible bg-slate-950 text-white text-xs rounded py-2 px-3 w-48 z-10 shadow-lg border border-violet-900/50">
                                    <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-950 border-r border-b border-violet-900/50"></div>
                                    Trending books will be featured on the homepage
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-4 pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex-1 py-3 bg-gradient-to-r from-violet-700 to-purple-700 text-white font-medium rounded-lg hover:from-violet-600 hover:to-purple-600 focus:ring-4 focus:ring-violet-800 transition duration-300 shadow-lg shadow-purple-900/30 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </span>
                                ) : 'Update Book'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 focus:ring-4 focus:ring-slate-600 transition duration-300 shadow-lg shadow-slate-900/30 border border-slate-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
                
                {/* Right Section - Cover Preview */}
                <div className="md:col-span-1">
                    <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-lg transform transition-all duration-500 hover:scale-[1.02] hover:shadow-violet-900/20">
                        <h3 className="text-lg font-medium text-white mb-4 border-b border-slate-800 pb-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Cover Preview
                        </h3>
                        {imagePreview ? (
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-700 to-violet-700 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                                <div className="relative bg-slate-900 rounded-lg overflow-hidden">
                                    <img 
                                        src={imagePreview} 
                                        alt="Book Cover" 
                                        className="w-full h-64 object-cover shadow-md transition-transform duration-500 group-hover:scale-105" 
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://via.placeholder.com/300x400?text=Image+Not+Found";
                                        }}
                                    />
                                    {watch('trending') && (
                                        <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs px-3 py-1 rounded-full shadow-lg shadow-amber-900/50 backdrop-blur-sm">
                                            <div className="flex items-center space-x-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                </svg>
                                                <span>Trending</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-64 bg-slate-800 rounded-lg border-2 border-dashed border-slate-700 group transition-all duration-300 hover:border-violet-600">
                                <div className="text-center">
                                    <svg className="mx-auto h-12 w-12 text-slate-500 group-hover:text-violet-400 transition-colors duration-300" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p className="mt-2 text-sm text-white group-hover:text-violet-300 transition-colors duration-300">No image available</p>
                                </div>
                            </div>
                        )}
                        
                        <div className="mt-6 bg-slate-800/60 rounded-lg p-4 border border-slate-700/50">
                            <h4 className="font-medium text-white mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Book Details
                            </h4>
                            <ul className="space-y-2 text-sm">
                                <li className="flex justify-between items-center bg-slate-900/40 p-2 rounded-md">
                                    <span className="text-slate-400">Title:</span>
                                    <span className="font-medium truncate max-w-[150px] text-white">{watch('title') || 'N/A'}</span>
                                </li>
                                <li className="flex justify-between items-center bg-slate-900/40 p-2 rounded-md">
                                    <span className="text-slate-400">Category:</span>
                                    <span className="font-medium capitalize text-white">{watch('category') || 'N/A'}</span>
                                </li>
                                <li className="flex justify-between items-center bg-slate-900/40 p-2 rounded-md">
                                    <span className="text-slate-400">Original Price:</span>
                                    <span className="font-medium text-white">${watch('oldPrice') || '0.00'}</span>
                                </li>
                                <li className="flex justify-between items-center bg-slate-900/40 p-2 rounded-md">
                                    <span className="text-slate-400">Sale Price:</span>
                                    <span className="font-medium text-emerald-400">${watch('newPrice') || '0.00'}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateBook;