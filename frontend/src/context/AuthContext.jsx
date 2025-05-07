import { createUserWithEmailAndPassword } from "firebase/auth";
import { createContext, useState } from "react";
import { auth } from "../firebase/firebase.config"; //import firebase auth instance
import { useContext } from "react"; //import useContext hook from react

//create a context for auth
const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

//AuthProvider component to wrap around the app and provide auth context to all components

export const AuthProvider = ({children})=>{   //here children is the props that we pass to the AuthProvider component in App.jsx
           
    const [currentUser,setCurrentUser]= useState(null); //to store the current user
    const [loading,setLoading] = useState(true); //to store the loading state
   
    //register function to create a new user with email and password
    const registerUser =async (email,password) => {
        return await createUserWithEmailAndPassword(auth,email, password)
    }
   
   
   
    const value ={
             
        currentUser, //current user object
        registerUser
        
        }
          
            return(
                //children is the props that we pass to the AuthProvider component in App.jsx
                <AuthContext.Provider value={value}> 
                    {children} 
                </AuthContext.Provider>
            )
}