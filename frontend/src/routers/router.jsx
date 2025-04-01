import {createBrowserRouter} from 'react-router-dom';
import App from '../App';
import Home from '../pages/home/Home';
import Login from '../components/Login';
import Register from '../components/Register';
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
            }
        ]
    },
]);

export default router;