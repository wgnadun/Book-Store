import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config"; //import firebase auth instance
import { useContext } from "react"; //import useContext hook from react
import { signOut } from "firebase/auth"; //import signOut function from firebase auth
//create a context for auth
const AuthContext = createContext();
//google provider for google sign in
const googleProvider = new GoogleAuthProvider();

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
   
   //logging the user in

   const loginUser = async (email,password) =>{
         return await signInWithEmailAndPassword(auth,email,password)
   }
   
   //sign in with google

   const signInWithGoogle = async () =>{
                    googleProvider.setCustomParameters({
                prompt: "select_account"
                });

            return await signInWithPopup(auth,googleProvider)
   }
    
   //logout the user
    const logout = () =>{
     return signOut(auth)
    }

    // maanage user 
    useEffect (()=>{
        const unsubscribe = onAuthStateChanged(auth,(user)=>{
            setCurrentUser(user);
            setLoading(false);

            if(user){
                const {email,displayName,photoURL} = user ; 
                const userData = {
                    email,username: displayName,photo:photoURL
                }
            }
        })

        return () => unsubscribe() ;
    },[])

    const value ={
             
        currentUser, //current user object
        registerUser,
        loginUser,
        signInWithGoogle,
        logout
        
        }
          
            return(
                //children is the props that we pass to the AuthProvider component in App.jsx
                <AuthContext.Provider value={value}> 
                    {children} 
                </AuthContext.Provider>
            )
}

