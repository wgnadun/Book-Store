import {createBrowserRouter} from 'react-router-dom';
import App from '../App';
import Home from '../pages/home/Home';
import Login from '../components/Login';
import Register from '../components/Register';
import CartPage from '../pages/books/CartPage';
import CheckoutPage from '../pages/books/CheckoutPage';
import SingleBook from '../pages/books/SingleBook';
import PrivateRoutes from './PrivateRoutes';
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
                element : <PrivateRoutes><CheckoutPage/></PrivateRoutes>// Cart component, you can replace it with your own component
            },{
                path:'/books/:id',
                element : <SingleBook/>// Cart component, you can replace it with your own component
            }
        ]
    },
]);

export default router;