import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { useCreateOrderMutation } from '../../redux/features/orders/ordersApi';

const CheckoutPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.newPrice * item.quantity, 0).toFixed(2);
  const { currentUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' });

  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  const onSubmit = async (data) => {
    const newOrder = {
      name: data.name,
      email: currentUser?.email,
      address: {
        street: data.street,
        city: data.city,
        country: data.country,
        state: data.state,
        zipcode: data.zipcode,
      },
      phone: data.phone,
      productIds: cartItems.map((item) => item?._id),
      totalPrice: totalPrice,
    };

    try {
      await createOrder(newOrder).unwrap();
      Swal.fire({
        title: 'Your Order has been placed successfully',
        icon: 'success',
        confirmButtonColor: '#008000',
      });

      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place an order');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
          <p className="text-gray-500 mt-2">Complete your purchase securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-indigo-600 px-6 py-4">
                <h2 className="font-semibold text-lg text-white">Order Summary</h2>
              </div>
              <div className="p-6">
                <div className="flex justify-between pb-4 border-b border-gray-100">
                  <span className="text-gray-600">Items ({cartItems.length})</span>
                  <span className="font-medium text-gray-800">${(totalPrice - 10).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-4 border-b border-gray-100">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-800">$10.00</span>
                </div>
                <div className="flex justify-between py-4">
                  <span className="text-gray-800 font-medium">Total</span>
                  <span className="font-bold text-indigo-600 text-xl">${totalPrice}</span>
                </div>
                <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-md p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-indigo-800">Payment on Delivery</h3>
                      <p className="text-sm text-indigo-600 mt-1">Your payment will be collected upon delivery of your order.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-lg text-gray-800">Delivery Information</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <h3 className="font-medium text-gray-900 mb-4">Personal Details</h3>
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        {...register('name', { required: true })}
                        type="text"
                        id="name"
                        className="h-10 border border-gray-300 rounded-md px-3 w-full"
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        className="h-10 border border-gray-300 rounded-md px-3 w-full bg-gray-50 cursor-not-allowed"
                        disabled
                        defaultValue={currentUser?.email}
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        {...register('phone', { required: true })}
                        type="tel"
                        id="phone"
                        className="h-10 border border-gray-300 rounded-md px-3 w-full"
                        placeholder="+1 (555) 000-0000"
                      />
                      {errors.phone && <p className="text-red-500 text-sm">Phone number is required</p>}
                    </div>

                    <div className="md:col-span-2 mt-4">
                      <h3 className="font-medium text-gray-900 mb-4">Shipping Address</h3>
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                      <input
                        {...register('street', { required: true })}
                        type="text"
                        id="street"
                        className="h-10 border border-gray-300 rounded-md px-3 w-full"
                        placeholder="Enter your street address"
                      />
                      {errors.street && <p className="text-red-500 text-sm">Street is required</p>}
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        {...register('city', { required: true })}
                        type="text"
                        id="city"
                        className="h-10 border border-gray-300 rounded-md px-3 w-full"
                        placeholder="Enter your city"
                      />
                      {errors.city && <p className="text-red-500 text-sm">City is required</p>}
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
                      <input
                        {...register('state', { required: true })}
                        type="text"
                        id="state"
                        className="h-10 border border-gray-300 rounded-md px-3 w-full"
                        placeholder="Enter your state"
                      />
                      {errors.state && <p className="text-red-500 text-sm">State is required</p>}
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <input
                        {...register('country', { required: true })}
                        type="text"
                        id="country"
                        className="h-10 border border-gray-300 rounded-md px-3 w-full"
                        placeholder="Enter your country"
                      />
                      {errors.country && <p className="text-red-500 text-sm">Country is required</p>}
                    </div>

                    <div>
                      <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-1">Postal / Zip Code</label>
                      <input
                        {...register('zipcode', { required: true })}
                        type="text"
                        id="zipcode"
                        className="h-10 border border-gray-300 rounded-md px-3 w-full"
                        placeholder="Enter your zip code"
                      />
                      {errors.zipcode && <p className="text-red-500 text-sm">Zip code is required</p>}
                    </div>

                    <div className="md:col-span-2 mt-4">
                      <div className="flex items-start">
                        <input
                          id="billing_same"
                          type="checkbox"
                          className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                          onChange={() => setIsChecked(!isChecked)}
                        />
                        <div className="ml-3 text-sm">
                          <label htmlFor="billing_same" className="text-gray-600">
                            I agree to the{' '}
                            <a href="#" className="text-indigo-600 hover:text-indigo-800">Terms & Conditions</a> and{' '}
                            <a href="#" className="text-indigo-600 hover:text-indigo-800">Shopping Policy</a>.
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={!isChecked || !isValid}
                      className={`w-full py-3 px-4 rounded-md shadow-sm text-white font-medium transition-all duration-200 ${
                        isChecked && isValid
                          ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
   