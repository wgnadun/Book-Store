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
import AdminLogin from '../components/AdminLogin';
import Dashboardlayout from '../pages/dashboard/Dashboardlayout';
import Dashboard from '../pages/dashboard/Dashboard';
import ManageBooks from '../pages/dashboard/manageBooks/ManageBooks';
import AddBook from '../pages/dashboard/addBook/addBook';
import UpdateBook from '../pages/dashboard/editBook/updateBook';

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
    },{
        path : '/admin',
        element : <AdminLogin/>
    }
    ,
    {
        path:'/dashboard',
        element: <AdminRoutes><Dashboardlayout/></AdminRoutes>,
        children:[
            {
              
            path :"",
            element: <AdminRoutes><Dashboard/></AdminRoutes>
            
            },{

            path:"add-new-book",
            element: <AdminRoutes><AddBook/></AdminRoutes>
            
            },{
                
            path:"edit-book/:id",
            element: <AdminRoutes><UpdateBook/></AdminRoutes>
            
            },{
                
            path:"manage-book",
            element: <AdminRoutes><ManageBooks/></AdminRoutes>
            
            }
        ]
    }
]);

export default router;