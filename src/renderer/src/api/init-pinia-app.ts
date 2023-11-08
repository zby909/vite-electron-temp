/*
 * @Description: 创建窗口时初始化pinia值
 * @Author: zby
 * @Date: 2022-04-27 16:29:04
 * @FilePath: \tfl-client\src\api\insert-global-val.js
 * @LastEditors: zby
 * @Reference:
 */
import { useAppStore } from '@/stores/modules/app';
import { getParamFormUrl } from '@/api/get-param-fromurl';

export const initAppStore = () => {
  const { oldVuex, windowId, serverPort, thisBrowserId, parentWinId, appVersion, baseServiceUrl, isMainWin } = getParamFormUrl();
  //如果本地存储中没有appVersion，说明是第一次打开，需要手动写入pinia;
  //如果本地存储中有appVersion，说明不是第一次打开，这时候pinia持久化插件会自动将本地存储的值写入pinia,不需要手动写入
  if (!Object.hasOwn(oldVuex, 'appVersion')) {
    console.log('写入pinia');
    const appStore = useAppStore();
    // 写入pinia
    appStore.UPDATA_WINDOWID(windowId);
    appStore.UPDATA_SERVERURLPORT(serverPort);
    appStore.UPDATA_THISBROWSERWINDOWID(thisBrowserId);
    appStore.UPDATA_PARENTWINID(parentWinId);
    appStore.UPDATA_APPVERSION(appVersion);
    appStore.UPDATA_BASESERVICEURL(baseServiceUrl);
    appStore.UPDATA_ISMAINWIN(isMainWin);
  }
};
