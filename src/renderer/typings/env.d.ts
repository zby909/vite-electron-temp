/*
 * @Description:
 * @Author: zby
 * @Date: 2023-05-26 11:52:06
 * @LastEditors: zby
 * @Reference:
 */
/// <reference types="vite/client" />
import 'pinia';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

import type { GMessage } from '@/plugins/insert-to-vue';
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $tools: (typeof import('@/utils/export-vue'))['default'];
    $g_message: GMessage;
  }
}
