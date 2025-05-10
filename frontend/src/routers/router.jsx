import {createBrowserRouter} from 'react-router-dom';
import App from '../App';
import Home from '../pages/home/Home';
import Login from '../components/Login';
import Register from '../components/Register';
import CartPage from '../pages/books/CartPage';
import CheckoutPage from '../pages/books/CheckoutPage';
import SingleBook from '../pages/books/SingleBook';
import PrivateRoutes from './PrivateRoutes';
import OrderPage from '../pages/books/OrderPage';
import AdminRoutes from './AdminRoutes';


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
                element:<PrivateRoutes><OrderPage/></PrivateRoutes> // Order component, you can replace it with your own component
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
    {
        path:'/dashboard',
        element: <AdminRoutes><div>Admin Dashboard</div></AdminRoutes>,
        children:[
            {
                
            path :"",
            element: <AdminRoutes><div>DashBoardhome</div></AdminRoutes>
            
            },{

            path:"add-new-book",
            element: <AdminRoutes><div>Add new Book</div></AdminRoutes>
            
            },{
                
            path:"edit-book/:id",
            element: <AdminRoutes><div>Edit Book</div></AdminRoutes>
            
            },{
                
            path:"manage-book/:id",
            element: <div>Manage Book</div>
            
            }
        ]
    }
]);

export default router;