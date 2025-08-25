/*
 * @Description:
 * @Author: zby
 * @Date: 2023-10-16 16:28:19
 * @LastEditors: zby
 * @Reference:
 */
import { contextBridge } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import * as os from 'os';

// Custom APIs for renderer
const electronNodeAPI = {
  processArgv: process.argv,
  osUserInfo: os.userInfo(),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', electronAPI);
    contextBridge.exposeInMainWorld('electronNodeAPI', electronNodeAPI);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electronAPI = electronAPI;
  window.electronNodeAPI = electronNodeAPI;
}
