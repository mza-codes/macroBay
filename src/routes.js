import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
import { UserPage} from './pages/User';
import Login from './pages/Login';
import NotFound, { ErrorLogo } from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';
import UserError from './pages/UserError';
import { useContext } from 'react';
import { User } from './Contexts/UserContext';
import { SingleProduct } from './Contexts/ProductContext';
import ProductView from './pages/ProductView';
import CreatePost from './pages/CreatePost';

// ----------------------------------------------------------------------

export default function Router() {
  const {user} = useContext(User)
  const {singleItem} = useContext(SingleProduct)
  let productRoute
  let loginRoute
  let signupRoute
  let createPost
  user ? loginRoute = <UserError /> : loginRoute = <Login />
  user ? signupRoute = <UserError /> : signupRoute = <Register />
  user ? createPost = <CreatePost /> : createPost = <Login />
  if (singleItem!=null){
    productRoute =  <ProductView />
  }else{
    productRoute =  <ErrorLogo />
  }
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <Products /> },
        { path: 'blog', element: <Blog /> },
        { path: 'viewproduct', element: productRoute },
        { path: 'create', element: createPost }
      ],
    },
    {
      path: 'login',
      element: loginRoute,
    },
    {
      path: 'register',
      element: signupRoute ,
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/products" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
