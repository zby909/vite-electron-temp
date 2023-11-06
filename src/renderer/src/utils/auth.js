/*
 * @Description:
 * @Author: zby
 * @Date: 2022-04-27 18:06:46
 * @LastEditors: zby
 * @Reference:
 */
const TokenKey = 'token';

export function setToken(token) {
  return localStorage.setItem(TokenKey, token);
}

export function getToken() {
  return localStorage.getItem(TokenKey);
}

export function removeToken() {
  return localStorage.removeItem(TokenKey);
}
