console.log('request.js');
import type { RequestType } from '~renderer/request';
/* 已与后端约定 200的result必有值*/
import axios from 'axios';
import Qs from 'qs';
import { useAppStore } from '@/stores/modules/app';
import { ElMessage, ElLoading } from 'element-plus';
// const osUserInfo: { [key: string]: any } = window.electronNodeAPI.osUserInfo;
// console.log(osUserInfo);
console.log(window, import.meta.env);

const appStore = useAppStore();
const g_showMsg: Array<string | undefined> = []; //记录需要错误提示的接口
const g_showLoadingApiNames: Array<string> = []; //记录需要loading提示的接口 (为了保证需要loading时间最长的那个接口完成后再close)
let g_showLoadingStatus;
function toLoading(url: string, msg = 'Loading...', delayLoadingTime = 600) {
  g_showLoadingApiNames.push(url);
  const g_showLoadingTimer = setTimeout(() => {
    g_showLoadingStatus = ElLoading.service({ lock: true, text: msg, background: 'rgba(0, 0, 0, 0.6)' });
  }, delayLoadingTime);
  return g_showLoadingTimer;
}

// 一个axios请求实例
function createAxios(baseServiceUrl) {
  const BaseService = axios.create({ baseURL: baseServiceUrl, timeout: 30 * 1000 });
  console.log('baseServiceUrl: ', baseServiceUrl);
  const requestType = {} as RequestType;
  requestType.getReq = async (url, params = {}, { showMsg = true, loading = false, loadingTxt, delayLoadingTime } = {}) => {
    showMsg && !g_showMsg.includes(url) && g_showMsg.push(url);
    let g_showLoadingTimer;
    loading && (g_showLoadingTimer = toLoading(url, loadingTxt, delayLoadingTime));
    let result;
    try {
      const res = await BaseService.get(url, { params });
      result = [res?.data?.result, res, null];
    } catch (error) {
      result = [null, null, error];
    }
    g_showLoadingTimer && clearTimeout(g_showLoadingTimer);
    return result;
  };

  requestType.postReq = async (url, params = {}, { isJson = true, showMsg = true, loading = false, loadingTxt, delayLoadingTime } = {}) => {
    showMsg && !g_showMsg.includes(url) && g_showMsg.push(url);
    let g_showLoadingTimer;
    loading && (g_showLoadingTimer = toLoading(url, loadingTxt, delayLoadingTime));
    let result;
    try {
      const res = await BaseService.post(url, isJson ? params : Qs.stringify(params));
      result = [res?.data?.result, res, null];
    } catch (error) {
      result = [null, null, error];
    }
    g_showLoadingTimer && clearTimeout(g_showLoadingTimer);
    return result;
  };

  // 添加请求拦截器
  BaseService.interceptors.request.use(
    config => {
      // console.log('请求拦截BaseService', config); // 请求发送前进行处理
      // config.headers['Authorization'] = '123';//后续可以在这进行token的传递
      return config;
    },
    error => {
      console.log(error); // 请求错误处理
      return Promise.reject(error); // return error;
    },
  );

  // 添加响应拦截器
  BaseService.interceptors.response.use(
    response => {
      // console.log('响应拦截BaseService', response);
      //需要loading的接口加载完成就从数组删掉这个记录
      const loadingApiNameIdx = g_showLoadingApiNames.findIndex(i => i === response.config.url);
      if (loadingApiNameIdx !== -1) {
        g_showLoadingApiNames.splice(loadingApiNameIdx, 1);
        !g_showLoadingApiNames.length && g_showLoadingStatus && g_showLoadingStatus.close();
      }
      //通知错误信息
      if (g_showMsg.includes(response.config.url) && response.data.status_code !== 200) {
        ElMessage({ showClose: true, message: response?.data?.msg || 'Unknown error message', type: 'error', duration: 5 * 1000 });
      }
      return response;
    },
    error => {
      //需要loading的接口加载完成就从数组删掉这个记录
      const loadingApiNameIdx = g_showLoadingApiNames.findIndex(i => i === error.config.url);
      if (loadingApiNameIdx !== -1) {
        g_showLoadingApiNames.splice(loadingApiNameIdx, 1);
        !g_showLoadingApiNames.length && g_showLoadingStatus && g_showLoadingStatus.close();
      }
      //通知错误信息
      if (g_showMsg.includes(error.config.url)) {
        ElMessage({ showClose: true, message: error.message || 'Request error', type: 'error', duration: 5 * 1000 });
      }
      //处理错误信息
      console.log(error.request);
      console.log(error.response);
      console.log(error.message);
      console.log(error.config);
      return Promise.reject(error.response); // return error;
    },
  );
  return requestType;
}
//----------------------------------下一个服务器请求实例----------------------------------

export const BaseService = createAxios(appStore.baseServiceUrl);
