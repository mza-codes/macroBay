import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
// import { UserPage } from './pages/Userv2';
import { UserPage } from './pages/User';
import Login from './pages/Login';
import NotFound, { ErrorLogo } from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';
import UserError from './pages/UserError';
import { useContext, useEffect } from 'react';
import { User } from './Contexts/UserContext';
import { SingleProduct } from './Contexts/ProductContext';
import ProductView from './pages/ProductView';
import CreatePost from './pages/CreatePost';
import Result from './pages/ResultV2';
import Profile from './pages/Profile';
import ImageView from './pages/ImageView';
import ImgSingleView from './pages/ImgSingleView';
import EditProfile from './pages/ProfileEdit';
import MyPosts from './pages/MyPosts';

// ----------------------------------------------------------------------

export default function Router() {

  const { user } = useContext(User)
  const { singleItem } = useContext(SingleProduct)
  let admin = false
  if (user) {
    if (user.email.includes("macrobay")) {
      admin = true
    } else {
      admin = false
    }
  }
  let usersRoute = <ErrorLogo />, postsRoute = <ErrorLogo />
  let productRoute = <ErrorLogo />, resultRoute = <Result />, profileRoute
  let loginRoute = <Login />, createPost, signupRoute = <Register />
  user ? loginRoute = <UserError /> : loginRoute = <Login />
  user ? createPost = <CreatePost /> : createPost = <Navigate to='/login' />
  user ? signupRoute = <UserError /> : signupRoute = <Register />
  user ? profileRoute = <Profile /> : profileRoute = <Navigate to='/login' />
  user ? postsRoute = <MyPosts/> : postsRoute = <Navigate to='/login' />
  admin ? usersRoute = <UserPage /> : usersRoute = <ErrorLogo />
  
  if (singleItem != null) {
    productRoute = <ProductView />
  } else {
    productRoute = <ErrorLogo />
  }

  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: usersRoute },
        { path: 'products', element: <Products /> },
        { path: 'blog', element: <Blog /> },
        { path: 'viewproduct', element: productRoute },
        { path: 'create', element: createPost },
        { path: 'result', element: resultRoute },
        { path: 'profile', element: profileRoute },
        // { path: 'editProfile', element: editProfile },
      ],
    },
    { path: 'myposts', element: postsRoute },
    { path: 'imagesingle', element: <ImgSingleView /> },
    { path: 'images', element: <ImageView /> },
    {
      path: 'login',
      element: loginRoute,
    },
    {
      path: 'register',
      element: signupRoute,
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
