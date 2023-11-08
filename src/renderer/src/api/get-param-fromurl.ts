/*
 * @Description: 获取创建窗口时通过url传递的参数
 * @Author: zby
 * @Date: 2023-11-07 17:46:25
 * @LastEditors: zby
 * @Reference:
 */
import packageConfig from '../../../../package.json';
import { getParam } from '@/utils/http-tools';
const IS_DEV = ['development'].includes(import.meta.env.MODE);

export const getParamFormUrl = () => {
  console.log('获取创建窗口时通过url传递的参数');
  const storedValue = sessionStorage.getItem('pinia_app');
  const oldVuex = storedValue ? JSON.parse(storedValue) : {};
  const windowId = getParam('windowId') ?? oldVuex.windowId; //这里的window_id和define项目里面的uuid功能相同，都是为了区分不同的主窗口的
  const serverPort = getParam('serverPort') ? Number(getParam('serverPort')) : oldVuex.serverPort; //服务器端口
  const thisBrowserId = getParam('thisBrowserId') ? Number(getParam('thisBrowserId')) : oldVuex.thisBrowserId; //electron当前的窗口id
  const parentWinId = getParam('parentWinId') ? Number(getParam('parentWinId')) : oldVuex.parentWinId; //electron当前的窗口的父窗口id
  const appVersion = packageConfig.version;
  const baseServiceUrl = !IS_DEV ? `${import.meta.env.RENDERER_VITE_SERVICE_BASE_URL}:${serverPort}/api/` : '/api/';
  let isMainWin;
  if (parentWinId === -1) {
    isMainWin = true;
  } else {
    isMainWin = false;
  }
  return { oldVuex, windowId, serverPort, thisBrowserId, parentWinId, appVersion, baseServiceUrl, isMainWin };
};
