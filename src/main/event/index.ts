/* eslint-disable no-inner-declarations */
/*
 * @Description:
 * @Author: zby
 * @Date: 2023-10-16 16:28:19
 * @LastEditors: zby
 * @Reference:
 */

import { app, BrowserWindow, dialog, ipcMain } from 'electron';
const Store = require('electron-store');
const store = new Store();
const IS_DEV = ['development'].includes(import.meta.env.MODE);
// console.log(import.meta.env);
export default () => {
  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  /* start  -- 自定义渲染进程和主进程的一些通信函数 -- */
  /* start  -- 自定义渲染进程和主进程的一些通信函数 -- */
  /* start  -- 自定义渲染进程和主进程的一些通信函数 -- */
  ipcMain.on('setStore', (_, key, value) => {
    store.set(key, value);
  });

  ipcMain.on('getStore', (_, key) => {
    const value = store.get(key);
    _.returnValue = value || '';
  });

  //窗口通信中转 eName自定义事件名称 toBrowserWindowId要发送到的窗口id data发送的数据
  ipcMain.on('windowIpc', (event, eName = '', { toBrowserWindowId, data = {} } = {}) => {
    const thisBw = toBrowserWindowId ? BrowserWindow.fromId(toBrowserWindowId) : null;
    if (thisBw) {
      setTimeout(
        () => {
          thisBw.webContents.send(eName, data);
          console.log('消息转发到' + toBrowserWindowId + '窗口');
          event.returnValue = 'success';
        },
        !IS_DEV ? 0 : 500, //开发环境下延迟500毫秒发送消息，避免热更新导致的消息丢失
      );
    }
  });

  //关闭窗口 browserWindowId需要关闭的窗口id type关闭模式close普通关闭destroy强制关闭（区别请查阅文档）
  ipcMain.on('closeThisWin', (event, { browserWindowId, type = 'close' } = {}) => {
    const thisBw = browserWindowId ? BrowserWindow.fromId(browserWindowId) : null;
    thisBw && (type === 'close' ? thisBw.close() : thisBw.destroy());
  });

  ipcMain.handle('doExecuteJavaScript', async (event, { browserWindowId, script } = {}) => {
    const thisBw = browserWindowId ? BrowserWindow.fromId(browserWindowId) : null;
    thisBw && thisBw.webContents.executeJavaScript(script);
    return '123';
  });

  ipcMain.handle('cdpTest', async (event, { browserWindowId }) => {
    const thisBw = browserWindowId ? BrowserWindow.fromId(browserWindowId) : null;
    if (thisBw) {
      const webContents = thisBw.webContents;
      const cdp = webContents.debugger;
      cdp.attach('1.3');
      // 获取元素的位置
      async function getElementPosition(selector) {
        return webContents.executeJavaScript(`
          (function() {
            const rect = document.querySelector('${selector}').getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          })();
      `);
      }
      // 模拟鼠标点击
      async function clickElement(selector) {
        const position = await getElementPosition(selector);
        await cdp.sendCommand('Input.dispatchMouseEvent', {
          type: 'mousePressed',
          x: position.x,
          y: position.y,
          button: 'left',
          clickCount: 1,
        });
        await cdp.sendCommand('Input.dispatchMouseEvent', {
          type: 'mouseReleased',
          x: position.x,
          y: position.y,
          button: 'left',
          clickCount: 1,
        });
      }
      // 模拟键盘输入
      async function typeText(text) {
        for (let i = 0; i < text.length; i++) {
          await cdp.sendCommand('Input.dispatchKeyEvent', {
            type: 'char',
            text: text[i],
          });
        }
      }
      // 执行操作
      await clickElement('input[type="search"]'); // 点击输入框
      await typeText('juejin'); // 输入文字
      await clickElement('.seach-icon-container'); // 点击搜索按钮
    }
  });

  //打开dialog选路径 eName支持的事件 opt配置 browserWindowId父窗口id  https://www.electronjs.org/zh/docs/latest/api/dialog#dialogshowsavedialogbrowserwindow-options
  ipcMain.handle('ipcDialog', async (event, eName, opt, browserWindowId = null) => {
    let result;
    const thisBw = browserWindowId ? BrowserWindow.fromId(browserWindowId) : null;
    if (thisBw) result = await dialog[eName](thisBw, opt);
    if (!thisBw) result = await dialog[eName](opt);
    return result;
  });

  //调用窗口的原生方法 browserWindowId需要调用方法的窗口id, attr调用的属性, type: call为方法 get为获取 ;如 thisBw.maximize() thisBw.id
  //不支持返回环类循环引用类型 如获取的BrowserWindow对象不能直接返回，所以getChildWindows()方法获取的窗口组就需自定义特殊处理
  ipcMain.handle('callNativeMethodOfWindow', async (event, { browserWindowId, attr, type = 'call' } = {}) => {
    let result = null;
    const thisBw = browserWindowId ? BrowserWindow.fromId(browserWindowId) : null;
    if (thisBw && attr) {
      type === 'call' && (result = thisBw[attr]());
      type === 'get' && (result = thisBw[attr]);
    }
    // if (Object.prototype.toString.call(result) === '[object Object]' || Array.isArray(result)) {
    //   result = JSON.stringify(result);
    // }
    return result;
  });

  //获取指定窗口的所有子窗口id数组--获取browserWindowId窗口的子窗口id组成数组
  ipcMain.handle('getChildWindowsId', async (event, browserWindowId) => {
    const thisBw = browserWindowId ? BrowserWindow.fromId(browserWindowId) : null;
    const result = thisBw && thisBw.getChildWindows().map(i => i.id);
    return result || [];
  });
};
