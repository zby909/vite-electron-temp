/*
 * @Description:
 * @Author: zby
 * @Date: 2022-08-30 14:16:09
 * @LastEditors: zby
 * @Reference:
 */
import guid from './guid';

/**
 * @description 格式化时间
 * @param {String|Number} dateTime 需要格式化的时间戳
 * @param {String} fmt 格式化规则 yyyy:mm:dd|yyyy:mm|yyyy年mm月dd日|yyyy年mm月dd日 hh时MM分等,可自定义组合 默认yyyy-mm-dd
 * @returns {string} 返回格式化后的字符串
 */
function timeFormat(dateTime = null, formatStr = 'yyyy-mm-dd') {
  let date;
  // 若传入时间为假值，则取当前时间
  if (!dateTime) {
    date = new Date();
  }
  // 若为unix秒时间戳，则转为毫秒时间戳
  else if (/^\d{10}$/.test(dateTime?.toString().trim())) {
    date = new Date(dateTime * 1000);
  }
  // 若用户传入字符串格式时间戳，new Date无法解析，需做兼容
  else if (typeof dateTime === 'string' && /^\d+$/.test(dateTime.trim())) {
    date = new Date(Number(dateTime));
  }
  // 其他都认为符合 RFC 2822 规范
  else {
    // 处理平台性差异，在Safari/Webkit中，new Date仅支持/作为分割符的字符串时间
    date = new Date(typeof dateTime === 'string' ? dateTime.replace(/-/g, '/') : dateTime);
  }

  const timeSource = {
    y: date.getFullYear().toString(), // 年
    m: (date.getMonth() + 1).toString().padStart(2, '0'), // 月
    d: date.getDate().toString().padStart(2, '0'), // 日
    h: date.getHours().toString().padStart(2, '0'), // 时
    M: date.getMinutes().toString().padStart(2, '0'), // 分
    s: date.getSeconds().toString().padStart(2, '0'), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };

  for (const key in timeSource) {
    const [ret] = new RegExp(`${key}+`).exec(formatStr) || [];
    if (ret) {
      // 年可能只需展示两位
      const beginIndex = key === 'y' && ret.length === 2 ? 2 : 0;
      formatStr = formatStr.replace(ret, timeSource[key].slice(beginIndex));
    }
  }

  return formatStr;
}

/**
 * @description 去除空格
 * @param String str 需要去除空格的字符串
 * @param String pos both(左右)|left|right|all 默认both
 */
function trim(str, pos = 'both') {
  str = String(str);
  if (pos == 'both') {
    return str.replace(/^\s+|\s+$/g, '');
  }
  if (pos == 'left') {
    return str.replace(/^\s*/, '');
  }
  if (pos == 'right') {
    return str.replace(/(\s*$)/g, '');
  }
  if (pos == 'all') {
    return str.replace(/\s+/g, '');
  }
  return str;
}

/**
 * @description 对象转url参数
 * @param {object} data,对象
 * @param {Boolean} isPrefix,是否自动加上"?"
 * @param {string} arrayFormat 规则 indices|brackets|repeat|comma
 */
function queryParams(data = {}, isPrefix = true, arrayFormat = 'brackets') {
  const prefix = isPrefix ? '?' : '';
  const _result = [];
  if (['indices', 'brackets', 'repeat', 'comma'].indexOf(arrayFormat) == -1) arrayFormat = 'brackets';
  for (const key in data) {
    const value = data[key];
    // 去掉为空的参数
    if (['', undefined, null].indexOf(value) >= 0) {
      continue;
    }
    // 如果值为数组，另行处理
    if (value.constructor === Array) {
      let commaStr = '';
      // e.g. {ids: [1, 2, 3]}
      switch (arrayFormat) {
        case 'indices':
          // 结果: ids[0]=1&ids[1]=2&ids[2]=3
          for (let i = 0; i < value.length; i++) {
            _result.push(`${key}[${i}]=${value[i]}`);
          }
          break;
        case 'brackets':
          // 结果: ids[]=1&ids[]=2&ids[]=3
          value.forEach(_value => {
            _result.push(`${key}[]=${_value}`);
          });
          break;
        case 'repeat':
          // 结果: ids=1&ids=2&ids=3
          value.forEach(_value => {
            _result.push(`${key}=${_value}`);
          });
          break;
        case 'comma':
          // 结果: ids=1,2,3
          value.forEach(_value => {
            commaStr += (commaStr ? ',' : '') + _value;
          });
          _result.push(`${key}=${commaStr}`);
          break;
        default:
          value.forEach(_value => {
            _result.push(`${key}[]=${_value}`);
          });
      }
    } else {
      _result.push(`${key}=${value}`);
    }
  }
  return _result.length ? prefix + _result.join('&') : '';
}

