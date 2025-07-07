import React, { useState } from 'react';
import InputField from './InputField';
import SelectField from './SelectField';
import { useForm } from 'react-hook-form';
import { useAddBookMutation } from '../../../redux/features/books/booksApi';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';

const AddBook = () => {
  // Form validation schema
  const schema = yup.object().shape({
    title: yup.string().required('Title is required').min(2, 'Title must be at least 2 characters'),
    description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
    category: yup.string().required('Please select a category'),
    oldPrice: yup.number().typeError('Old price must be a number').positive('Old price must be positive'),
    newPrice: yup.number().typeError('New price must be a number').positive('New price must be positive').required('New price is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      trending: false,
    }
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [addBook, { isLoading, isError, error }] = useAddBookMutation();

  // Watch form values for live validation feedback
  const watchFields = watch();

  const onSubmit = async (data) => {
    if (!imageFileName) {
      Swal.fire({
        title: "Image Required",
        text: "Please select a cover image",
        icon: "warning",
        confirmButtonColor: "#6d28d9",
        background: "#0f172a",
        color: "#e2e8f0"
      });
      return;
    }

    const newBookData = {
      ...data,
      coverImage: imageFileName
    };

    try {
      await addBook(newBookData).unwrap();
      // Success notification
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#0f172a",
        color: "#e2e8f0",
        iconColor: "#8b5cf6"
      });
      
      Toast.fire({
        icon: 'success',
        title: 'Book added successfully!'
      });
      
      // Reset form
      reset();
      setImageFileName('');
      setImageFile(null);
      setImagePreview('');
      
    } catch (err) {
      console.error("Failed to add book:", err);
      Swal.fire({
        title: "Error!",
        text: err?.data?.message || "Failed to add the book. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc2626",
        background: "#0f172a",
        color: "#e2e8f0"
      });
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          title: "File Too Large",
          text: "File size should not exceed 2MB",
          icon: "warning",
          confirmButtonColor: "#6d28d9",
          background: "#0f172a",
          color: "#e2e8f0"
        });
        e.target.value = null;
        return;
      }

      setImageFile(file);
      setImageFileName(file.name);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImageFileName('');
    setImagePreview('');
  };

  return (
    <div className="max-w-2xl mx-auto md:p-8 p-6 bg-gradient-to-br from-gray-900 to-slate-900 rounded-xl shadow-2xl text-white border border-gray-800 backdrop-filter backdrop-blur-sm">
      <div className="flex items-center justify-center mb-8">
        <div className="h-10 w-1 bg-gradient-to-b from-violet-500 to-purple-700 rounded-full mr-3"></div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-violet-300">Add New Book</h2>
      </div>
      
      {isError && (
        <div className="mb-6 p-4 bg-red-900/30 border border-indigo-700 text-red-200 rounded-lg shadow-lg animate-pulse">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p>Error: {error?.data?.message || "Something went wrong. Please try again."}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title Input */}
        <div className="transition-all duration-300 hover:translate-x-1 hover:shadow-lg focus-within:translate-x-1 focus-within:shadow-lg">
          <InputField
            label="Title"
            name="title"
            placeholder="Enter book title"
            register={register}
            error={errors.title?.message}
            required
            className="bg-slate-800/60 border-slate-700 text-white placeholder-slate-400 focus:border-violet-500 focus:ring-violet-500 shadow-inner shadow-slate-900/50 rounded-lg"
            labelClassName="text-white font-medium ml-1"
          />
        </div>

        {/* Description Input */}
        <div className="transition-all duration-300 hover:translate-x-1 hover:shadow-lg focus-within:translate-x-1 focus-within:shadow-lg">
          <InputField
            label="Description"
            name="description"
            placeholder="Enter book description"
            type="textarea"
            register={register}
            error={errors.description?.message}
            required
            rows={4}
            className="bg-slate-800/60 border-slate-700 text-white placeholder-slate-400 focus:border-violet-500 focus:ring-violet-500 shadow-inner shadow-slate-900/50 rounded-lg"
            labelClassName="text-white font-medium ml-1"
          />
        </div>

        {/* Category Select */}
       <div className="transition-all duration-300 hover:translate-x-1 hover:shadow-xl focus-within:translate-x-1 focus-within:shadow-xl">
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
      { value: 'biography', label: 'Biography' },
      { value: 'self-help', label: 'Self Help' },
      { value: 'mystery', label: 'Mystery' },
      { value: 'romance', label: 'Romance' },
    ]}
    register={register}
    error={errors.category?.message}
    required
    className="bg-slate-900 border border-slate-700 text-white placeholder-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/50 shadow-inner shadow-black/60 rounded-lg hover:border-violet-600/70 transition-all duration-300"
    labelClassName="text-violet-300 font-medium ml-1 mb-2"
    errorClassName="text-red-400 text-sm mt-2 ml-1"
  />
