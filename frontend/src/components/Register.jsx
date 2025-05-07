import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [message, setMessage] = useState("");
  const {registerUser} = useAuth()

  const { register,
          handleSubmit, 
          watch, 
          formState: { errors } 
        } = useForm();


        // register user with email and password

        const onSubmit =async(data) =>{
          console.log(data);

          try {
            await registerUser(data.email,data.password)
            alert("User registered successfully")
          } catch (error) {
            setMessage("please provide valid email and password")
          }
        } 

        const handleGoogleSignIn =()=>{
          
        }
      
  return (
    <div className='h-[calc(100vh-120px)] flex justify-center items-center'>
    <div className='w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <h2 className='text-xl font-semibold mb-4'>Please Register </h2>
        <form onSubmit={handleSubmit(onSubmit)}>

            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="email">Email</label>
              <input
                {...register("email", { required: true })}
                type="email" name='email' id='email' placeholder='Email Address'
                className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow' /> 
            </div>

            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="password">Password</label>
              <input 
                {...register("password", { required: true })}
                type="password" name='password' id='password' placeholder='Password'
                className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow ' /> 
            </div>
              {
                message && <p className='text-red-500 text-xs italic mb-3'>{message}</p>
              }

            <div>
                  <button className='bg-blue-500 hover:bg-blue-700 border-none text-white font-bold py-2 px-8 rounded focus:outline-none' >Register</button>
            </div>
      
          </form>

          <p className='align-baseline font-medium mt-4 text-sm'>Have an account ? Please <Link to="/Login" className='text-blue-500 hover:text-blue-700'>Login</Link></p>
         
          {/* Google sign in option */}
              <div className='mt-4'>
                <button 
                onClick={handleGoogleSignIn}
                className='w-full flex flex-wrap gap-1 items-center justify-center bg-secondary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none'>
                      <FcGoogle className='mr-2 size-5'/>
                      <p>Sign in with Google </p> 
                </button>
              </div>

              <p className='mt-5 text-center text-gray-500 text-xs'>@2025 Book STore. All rights reserved.</p>
    </div>

</div>
  )
}

export default Register
