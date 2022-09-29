// component
import { useContext } from 'react';
import { User } from 'src/Contexts/UserContext';
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

// let loginNav
// if (user) {
//   loginNav = {
//     title: 'product',
//     path: '/dashboard/products',
//     icon: getIcon('eva:shopping-bag-fill')
//   }
// } else {
//   loginNav = {
//     title: 'login',
//     path: '/login',
//     icon: getIcon('eva:lock-fill'),
//   }
// }

const navConfig = [
  {
    title: 'products',
    path: '/dashboard/products',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'users',
    path: '/dashboard/user',
    icon: getIcon('eva:people-fill'),
  },
  
  {
    title: 'sell',
    path: '/dashboard/create',
    icon: getIcon('bi:file-earmark-post-fill'),
  },
  
  {
    title: 'blog',
    path: '/dashboard/blog',
    icon: getIcon('eva:file-text-fill'),
  },
  {
    title: 'login',
    path: '/login',
    icon: getIcon('eva:lock-fill'),
  },
  {
    title: 'register',
    path: '/register',
    icon: getIcon('eva:person-add-fill'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: getIcon('eva:alert-triangle-fill'),
  },
];

export const navConfig2 = [
  {
    title: 'products',
    path: '/dashboard/products',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: 'profile',
    path: '/dashboard/profile',
    // icon: getIcon('charm:person'),
    icon: getIcon('bi:person-fill')
  },
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  
  {
    title: 'users',
    path: '/dashboard/user',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'sell',
    path: '/dashboard/create',
    icon: getIcon('fluent:document-add-20-filled'),
  },
  {
    title: 'blog',
    path: '/dashboard/blog',
    icon: getIcon('eva:file-text-fill'),
  },
  {
    title: 'images',
    path: '/images',
    icon: getIcon('ic:round-collections'),
  },
  
];

export default navConfig;
