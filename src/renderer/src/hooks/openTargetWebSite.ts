/*
 * @Description:
 * @Author: zby
 * @Date: 2024-01-18 16:51:45
 * @LastEditors: zby
 * @Reference:
 */
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/modules/app';
import { useWinStore } from '@/stores/modules/win';
const appStore = useAppStore();
const winStore = useWinStore();
const { thisBrowserId } = storeToRefs(appStore);

export default async () => {
  const winId = await window.electronAPI.ipcRenderer.invoke('createNewWindow', {
    browserWindowOpt: { parentWinId: thisBrowserId.value, minWidth: 0, minHeight: 0 },
    // outUrl: 'https://baidu.com',
    outUrl: 'https://juejin.cn/',
  });
  winStore.UPDATA_TARGETWINID(winId);
  console.log(winId);
};
