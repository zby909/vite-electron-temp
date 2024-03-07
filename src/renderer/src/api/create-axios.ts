/*
 * @Author: zby
 * @Date: 2023-07-12 17:47:50
 * @LastEditTime: 2024-03-07 17:03:05
 * @LastEditors: zby
 * @Description: 接口请求拦截配置
 */

import axios from 'axios';

import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

console.log(window, import.meta.env);

const isFunction = val => typeof val === 'function';

export type CustomConfig = {
  _commonOptions?: AxiosCustomOpt;
  _transformFn?: AxiosTransform;
};

export type CreateAxiosOptions = AxiosRequestConfig & CustomConfig;

export type AxiosCustomOpt = {
  afHLoading?: boolean; //是否显示loading
  loadingTxt?: string; //loading提示文字
  delayLoadingTime?: number; //延迟多少毫秒显示loading
  isUploadFile?: boolean; //是否上传文件
  isAlertErrorMsg?: boolean; //是否弹出错误提示
  supportFormUrlencoded?: boolean; //是否支持www-form-urlencoded格式
  joinTime?: boolean; //get请求是否加时间戳
  withToken?: boolean; //是否携带token
  authenticationScheme?: string; //token的前缀
  returnResponseData?: boolean; //是否转换响应数据
};

export abstract class AxiosTransform {
  /**
   * @description: 请求之前的拦截器
   */
  requestInterceptors?: (config: InternalAxiosRequestConfig & CustomConfig) => InternalAxiosRequestConfig;

  /**
   * @description: 请求之前的拦截器错误处理
   */
  requestInterceptorsCatch?: (error) => Promise<never>;

  /**
   * @description: 请求之后的拦截器
   */
  responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>;

  /**
   * @description: 请求之后的拦截器错误处理
   */
  responseInterceptorsCatch?: (error) => Promise<never>;
}

export class CreateAxios<R> {
  private axiosInstance: AxiosInstance;
  private readonly createAxiosOptions: CreateAxiosOptions;

  constructor(opt: CreateAxiosOptions) {
    this.axiosInstance = axios.create(opt);
    this.createAxiosOptions = opt;
    this.setupInterceptors();
  }

  /**
   * @description: Interceptor configuration 拦截器配置
   */
  private setupInterceptors() {
    const {
      createAxiosOptions: { _transformFn },
    } = this;
    if (!_transformFn) return;
    const { requestInterceptors, requestInterceptorsCatch, responseInterceptors, responseInterceptorsCatch } = _transformFn;

    // Request interceptor
    this.axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig & CustomConfig) => {
      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config);
      }
      return config;
    }, undefined);
    // Request interceptor error capture
    this.axiosInstance.interceptors.request.use(undefined, error => {
      if (requestInterceptorsCatch && isFunction(requestInterceptorsCatch)) {
        return requestInterceptorsCatch(error);
      }
      return Promise.reject(error);
    });

    // Response result interceptor
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res);
      }
      return res;
    }, undefined);
    // Response result interceptor error capture
    this.axiosInstance.interceptors.response.use(undefined, error => {
      if (responseInterceptorsCatch && isFunction(responseInterceptorsCatch)) {
        return responseInterceptorsCatch(error);
      }
      return Promise.reject(error);
    });
  }

  request<T = R>(config: AxiosRequestConfig, options?: AxiosCustomOpt): Promise<T> {
    const cloneCreateAxiosOptions: CreateAxiosOptions = JSON.parse(JSON.stringify(this.createAxiosOptions));
    const conf: CreateAxiosOptions = JSON.parse(JSON.stringify(config));
    const opts: AxiosCustomOpt = options && JSON.parse(JSON.stringify(options));
    const allConfig: CreateAxiosOptions = Object.assign({}, cloneCreateAxiosOptions, conf);
    const { _commonOptions } = allConfig;
    const allOpt: AxiosCustomOpt = Object.assign({}, _commonOptions, opts);
    allConfig._commonOptions = allOpt;

    if (config.signal) {
      allConfig.signal = config.signal;
    }

    return this.axiosInstance.request(allConfig);
  }
}
