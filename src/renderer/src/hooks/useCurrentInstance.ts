/*
 * @Description:
 * @Author: zby
 * @Date: 2023-05-29 11:17:57
 * @LastEditors: zby
 * @Reference:
 */
import { ComponentInternalInstance, getCurrentInstance } from 'vue';
export default function useCurrentInstance() {
  const ctx = getCurrentInstance() as ComponentInternalInstance;
  const globalProperties = ctx.appContext.config.globalProperties;
  return {
    globalProperties,
    ctx,
  };
}
