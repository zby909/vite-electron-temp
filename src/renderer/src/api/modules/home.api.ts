/*
 * @Description:
 * @Author: zby
 * @Date: 2022-04-26 15:51:22
 * @FilePath: \tfl-client\src\api\modules\tfl-list.api.js
 * @LastEditors: zby
 * @Reference:
 */
import type { RequestFunctionType } from '~renderer/request';
import { BaseService } from '@/api/request';

const postApi = {};
const getApi = {
  /**
   * @description: ping
   */
  ping(params, config = { loading: true }) {
    return BaseService.getReq('ping', params, config);
  },
  //xxx添加其他方法
};

const api = Object.assign({}, postApi, getApi) as RequestFunctionType<typeof postApi, 'post'> & RequestFunctionType<typeof getApi, 'get'>;
export default api;
