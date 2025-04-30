// ✅ 1. RTK Query API Setup (books.Api.js)
// 🔹 fetchBaseQuery({...})
// Purpose: Creates a base fetch function used by all API endpoints.

// Key parts:

// baseUrl: Sets the base URL for all API requests, e.g., http://localhost:5000/api/books.

// credentials: 'include': Ensures cookies (e.g., for sessions) are sent with each request.

// prepareHeaders: Automatically adds an Authorization header if a token is found in localStorage.

// 🔹 createApi({...})
// Purpose: Initializes the API slice using RTK Query.

// Key Options:

// reducerPath: 'booksApi': The key under which the API slice is added to the Redux store.

// baseQuery: The fetchBaseQuery we defined earlier.

// tagTypes: ['Books']: Declares a tag type used for caching and invalidating data.

// endpoints: Defines how the app will fetch data from the API.

// 🔹 fetchAllBooks Endpoint
// js
// Copy
// Edit
// fetchAllBooks : builder.query({
//     query : () => "/",
//     providesTags : ["Books"]
// })
// Purpose: Defines a GET request to fetch all books (GET /api/books/).

// providesTags: Tells RTK Query to tag this data as 'Books' for cache management.

// useFetchAllBooksQuery: Auto-generated hook to use in React components.

// ❗ Fix Suggestion
// You currently have:

// js
// Copy
// Edit
// query :() =>({
//     query :() => "/",
//     providesTags : ["Books"]
// })
// This is nested incorrectly.

// ✅ Correct version:

// js
// Copy
// Edit
// fetchAllBooks : builder.query({
//     query : () => "/",
//     providesTags : ["Books"]
// })
// ✅ 2. Redux Store Setup (store.js)
// 🔹 configureStore({ ... })
// Creates the central Redux store with:

// js
// Copy
// Edit
// reducer: {
//     cart: cartReducer,
//     [booksApi.reducerPath]: booksApi.reducer,
// },
// Purpose: Combines multiple reducers:

// cart: Your custom cart slice.

// booksApi.reducerPath: Dynamically adds the RTK Query reducer for book API state.

// 🔹 Middleware Configuration
// js
// Copy
// Edit
// middleware : (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(booksApi.middleware)
// Purpose: Adds RTK Query middleware to handle async requests, caching, and re-fetching logic automatically.

// 🔚 Summary

// Component	Purpose
// fetchBaseQuery	Sets up API fetch config (base URL, auth headers, cookies)
// createApi	Defines the structure and endpoints of your API
// fetchAllBooks	A query endpoint for fetching all books
// useFetchAllBooksQuery	A hook to fetch books in React components
// configureStore	Creates the Redux store with both cart and API reducers
// booksApi.middleware	Enables RTK Query features like caching, refetching
// Would you like a sample React component using useFetchAllBooksQuery to display books?