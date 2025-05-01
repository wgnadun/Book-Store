import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import  getBaseUrl  from '../../../utils/baseURL';

const baseQuery = fetchBaseQuery({
  
    baseUrl : `${getBaseUrl()}/api/books`,
    credentials : 'include',
    prepareHeaders : (Headers) => {
        const token = localStorage.getItem('token');
        if(token){
            Headers.set('Authorization',`Bearer ${token}`);
        }
        return Headers;
    }
})

const booksApi = createApi({
    reducerPath :'booksApi',
    baseQuery,
    tagTypes : ['Books'],
    endpoints : (builder) =>({


        fetchAllBooks : builder.query({
            query :() =>({
                query :() => "/",
                providesTags : ["Books"]
            }),
            fetchBookById: builder.query({
                query:(id) =>`/${id}`,
                providesTags: (results,error,id) =>[{type:"Books", id}],
            }),
            addBook: builder.mutation({
                query: (newBook) => ({
                    url:`/create-book`,
                    method: "POST",
                    body: newBook
                }),
                invalidatesTags: ['Books']

            }),
            updatedBook : builder.mutation({
                query : ({id,...rest}) =>({
                    url: `/edit/:${id}` ,
                    method : "PUT",
                    body: rest,
                    headers:{
                        'content-type' : 'application/json'
                    }
                }),
                invalidatesTags : ["Books"]
            }),
            deleteBook : builder.mutation({
                query : (id) =>({
                    url: `/${id}`,
                    method : "DELETE",
                }),
                invalidatesTags : ["Books"]
            })

        })
    })
})


export const {useFetchAllBooksQuery,useFetchBookByIdQuery,useAddBookMutations,useUpdateBookMutation,useDeleteBookMutation} = booksApi
export default booksApi;




// fetchBaseQuery(): A lightweight wrapper around fetch, used to make API requests.

// baseUrl: Sets the base path for all API calls (e.g., http://localhost:5000/api/books).

// credentials: 'include': Sends cookies (if any) along with requests.

// prepareHeaders: Adds an Authorization header to every request if a token is stored.