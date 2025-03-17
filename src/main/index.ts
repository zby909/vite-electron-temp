/* eslint-disable no-inner-declarations */
/*
 * @Description:
 * @Author: zby
 * @Date: 2023-10-16 16:28:19
 * @LastEditors: zby
 * @Reference:
 */
import type { WebPreferences } from 'electron';

import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { optimizer, is } from '@electron-toolkit/utils';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
const path = require('path');
import icon from '../../resources/icon.png?asset';
import generateUUID from '@/utils/guid.js';
import { tryUsePort } from './utils/generate-port';
const IS_DEV = ['development'].includes(import.meta.env.MODE);
// console.log(import.meta.env);
import onEvent from './event/index';
app.commandLine.appendSwitch('remote-debugging-port', '9228');

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
async function createWindow(serverPort?, envParamArr: Array<string> = []) {
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
  // if (IS_DEV) xWindow.webContents.openDevTools();
  initData && xWindow.webContents.send('initData', initData); //自定义初始化参数
  console.log('准备打开窗口的id', xWindow.id);
  return xWindow.id;
};
/* end  -- 自定义渲染进程和主进程的一些通信函数 -- */
/* end  -- 自定义渲染进程和主进程的一些通信函数 -- */
/* end  -- 自定义渲染进程和主进程的一些通信函数 -- */

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
onEvent();
