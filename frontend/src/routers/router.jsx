import {createBrowserRouter} from 'react-router-dom';
import App from '../App';

const router =createBrowserRouter([
    {
        path: '/',
        element:<App/>, // App component
        children:[
            {
                path: '/', 
                element: <h1>Home</h1> // Home component, you can replace it with your own component
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