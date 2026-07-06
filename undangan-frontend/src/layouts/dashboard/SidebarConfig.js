import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
// import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
// import lockFill from '@iconify/icons-eva/lock-fill';
// import personAddFill from '@iconify/icons-eva/person-add-fill';
// import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';
import payment from '@iconify/icons-ic/payment';
import messageSquareFill from '@iconify/icons-eva/message-square-fill';
import clockFill from '@iconify/icons-eva/clock-fill';
import personFill from '@iconify/icons-eva/person-fill';
import cameraFill from '@iconify/icons-eva/camera-fill';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'beranda',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill),
  },
  {
    title: 'undangan',
    path: '/dashboard/invitation',
    icon: getIcon(fileTextFill),
  },
  {
    title: 'tamu acara',
    path: '/dashboard/guest',
    icon: getIcon(peopleFill),
  },
  {
    title: 'Acara',
    path: '/dashboard/event',
    icon: getIcon(clockFill),
  },
  {
    title: 'Gallery Photo',
    path: '/dashboard/gallery',
    icon: getIcon(cameraFill),
  },
  {
    title: 'Kartu Ucapan',
    path: '/dashboard/comment',
    icon: getIcon(messageSquareFill),
  },
  {
    title: 'pembayaran',
    path: '/dashboard/payment',
    icon: getIcon(payment),
  },
  {
    title: 'profile',
    path: '/dashboard/profile',
    icon: getIcon(personFill),
  },
  // {
  //   title: 'user',
  //   path: '/dashboard/user',
  //   icon: getIcon(peopleFill),
  // },
  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: getIcon(shoppingBagFill),
  // },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: getIcon(fileTextFill),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: getIcon(lockFill)
  // },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon(personAddFill)
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon(alertTriangleFill)
  // }
];

export default sidebarConfig;
