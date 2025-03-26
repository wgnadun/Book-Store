import {createBrowserRouter} from 'react-router-dom';
import App from '../App';
import Home from '../pages/home/Home';

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
            }
        ]
    },
]);

export default router;