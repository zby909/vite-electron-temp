/*
 * @Description:
 * @Author: zby
 * @Date: 2023-10-20 16:50:00
 * @LastEditors: zby
 * @Reference:
 */
import type { AxiosResponse } from 'axios';

interface CommonConfigType {
  insertCommonParams?: boolean;
  showMsg?: boolean;
  loading?: boolean;
  loadingTxt?: string;
  delayLoadingTime?: number;
}
interface GetConfigType extends CommonConfigType {}
interface PostConfigType extends CommonConfigType {
  isJson?: boolean;
}

interface ParamsType {
  [key: string]: any;
}

export type ResponseType = [any, AxiosResponse | null, any];
export interface RequestType {
  getReq: (url: string, params?: ParamsType, config?: GetConfigType) => Promise<ResponseType>;
  postReq: (url: string, params?: ParamsType, config?: PostConfigType) => Promise<ResponseType>;
}

type EnumRequestType = 'get' | 'post';
export type RequestFunctionValueType<T extends EnumRequestType> = (
  params?: ParamsType,
  config?: T extends 'get' ? GetConfigType : PostConfigType,
) => Promise<ResponseType>;

/**
 * @description: T为接口对象的type用以正常出现接口key提示（typeof '{}'），P是请求的类型
 * @return {*}
 */
export type RequestFunctionType<T, P extends EnumRequestType> = {
  [K in keyof T]: RequestFunctionValueType<P>;
};
