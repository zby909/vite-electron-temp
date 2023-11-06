/*
 * @Description:
 * @Author: zby
 * @Date: 2023-05-26 15:41:29
 * @LastEditors: zby
 * @Reference:
 */
import { createRouter, createWebHashHistory } from 'vue-router';
import pageRoute from './constant-routes/pages.constantRoutes.js';
import otherRoute from './constant-routes/other.constantRoutes.js';

const routes = [...pageRoute, ...otherRoute];
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});
router.addRoute({ path: '/:catchAll(.*)', redirect: '/404' });

export default router;
