/*
 * @Description: 获取创建窗口时通过url传递的参数
 * @Author: zby
 * @Date: 2022-04-27 16:29:04
 * @FilePath: \tfl-client\src\api\insert-global-val.js
 * @LastEditors: zby
 * @Reference:
 */
import { useAppStoreWithOut } from '@/stores/modules/app';
import packageConfig from '../../../../package.json';
import { getParam } from '@/utils/http-tools';
const IS_PROD_OR_TEST = ['production', 'test'].includes(import.meta.env.MODE);

console.log('获取创建窗口时通过url传递的参数');
const storedValue = sessionStorage.getItem('pinia_app');
const oldVuex = storedValue ? JSON.parse(storedValue) : {};
const windowId = getParam('windowId') ?? oldVuex.windowId; //这里的window_id和define项目里面的uuid功能相同，都是为了区分不同的主窗口的
const serverPort = getParam('serverPort') ? Number(getParam('serverPort')) : oldVuex.serverPort; //服务器端口
const thisBrowserId = getParam('thisBrowserId') ? Number(getParam('thisBrowserId')) : oldVuex.thisBrowserId; //electron当前的窗口id
const parentWinId = getParam('parentWinId') ? Number(getParam('parentWinId')) : oldVuex.parentWinId; //electron当前的窗口的父窗口id
const baseServiceUrl = IS_PROD_OR_TEST ? `${import.meta.env.RENDERER_VITE_SERVICE_BASE_URL}:${serverPort}/api/` : '/api/';

//如果本地存储中没有appVersion，说明是第一次打开，需要写入pinia
setTimeout(() => {
  if (!Object.hasOwn(oldVuex, 'appVersion')) {
    console.log('写入pinia');
    const appStore = useAppStoreWithOut();
    // 写入vuex
    appStore.UPDATA_WINDOWID(windowId);
    appStore.UPDATA_SERVERURLPORT(serverPort);
    appStore.UPDATA_THISBROWSERWINDOWID(thisBrowserId);
    if (parentWinId === -1) {
      appStore.UPDATA_ISMAINWIN(true);
    } else {
      appStore.UPDATA_ISMAINWIN(false);
    }
    appStore.UPDATA_PARENTWINID(parentWinId);
    appStore.UPDATA_APPVERSION(packageConfig.version);
    appStore.UPDATA_BASESERVICEURL(baseServiceUrl);
  }
}, 0);

export { windowId, serverPort, thisBrowserId, parentWinId, baseServiceUrl };
