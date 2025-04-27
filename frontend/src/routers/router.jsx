import {createBrowserRouter} from 'react-router-dom';
import App from '../App';
import Home from '../pages/home/Home';
import Login from '../components/Login';
import Register from '../components/Register';
import CartPage from '../pages/books/CartPage';
import CheckoutPage from '../pages/books/CheckoutPage';
const router =createBrowserRouter([
    {
        path: '/',
        element:<App/>, // App component
        children:[
            {
                path: '/', 
                element: <Home/> // Home component, you can replace it with your own component
            },
            {
                path: '/orders',
                element:<div>Orders</div>
            },
            {
                path:'/about',
                element:<div>About</div>
            },{
                path:'/login',
                element:<Login/> // Login component, you can replace it with your own component
            },{
                path:'/register',
                element:<Register/> // Register component, you can replace it with your own component
            },{
                path :'/cart',
                element :<CartPage/>// Cart component, you can replace it with your own component
            },{
                path:'/checkout',
                element : <CheckoutPage/>// Cart component, you can replace it with your own component
            }
        ]
    },
]);

export default router;