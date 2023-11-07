/*
 * @Description:
 * @Author: zby
 * @Date: 2023-05-26 11:52:06
 * @LastEditors: zby
 * @Reference:
 */
import 'normalize.css';
import '@/styles/index.scss';
import '@/styles/font/iconfont.css';
import '@/styles/font/iconfont.js';

import { createApp } from 'vue';
import { usePinia } from '@/stores/index';
import i18n from '@/lang/index';
import { registerGlobComp } from '@/components/index';
import { insertToVue } from '@/plugins/insert-to-vue';
import router from '@/router/index';

import App from '@/App.vue';
async function bootstrap() {
  const app = createApp(App);
  app.use(usePinia);
  app.use(i18n);
  app.use(registerGlobComp);
  app.use(insertToVue);
  app.use(router);
  app.mount('#app');
}

bootstrap();
