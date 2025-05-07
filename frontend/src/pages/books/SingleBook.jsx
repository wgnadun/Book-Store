import React from 'react'
import { getImgUrl } from '../../Utils/getImgUrl'
import { FiShoppingCart } from 'react-icons/fi'
import { useParams } from 'react-router-dom'
import   { addToCart }  from '../../redux/features/cart/cartSlice'
import { useFetchBookByIdQuery } from '../../redux/features/cart/booksApi'
import { useDispatch } from 'react-redux'


const SingleBook = () => {

        const {id} = useParams();
        const {data,isLoading,isError} = useFetchBookByIdQuery(id);
       
        const book = data?.book || data; /// this is very important to get the book data from the response
        const dispatch = useDispatch();
  
        const handleAddToCart = (product)=> {
            dispatch(addToCart(product))

          }      
          
                  if(isLoading) return <div>Loading...</div>
                  if(isError)  return <div>Error happening to load book information</div>

  return (
           <div className='max-w-lg shadow-md p-5'>
                <h1 className="text-2xl font-bold mb-6">{book?.title}</h1>

                     <div className=''>
                        <div>
                          <img  src={`${getImgUrl(book?.coverImage)}`}
                                alt={book.title}
                                className='mb-8'      
                          />
                        </div>

                        <div className="mb-5">
                          <p className="text-gray-700 mb-2"><strong>Author: </strong> {book?.author || 'Admin'}</p>

                          <p className="text-gray-700 mb-4">
                               <strong>Published: </strong>{new Date(book?.createdAt).toLocaleDateString()}
                          </p>

                           <p className="text-gray-700 mb-4 capitalize">
                                <strong>Category:  </strong>{book?.category }
                           </p>

                           <p className="text-gray-700">
                                <strong>Description: </strong>{book?.description }
                           </p>
                        </div>

                        <button 
                             onClick={()=>handleAddToCart(book)}
                             className="btn- bg-primary   py-2 rounded-md text-base font-secondary font-bold hover:bg-secondary hover:text-white transition-all duration-200 cursor-pointer px-6 space-x-1 flex items-center gap-1 ">
                               <FiShoppingCart className="" />
                               <span>Add to Cart</span>
                             </button>


                   </div>
           </div>
  )
 
}

export default SingleBook 
