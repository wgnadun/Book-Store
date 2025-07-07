import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import getBaseUrl from '../../../utils/baseURL';

const baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/books`,
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
})

const booksApi = createApi({
    reducerPath: 'booksApi',
    baseQuery,
    tagTypes: ['Books'],
    endpoints: (builder) => ({
        fetchAllBooks: builder.query({
            query: () => "/",
            providesTags: ["Books"],
            transformResponse: (response) => {
                // Handle different response structures
                if (response?.books) {
                    return response.books;
                }
                if (response?.data) {
                    return response.data;
                }
                return response;
            },
        }),
        
        fetchBookById: builder.query({
            query: (id) => {
                return `/${id}`;
            },
            providesTags: (result, error, id) => [{ type: "Books", id }],
            transformResponse: (response, meta, arg) => {

                
                // Handle different response structures based on your backend
                if (response?.book) {
                    return response.book;
                }
                
                if (response?.data) {
                    return response.data;
                }
                
                // If response is already the book object
                if (response && typeof response === 'object' && response._id) {
                    return response;
                }
                
                return response;
            },
            transformErrorResponse: (response, meta, arg) => {
                // Return a more structured error
                return {
                    status: response?.status || 500,
                    data: {
                        message: response?.data?.message || response?.message || 'Failed to fetch book',
                        id: arg
                    }
                };
            },
            // Add retry logic for failed requests
            extraOptions: {
                maxRetries: 2,
            },
            // Force refetch when component mounts
            refetchOnMountOrArgChange: true,
        }),
        
        addBook: builder.mutation({
            query: (newBook) => ({
                url: `/create-book`,
                method: "POST",
                body: newBook
            }),
            invalidatesTags: ['Books'],
            transformResponse: (response) => {
                if (response?.book) {
                    return response.book;
                }
                if (response?.data) {
                    return response.data;
                }
                return response;
            }
        }),
        
        updateBook: builder.mutation({
            query: ({ id, ...rest }) => ({
                url: `/edit/${id}`,
                method: "PUT",
                body: rest,
                headers: {
                    'content-type': 'application/json'
                }
            }),
            invalidatesTags: ["Books"],
            transformResponse: (response) => {
                if (response?.book) {
                    return response.book;
                }
                if (response?.data) {
                    return response.data;
                }
                return response;
            }
        }),
        
        deleteBook: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Books"],
            transformResponse: (response) => {
                if (response?.book) {
                    return response.book;
                }
                if (response?.data) {
                    return response.data;
                }
                return response;
            }
        }),

        // Batch fetch books by IDs for better performance
        fetchBooksByIds: builder.query({
            query: (ids) => ({
                url: '/batch',
                method: 'POST',
                body: { ids }
            }),
            providesTags: (result, error, ids) => 
                ids ? ids.map(id => ({ type: 'Books', id })) : [],
            transformResponse: (response) => {
                if (response?.books) {
                    return response.books;
                }
                if (response?.data) {
                    return response.data;
                }
                return response;
            },
            transformErrorResponse: (response, meta, arg) => {

                return response;
            }
        })
    })
})

export const {
    useFetchAllBooksQuery,
    useFetchBookByIdQuery,
    useFetchBooksByIdsQuery,
    useAddBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation
} = booksApi

export default booksApi;