</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Old Price */}
          <div className="transition-all duration-300 hover:translate-x-1 hover:shadow-lg focus-within:translate-x-1 focus-within:shadow-lg">
            <InputField
              label="Old Price"
              name="oldPrice"
              type="number"
              placeholder="Original price (optional)"
              register={register}
              error={errors.oldPrice?.message}
              step="0.01"
              min="0"
              className="bg-slate-800/60 border-slate-700 text-white placeholder-slate-400 focus:border-violet-500 focus:ring-violet-500 shadow-inner shadow-slate-900/50 rounded-lg"
              labelClassName="text-white font-medium ml-1"
            />
          </div>

          {/* New Price */}
          <div className="transition-all duration-300 hover:translate-x-1 hover:shadow-lg focus-within:translate-x-1 focus-within:shadow-lg">
            <InputField
              label="New Price"
              name="newPrice"
              type="number"
              placeholder="Current price"
              register={register}
              error={errors.newPrice?.message}
              required
              step="0.01"
              min="0"
              className="bg-slate-800/60 border-slate-700 text-white placeholder-slate-400 focus:border-violet-500 focus:ring-violet-500 shadow-inner shadow-slate-900/50 rounded-lg"
              labelClassName="text-white font-medium ml-1"
            />
          </div>
        </div>

        {/* Trending Checkbox */}
        <div className="flex items-center p-4 bg-slate-800/40 rounded-lg border border-slate-700/50 hover:border-violet-700/50 transition-colors duration-300 shadow-md group">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register('trending')}
              className="rounded bg-slate-700 border-slate-600 text-violet-500 focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-slate-800 w-5 h-5"
            />
            <span className="ml-2 text-sm font-medium text-white">Mark as Trending</span>
          </label>
          <div className="text-xs text-violet-300 ml-3 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Featured books appear on the homepage
            </div>
          </div>
        </div>

        {/* Cover Image Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white ml-1 mb-2">
            Cover Image <span className="text-red-400">*</span>
          </label>
          
          <div className="mt-2">
            <div className="p-4 border-2 border-slate-700 border-dashed rounded-lg hover:border-violet-500 transition-colors duration-300 bg-slate-800/40">
              <div className="flex flex-col justify-center items-center space-y-3">
                {imagePreview ? (
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-700 to-violet-700 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Cover preview" 
                        className="h-48 w-auto object-contain rounded-md shadow-lg z-10 relative transition-all duration-300 group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute -top-2 -right-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full p-1.5 text-sm shadow-lg z-20 hover:from-red-500 hover:to-red-600 transition-all duration-300 hover:scale-110"
                        aria-label="Remove image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <svg className="h-16 w-16 text-slate-500 group-hover:text-violet-400 transition-colors duration-300" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-sm text-slate-400">
                      Click or drag to upload a cover image
                    </p>
                    <p className="text-xs text-slate-500">
                      PNG, JPG, GIF up to 2MB
                    </p>
                  </>
                )}
                
                <input
                  id="file-upload"
                  name="coverImage"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
                
                {!imagePreview && (
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer py-2 px-6 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-gradient-to-r from-violet-700 to-purple-700 hover:from-violet-600 hover:to-purple-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-slate-800"
                  >
                    Select File
                  </label>
                )}
              </div>
            </div>
          </div>
          
          {imageFileName && (
            <p className="mt-2 text-sm text-violet-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span className="truncate max-w-xs">Selected: {imageFileName}</span>
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={() => {
              reset();
              setImageFile(null);
              setImageFileName('');
              setImagePreview('');
            }}
            className="flex-1 py-3 px-4 border border-slate-700 rounded-lg shadow-lg text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-900 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Reset
          </button>
          
          <button
            type="submit"
            className="flex-1 py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-slate-900 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Adding...</span>
              </div>
            ) : (
              <span>Add Book</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;