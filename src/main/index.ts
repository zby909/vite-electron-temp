/*
 * @Description:
 * @Author: zby
 * @Date: 2023-10-16 16:28:19
 * @LastEditors: zby
 * @Reference:
 */
import type { WebPreferences } from 'electron';

import { app, shell, BrowserWindow, dialog, ipcMain } from 'electron';
import { optimizer, is } from '@electron-toolkit/utils';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
const path = require('path');
const Store = require('electron-store');
const store = new Store();
import icon from '../../resources/icon.png?asset';
import generateUUID from '@/utils/guid.js';
import { tryUsePort } from './utils/generate-port';
const IS_DEV = ['development'].includes(import.meta.env.MODE);
// console.log(import.meta.env);

const setUniqueness = () => {
  const IS_PROD = ['production'].includes(import.meta.env.MODE);
  const IS_BETA = ['beta'].includes(import.meta.env.MODE);
  const appName = `${IS_PROD ? 'janus-xxx' : IS_BETA ? 'janus-xxx-beta' : 'janus-xxx-test'}`;
  app.setAppUserModelId('com.q2janus.' + appName);
  app.setPath('userData', path.join(app.getPath('appData'), appName));
  app.setAsDefaultProtocolClient(appName.replace('-', '')); //设置自定义协议
};
setUniqueness();

const gotTheLock = app.requestSingleInstanceLock(process.argv);
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', async (event, argv, workingDirectory, additionalData: any) => {
    const thisEnvParamArr = additionalData.slice(1); //当前要启动的后端环境命令参数
    const port = await tryUsePort(); //获取可用端口
    // startServerExe(port, thisEnvParamArr);//如果有本地打包好的后端服务请打开该行代码，自行编写启动代码如使用execFile启动exe
    createWindow(port, thisEnvParamArr); //为加快应用启动速度-直接启动窗口 在主页面判断后端服务是否连接成功
  });
}

//创建新的主窗口
async function createWindow(serverPort = '', envParamArr: Array<string> = []) {
  const options = {
    browserWindowOpt: {
      // titleBarStyle: 'hidden',
    },
    webPreferences: {
      additionalArguments: [`--janus-xxx=${JSON.stringify(envParamArr)}`],
    },
    windowId: generateUUID(),
    serverPort,
  };
  const winId = await doCreateNewWindow(options);
  return winId;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  console.log('getStore', app.getPath('userData'));
  if (!IS_DEV) {
    // 第一个主窗口 这里可以在正式环境和测试环境的时候配置启动本地服务器
    const port = await tryUsePort(); //获取可用端口
    const envParamArr = process.argv.slice(1); //快捷方式传入的参数
    // startServerExe(port, envParamArr); //启动本地服务器(如果需要启动本地服务器请打开该行代码，编写启动本地服务器的代码)
    createWindow(port, envParamArr);
  } else {
    createWindow();
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS); // 如果需要安装vue-devtools请打开该行代码
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
});

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

//把脚本发送到指定窗口执行，脚本执行完毕后触发doExecuteJavaScriptSuccess事件，可在渲染进程中监听doExecuteJavaScript事件获取执行结果
const jsHandleEvent = {};
ipcMain.on('doExecuteJavaScriptSuccess', (event, browserWindowId, { jsRes } = {}) => {
  jsHandleEvent[browserWindowId] && jsHandleEvent[browserWindowId](jsRes);
});
ipcMain.handle('doExecuteJavaScript', async (event, { browserWindowId, script } = {}) => {
  const thisBw = browserWindowId ? BrowserWindow.fromId(browserWindowId) : null;
  const res = await new Promise(resolve => {
    jsHandleEvent[browserWindowId] = res => {
      resolve(res);
      delete jsHandleEvent[browserWindowId];
    };
    thisBw && thisBw.webContents.executeJavaScript(script);
  });
  return res;
});

