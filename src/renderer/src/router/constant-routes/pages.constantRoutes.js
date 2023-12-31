/*
 * @Description:
 * @Author: zby
 * @Date: 2022-03-10 17:57:35
 * @FilePath: \tfl-client\src\router\constant-routes\pages.constantRoutes.js
 * @LastEditors: zby
 * @Reference:
 */
const Home = () => import('@/views/home/home.vue');

export default [
  {
    path: '/',
    redirect: 'home',
  },

  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
];
