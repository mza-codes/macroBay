import { Navigate, useRoutes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ErrorLogo } from './pages/Errors/Page404';
import { BarLoader } from './pages/LoadingPage';
import { useAuthContext } from './Contexts/UserContext';
// layouts
const DashboardLayout = lazy(() => import('./layouts/dashboard'));
const LogoOnlyLayout = lazy(() => import('./layouts/LogoOnlyLayout'));
// Components
const Blog = lazy(() => import('./pages/Blog'));
const UserPage = lazy(() => import('./Admin/User'));
const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/Errors/Page404'));
const Register = lazy(() => import('./pages/Register'));
const Products = lazy(() => import('./pages/Products'));
const DashboardApp = lazy(() => import('./pages/DashboardApp'));
const ProductView = lazy(() => import('./pages/ProductViewV2'));
const CreatePost = lazy(() => import('./pages/CreatePost'));
const Result = lazy(() => import('./pages/Result/ResultV2'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const ImgSingleView = lazy(() => import('./pages/ImageViewer/ImgSingleView'));
const ImageView = lazy(() => import('./pages/ImageViewer/ImageView'));
const UserError = lazy(() => import('./pages/Errors/UserError'));
const MyPosts = lazy(() => import('./components/UserPosts/MyPosts'));

export default function Router() {
  const { user } = useAuthContext();
  let admin = false
  if (user) {
    let domain = user.email.split('@');
    if (domain[1] === "macrobay.org") {
      admin = true
    } else {
      admin = false
    };
  };

  const UserRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" />
    else return children;
  };

  const AuthRoute = ({ children }) => {
    if (user) return <UserError />
    else return children;
  };

  const AdminRoute = ({ children }) => {
    if (admin) return children
    else return <ErrorLogo />
  };

  return useRoutes([
    {
      path: '/dashboard',
      element:
        <Suspense fallback={<BarLoader />}>
          <DashboardLayout /> </Suspense>,
      children: [
        {
          path: 'app', element:
            <Suspense fallback={<BarLoader />}>
              <DashboardApp /> </Suspense>
        },
        {                               //navigates to all users info table
          path: 'user', element:
            <Suspense fallback={<BarLoader />}>
              <AdminRoute>
                <UserPage />
              </AdminRoute>
            </Suspense>
        },
        {
          path: 'products', element:
            <Suspense fallback={<BarLoader />}>
              <Products /> </Suspense>
        },
        {
          path: 'blog', element:
            <Suspense fallback={<BarLoader />}>
              <Blog /> </Suspense>
        },
        {
          path: 'viewproduct/:id', element:
            <Suspense fallback={<BarLoader />}>
              <ProductView /> </Suspense>
        },
        {
          path: 'create', element:
            <Suspense fallback={<BarLoader />}>
              <UserRoute >
                <CreatePost />
              </UserRoute>
            </Suspense>
        },
        {
          path: 'result', element:
            <Suspense fallback={<BarLoader />}>
              <Result />
            </Suspense>
        },
        {
          path: 'profile', element:
            <Suspense fallback={<BarLoader />}>
              <UserRoute >
                <Profile />
              </UserRoute>
            </Suspense>
        },
        // { path: 'editProfile', element: editProfile },
      ],
    },
    {
      path: 'myposts', element:
        <Suspense fallback={<BarLoader />}>
          <UserRoute >
            <MyPosts />
          </UserRoute>
        </Suspense>
    },
    {
      path: 'imagesingle', element:
        <Suspense fallback={<BarLoader />}>
          <ImgSingleView /> </Suspense>
    },
    {
      path: 'images', element:
        <Suspense fallback={<BarLoader />}>
          <ImageView /> </Suspense>
    },
    {
      path: 'login',
      element:
        <Suspense fallback={<BarLoader />}>
          <AuthRoute >
            <Login />
          </AuthRoute>
        </Suspense>,
    },
    {
      path: 'register',
      element:
        <Suspense fallback={<BarLoader />}>
          <AuthRoute >
            <Register />
          </AuthRoute>
        </Suspense>,
    },
    {
      path: '/',
      element:
        <Suspense fallback={<BarLoader />}>
          <LogoOnlyLayout />
        </Suspense>,
      children: [
        {
          path: '/', element:
            <Navigate to="/dashboard/products" />
        },
        {
          path: '404', element:
            <Suspense fallback={<BarLoader />}>
              <NotFound />
            </Suspense>
        },
        {
          path: '*', element: <Navigate to="/404" />
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