/**
 * @description 获取某个对象下的属性，用于通过类似'a.b.c'的形式去获取一个对象的的属性的形式(为了在vue2的模板中使用链式操作符?.的类似实现)
 * @param {object} obj 对象
 * @param {string} key 需要获取的属性字段
 * @returns {*}
 */
function getProperty(obj, key) {
  if (!obj) {
    return;
  }
  if (typeof key !== 'string' || key === '') {
    return '';
  }
  if (key.indexOf('.') !== -1) {
    const keys = key.split('.');
    let firstObj = obj[keys[0]] || {};

    for (let i = 1; i < keys.length; i++) {
      if (firstObj) {
        firstObj = firstObj[keys[i]];
      }
    }
    return firstObj;
  }
  return obj[key];
}

/**
 * @description 取一个区间数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 */
function random(min, max) {
  if (min >= 0 && max > 0 && max >= min) {
    const gab = max - min + 1;
    return Math.floor(Math.random() * gab + min);
  }
  return 0;
}

//防抖 重复触发只执行最后一次
function debounce(fn, wait = 800, immediate) {
  let timeout = null;
  let initTimer = null; //为了最后一次函数执行完成后 重置立即执行的逻辑
  let isInvoke = false;
  return function () {
    timeout && clearTimeout(timeout);
    initTimer && clearTimeout(initTimer);
    if (immediate && !isInvoke) {
      fn.apply(this, arguments);
      isInvoke = true;
      initTimer = setTimeout(() => (isInvoke = false), wait);
    } else {
      timeout = setTimeout(() => {
        fn.apply(this, arguments);
        isInvoke = false;
      }, wait);
    }
  };
}

//需要节流的场景一般是首次就需要执行 比如说按钮点击不想触发那么频繁
function throttle(fn, wait = 800, immediate = true) {
  let flag = true;
  let initTimer = null; //为了最后一次函数执行完成后 重置立即执行的逻辑
  let isInvoke = false;
  return function () {
    initTimer && clearTimeout(initTimer);
    if (immediate && !isInvoke) {
      fn.apply(this, arguments);
      isInvoke = true;
      initTimer = setTimeout(() => (isInvoke = false), wait);
    } else if (flag) {
      flag = false;
      setTimeout(() => {
        fn.apply(this, arguments);
        flag = true;
        if (immediate) initTimer = setTimeout(() => (isInvoke = false), wait);
      }, wait);
    }
  };
}

function deepClone(obj, hash = new WeakMap()) {
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Element) return obj.cloneNode(true);
  if (obj === null || typeof obj !== 'object') return obj;
  if (hash.get(obj)) return hash.get(obj);
  if (obj instanceof Map) {
    const newMap = new Map();
    hash.set(obj, newMap);
    obj.forEach((value, key) => {
      newMap.set(deepClone(key, hash), deepClone(value, hash));
    });
    return newMap;
  }
  if (obj instanceof Set) {
    const newSet = new Set();
    hash.set(obj, newSet);
    obj.forEach(value => {
      newSet.add(deepClone(value, hash));
    });
    return newSet;
  }
  const newobj = obj instanceof Array ? [] : {};
  hash.set(obj, newobj);
  for (const i in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, i)) {
      newobj[i] = deepClone(obj[i], hash);
    }
  }
  return newobj;
}

const $u = {
  guid,
  timeFormat,
  trim,
  queryParams,
  getProperty,
  debounce,
  throttle,
  deepClone,
  random,
};

export default $u;
