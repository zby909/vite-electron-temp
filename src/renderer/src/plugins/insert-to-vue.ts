/*
 * @Description:
 * @Author: zby
 * @Date: 2023-05-26 15:22:52
 * @LastEditors: zby
 * @Reference:
 */
import type { App } from 'vue';
import type { MessageOptions, MessageHandler } from 'element-plus';
type DefaultMsgType = (msg: MessageOptions['message'], options?: MessageOptions) => MessageHandler;
export type GMessage = {
  (msg: MessageOptions['message'], options?: MessageOptions): DefaultMsgType;
  success: DefaultMsgType;
  warning: DefaultMsgType;
  error: DefaultMsgType;
};

import $tfl from '@/utils/export-vue';

const initMyMessage = () => {
  //自定义可关闭的 $g_message
  const msgObj = {
    showClose: true,
    duration: 5000,
    offset: 50,
  };
  const defaultMsg: DefaultMsgType = (msg, options) => {
    return ElMessage({
      message: msg,
      ...msgObj,
      ...options,
    });
  };
  const successMsg: DefaultMsgType = (msg, options) => {
    return ElMessage.success({
      message: msg,
      ...msgObj,
      ...options,
    });
  };
  const warningMsg: DefaultMsgType = (msg, options) => {
    return ElMessage.warning({
      message: msg,
      ...msgObj,
      ...options,
    });
  };
  const errorMsg: DefaultMsgType = (msg, options) => {
    return ElMessage.error({
      message: msg,
      ...msgObj,
      ...options,
    });
  };
  return { defaultMsg, successMsg, warningMsg, errorMsg };
};

const insertElMessage = app => {
  const { defaultMsg, successMsg, warningMsg, errorMsg } = initMyMessage();
  //分别对success、warning和error等样式进行设置
  app.config.globalProperties.$g_message = defaultMsg;
  app.config.globalProperties.$g_message.success = successMsg;
  app.config.globalProperties.$g_message.warning = warningMsg;
  app.config.globalProperties.$g_message.error = errorMsg;
};

const insertGlobalToolsFn = app => {
  app.config.globalProperties.$tfl = $tfl;
};

const insertElementPlus = app => {
  app.config.globalProperties.$message = ElMessage;
  app.config.globalProperties.$confirm = ElMessageBox.confirm;
  app.config.globalProperties.$prompt = ElMessageBox.prompt;
  app.config.globalProperties.$alert = ElMessageBox.alert;
  app.config.globalProperties.$loading = ElLoading.service;
};

// 写入原型
function insertToVue(app: App) {
  insertElMessage(app);
  insertGlobalToolsFn(app);
  insertElementPlus(app);
}

export { insertToVue, initMyMessage };
