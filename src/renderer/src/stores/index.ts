/*
 * @Description:
 * @Author: zby
 * @Date: 2023-05-30 11:04:21
 * @LastEditors: zby
 * @Reference:
 */
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import initAppStore from '@/api/insert-global-val';
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const usePinia = app => {
  app.use(pinia);
  initAppStore();
};
export { pinia, usePinia };