const networkHandleEvent = {};
const startOnloadNetwork = targetWinId => {
  // const thisBw = BrowserWindow.fromId(targetWinId);
  // thisBw?.webContents.session.webRequest.onCompleted();
  setTimeout(() => {
    networkHandleEvent[targetWinId] && networkHandleEvent[targetWinId]('success');
  }, 18000);
};
ipcMain.handle('networkComplited', async (event, targetWinId, { isReload, jsRes } = {}) => {
  const networkStatus = await new Promise(resolve => {
    networkHandleEvent[targetWinId] = res => {
      resolve(res);
      //如果涉及到页面reload或者跳转，需要在此才能释放原先记录的【脚本是否执行完毕的promise事件】
      isReload && jsHandleEvent[targetWinId] && jsHandleEvent[targetWinId](jsRes);
      delete networkHandleEvent[targetWinId];
    };
    startOnloadNetwork(targetWinId);
  });
  return networkStatus;
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

//创建新窗口
ipcMain.handle('createNewWindow', async (event, opt) => {
  console.log(event, opt, 'createNewWindow');
  const result = await doCreateNewWindow(opt);
  return result;
});

/**
 * @description: 创建窗口
 * @param {Object} browserWindowOpt - 配置项
 * @param {Object} [webPreferences] -
 * @param {String} windowId - 应用单例的token(父子共用)
 * @param {String} [hashRoute] - 打开窗口的默认路由位置默认首页
 * @param {*} initData - 初始化数据 用ipcRenderer接收
 * @param {Number} serverPort - 该窗口的服务器使用的端口
 */
const doCreateNewWindow = async ({
  browserWindowOpt = {},
  webPreferences = {},
  windowId,
  hashRoute = '',
  serverPort,
  initData,
  outUrl,
}: any = {}) => {
  //如果是希望创建子窗口，需具有parentWinId属性说明是想基于哪个窗口创建子窗口
  if (browserWindowOpt.parentWinId && browserWindowOpt.parentWinId !== -1) {
    browserWindowOpt.parent = BrowserWindow.fromId(Number(browserWindowOpt.parentWinId));
    delete browserWindowOpt['parentWinId'];
  }
  const initWebPreferences: WebPreferences = {
    webSecurity: true, //同源策略
    preload: path.join(__dirname, '../preload/index.js'),
    sandbox: false,
    nodeIntegration: false,
    contextIsolation: true,
  };
  const initBrowserWindowOpt = {
    useContentSize: true,
    width: 1366,
    height: 768,
    minWidth: 1280,
    minHeight: 720,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
  };
  Object.assign(initBrowserWindowOpt, browserWindowOpt);
  Object.assign(initWebPreferences, webPreferences);
  const xWindow = new BrowserWindow({
    ...initBrowserWindowOpt,
    webPreferences: initWebPreferences,
  });

  xWindow.on('ready-to-show', () => {
    xWindow.show();
  });

  // setInterval(
  //   () => {
  //     xWindow.minimize();
  //     setTimeout(() => {
  //       xWindow.show();
  //     }, 3000);
  //   },
  //   5 * 60 * 1000,
  // );

  xWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  xWindow.on('close', event => {
    if (!browserWindowOpt.parent) {
      // event.preventDefault(); //可以阻止窗口关闭，自定义关闭行为
      xWindow.webContents.send('beforeClose', '');
    }
  });

  xWindow.on('closed', () => {});

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  let pagePath;
  const parentWinId = xWindow.getParentWindow() ? xWindow.getParentWindow()?.id : -1;
  const query = `?windowId=${windowId}&serverPort=${serverPort}&thisBrowserId=${xWindow.id}&parentWinId=${parentWinId}`;
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    pagePath = (hashRoute ? `${process.env['ELECTRON_RENDERER_URL']}/${hashRoute}` : `${process.env['ELECTRON_RENDERER_URL']}/#/`) + query;
    await xWindow.loadURL(outUrl ? outUrl : pagePath);
    console.log('准备打开窗口的路由', pagePath);
  } else {
    if (outUrl) {
      await xWindow.loadURL(outUrl);
    } else {
      await xWindow.loadFile(path.join(__dirname, '../renderer/index.html'), {
        hash: hashRoute,
        search: query,
      });
    }
  }
  if (IS_DEV) xWindow.webContents.openDevTools();
  initData && xWindow.webContents.send('initData', initData); //自定义初始化参数
  console.log('准备打开窗口的id', xWindow.id);
  return xWindow.id;
};
/* end  -- 自定义渲染进程和主进程的一些通信函数 -- */
/* end  -- 自定义渲染进程和主进程的一些通信函数 -- */
/* end  -- 自定义渲染进程和主进程的一些通信函数 -- */

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
