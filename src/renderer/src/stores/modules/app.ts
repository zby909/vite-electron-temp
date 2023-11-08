/*
 * @Description:
 * @Author: zby
 * @Date: 2023-05-26 16:44:40
 * @LastEditors: zby
 * @Reference:
 */
// Pinia Store
import { defineStore } from 'pinia';
import { pinia } from '@/stores/index';
import { getLanguage } from '@/lang/index';
import homeApi from '@/api/modules/home.api';

interface State {
  isMainWin: boolean;
  parentWinId: number;
  thisBrowserId: number | string;
  windowId: string;
  serverPort: number | string;
  appVersion: string;
  baseServiceUrl: string;
  language: string;
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): State => ({
    /* 初始化应用时需要刷新时保存持久化的参数 */
    isMainWin: true, //是否是主窗口
    parentWinId: -1, //electron当前窗口的父窗口id
    thisBrowserId: '', //electron当前的窗口id
    windowId: '', //这里的window_id和define项目里面的uuid功能相同，都是为了区分不同的主窗口的
    serverPort: '', //服务器的端口号
    appVersion: '', //当前前端程序的版本号
    baseServiceUrl: '', //当前服务的地址
    language: getLanguage(),
    /* 初始化应用时需要刷新时保存持久化的参数 */
  }),
  actions: {
    // 使用 `$reset` 可以轻松重置 state
    // clearUser() {
    //   this.$reset();
    // },
    UPDATA_ISMAINWIN(val) {
      this.isMainWin = val;
    },
    UPDATA_PARENTWINID(val) {
      this.parentWinId = val;
    },
    UPDATA_THISBROWSERWINDOWID(val) {
      this.thisBrowserId = val;
    },
    UPDATA_WINDOWID(val) {
      this.windowId = val;
    },
    UPDATA_SERVERURLPORT(val) {
      this.serverPort = val;
    },
    UPDATA_APPVERSION(val) {
      this.appVersion = val;
    },
    UPDATA_BASESERVICEURL(val) {
      this.baseServiceUrl = val;
    },
    SET_LANGUAGE(language) {
      this.language = language;
      localStorage.setItem('language', language);
    },
    ping() {
      homeApi.ping();
    },
  },
  persist: {
    key: 'pinia_app',
    storage: sessionStorage,
  },
});

// Need to be used outside the setup
export function useAppStoreWithOut() {
  return useAppStore(pinia);
}
