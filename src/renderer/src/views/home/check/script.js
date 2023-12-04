/*
 * @Description:
 * @Author: zby
 * @Date: 2023-11-24 17:24:01
 * @LastEditors: zby
 * @Reference:
 */
import { useWinStore } from '@/stores/modules/win';
import { useAppStore } from '@/stores/modules/app';
import { goToPage, goToTablePage, doInputValueAction, save, doCompareQueryMessageAction } from './injectScript';
const winStore = useWinStore();
const appStore = useAppStore();

/**
 * @description:
 * @return {*}
 * @param {*} mainScript 要执行的函数
 * @param {*} targetWinId//目标窗口id (第三方网站所在的窗口)
 * @param {*} pluginWinId//插件窗口id (插件所在的窗口)
 * @param {*} params
 */
const sendJavaScriptToPage = async (mainScript, params) => {
  //要放在目标窗口执行的脚本
  const script = `
      (${mainScript.toString()})(${JSON.stringify(params)})
  `;
  return window.electronAPI.ipcRenderer.invoke('doExecuteJavaScript', {
    browserWindowId: params.targetWinId, //目标窗口id (第三方网站所在的窗口)
    script, //要放在目标窗口执行的脚本
  });
};

async function doRelateField(caseItem, commonParams) {
  let status = true;
  console.log('执行cases第二层的赋值动作: ', caseItem.relateFields);
  for (const relateFieldItem of caseItem.relateFields) {
    const suc = await sendJavaScriptToPage(
      doInputValueAction,
      Object.assign({}, commonParams, { field: relateFieldItem.name, fieldValue: relateFieldItem.value }),
    );
    if (!suc) {
      status = false;
      break;
    }
  }
  console.log(status ? 'cases第二层的赋值动作完成' : 'cases第二层的赋值动作失败');
  if (status) {
    console.log('发起保存请求（会刷新页面）');
    await sendJavaScriptToPage(save, Object.assign({}, commonParams));
    console.log('已保存');
    console.log('开始校验queryMessage：', caseItem.queryMessage);
    status = await sendJavaScriptToPage(
      doCompareQueryMessageAction,
      Object.assign({}, commonParams, { field: caseItem.field, queryMessage: caseItem.queryMessage }),
    );
    console.log(status ? 'queryMessage校验通过' : 'queryMessage校验不通过');
  }
  return status;
}

async function doUnitTest(unitTestsItem, commonParams) {
  let status = true;
  for (const caseItem of unitTestsItem.cases) {
    console.log('跳转table详情页');
    status = await sendJavaScriptToPage(goToTablePage, Object.assign({}, commonParams, { field: caseItem.field }));
    console.log(status ? '已跳转table详情页' : '跳转table详情页失败');
    if (status) {
      console.log('执行cases第一层的赋值动作: ', caseItem.field, caseItem.testValue);
      status = await sendJavaScriptToPage(
        doInputValueAction,
        Object.assign({}, commonParams, { field: caseItem.field, fieldValue: caseItem.testValue }),
      );
      console.log(status ? 'cases第一层的赋值动作完成' : 'cases第一层的赋值动作失败');
      if (status) {
        status = await doRelateField(caseItem, commonParams);
      }
    }
    if (!status) break;
  }
  return status;
}

export async function doTest(obj) {
  let status = true;
  const commonParams = { targetWinId: winStore.targetWinId, pluginWinId: appStore.thisBrowserId };
  const visit = obj.visit;
  const form = obj.form;
  console.log('跳转visit form页面: ', visit, form);
  const goToPageSuccess = await sendJavaScriptToPage(goToPage, Object.assign({}, commonParams, { visit, form }));
  console.log(goToPageSuccess ? '已跳转页面' : '跳转页面失败');
  if (goToPageSuccess) {
    for (const unitTestsItem of obj.unitTests) {
      console.log('开始执行unitTests Item: ');
      const s = await doUnitTest(unitTestsItem, commonParams);
      console.log('unitTests Item执行完成');
      if (!s) {
        status = false;
        break;
      }
    }
  }
  if (status) {
    console.log('%c---通过---', 'color:green;');
  } else {
    console.log('%c---不通过---', 'color:red;');
  }
  return status;
}
