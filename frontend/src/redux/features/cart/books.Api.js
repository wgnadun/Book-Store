import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import getBaseUrl  from '../../../utils/getBaseUrl';

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
            })
        })
    })
})


export const {useFetchAllBooksQuery} = booksApi
export default booksApi;




// fetchBaseQuery(): A lightweight wrapper around fetch, used to make API requests.

// baseUrl: Sets the base path for all API calls (e.g., http://localhost:5000/api/books).

// credentials: 'include': Sends cookies (if any) along with requests.

// prepareHeaders: Adds an Authorization header to every request if a token is stored.