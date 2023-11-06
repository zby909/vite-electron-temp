/*
 * @Description:
 * @Author: zby
 * @Date: 2022-04-27 18:06:46
 * @LastEditors: zby
 * @Reference:
 */
/**
 * 获取请求参数
 * 使用：getParam('name')
 * 注：若同时存在search和hash地址的同名参数 默认取hash的值
 * 如 若www.zby9099.com/zby.html?id=1&zby=909#page/index?appId=200&id=2 getParam('id') 得到的是2 而不是1
 * @param {*} name
 */
const getParam = function (name) {
  const reg = /[\?|&|#]/g;
  const ps = {};
  const params = location.search.concat(location.hash).split(reg);
  for (const param of params) {
    if (!param) continue;
    const [key, value] = param.split('=');
    ps[key] = decodeURIComponent(value);
  }
  return ps[name];
};

//重复调用接口时，前端只应用最后一次调用的接口结果（之前的接口依然会正常请求，但可通过abort()忽略正确结果，可配合自定义的request.js使用）
/**
 * @description:
 * @param {*} Promise
 * @return {*}
 */
const getPromiseWithAbort = p => {
  const obj = {};
  //内部定一个新的promise，用来终止执行
  const p1 = new Promise(function (resolve, reject) {
    obj.abort = reject;
  }).catch(err => {
    return err;
  });
  obj.promise = Promise.race([p, p1]);
  return obj;
};

export { getParam, getPromiseWithAbort };
