/*
 * @Description:
 * @Author: zby
 * @Date: 2023-05-26 11:52:06
 * @LastEditors: zby
 * @Reference:
 */
import { ElectronAPI } from '@electron-toolkit/preload';
import { ChildProcess } from 'child_process';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
    electronNodeAPI: ElectronNodeAPI;
  }
  interface ImportMetaEnv {
    readonly RENDERER_VITE_SERVICE_BASE_URL: string;
    // 更多环境变量...
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

interface ElectronNodeAPI {
  processArgv: string[];
  osUserInfo: string[];
}

export interface RecordRuningServer {
  port: string;
  process: ChildProcess;
}
