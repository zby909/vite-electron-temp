import { useWinStore } from '@/stores/modules/win';
import { useAppStore } from '@/stores/modules/app';
import {
  goToPage,
  goToTablePage,
  doInputValueAction,
  save,
  gotoSiteIndex,
  doNewSubjectAction,
  doCompareValueAction,
  doVisitFormAction,
  doTableColumnAction,
} from './injectScript';
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
    (function(){
      console.log('doExecuteJavaScript');
      const mainScript=${mainScript.toString()};
      let targetScript=eval('('+ mainScript +')');
      targetScript(${JSON.stringify(params)})
    })()
  `;
  return window.electronAPI.ipcRenderer.invoke('doExecuteJavaScript', {
    browserWindowId: params.targetWinId, //目标窗口id (第三方网站所在的窗口)
    script, //要放在目标窗口执行的脚本
  });
};

/* 自定义前置条件判断 */
async function doConditions({ field, fieldAction, fieldValue, shouldSave, visit, form, line = 1 } = {}) {
  let doStatus = false;
  const commonParams = { targetWinId: winStore.targetWinId, pluginWinId: appStore.thisBrowserId };
  if (visit === '/' && form === 'New Subject') {
    //需要至少有一个受试者才能进行添加受试者的操作，用以获取所有的受试者的id
    const allSubjectID = await sendJavaScriptToPage(gotoSiteIndex, Object.assign({}, commonParams));
    if (allSubjectID.length) {
      console.log('执行添加受试者的逻辑');
      await sendJavaScriptToPage(doNewSubjectAction, Object.assign({}, commonParams, { allSubjectID }));
      doStatus = true;
      console.log('已添加受试者');
    }
  } else {
    console.log('跳转页面');
    const goToPageSuccess = await sendJavaScriptToPage(goToPage, Object.assign({}, commonParams, { visit, form }));
    console.log(goToPageSuccess ? '已跳转页面' : '跳转页面失败');
    let goToTableSuccess;
    console.log('跳转table详情页（会刷新页面）');
    goToPageSuccess && (goToTableSuccess = await sendJavaScriptToPage(goToTablePage, Object.assign({}, commonParams, { field, line })));
    console.log(goToTableSuccess ? '已跳转table详情页' : '跳转table详情页失败');
    if (goToPageSuccess && goToTableSuccess) {
      console.log('操作dom进行赋值');
      await sendJavaScriptToPage(doInputValueAction, Object.assign({}, commonParams, { field, fieldAction, fieldValue }));
      console.log('已赋值');
      if (shouldSave) {
        console.log('发起保存请求（会刷新页面）');
        await sendJavaScriptToPage(save, Object.assign({}, commonParams));
        console.log('已保存');
      }
      doStatus = true;
    }
  }

  return doStatus;
}

/* 自定义目标条件判断 */
async function doTargets({ target, visit, form } = {}) {
  let doStatus = false;
  const commonParams = { targetWinId: winStore.targetWinId, pluginWinId: appStore.thisBrowserId };
  const fieldType = target.fieldType;

  // fieldType===records 的情况下：使用 fields 和 subs 去最外层给出的visit的form找对应的列和值
  // fieldType===options 的情况下：使用 parent 和 fields 去最外层给出的visit的form找对应的列和值
  if (['records', 'options'].includes(fieldType)) {
    let field, fieldValue;
    if (fieldType === 'records') {
      field = target.fields[0].trim();
      fieldValue = target.subs;
    } else if (fieldType === 'options') {
      field = target.parent.trim();
      fieldValue = target.fields;
    }
    console.log('跳转页面');
    const goToPageSuccess = await sendJavaScriptToPage(goToPage, Object.assign({}, commonParams, { visit, form }));
    console.log(goToPageSuccess ? '已跳转页面' : '跳转页面失败');
    let goToTableSuccess;
    console.log('跳转table详情页（会刷新页面）');
    goToPageSuccess && (goToTableSuccess = await sendJavaScriptToPage(goToTablePage, Object.assign({}, commonParams, { field })));
    console.log(goToTableSuccess ? '已跳转table详情页' : '跳转table详情页失败');
    if (goToPageSuccess && goToTableSuccess) {
      console.log('开始操作dom进行对比');
      doStatus = await sendJavaScriptToPage(doCompareValueAction, Object.assign({}, commonParams, { field, fieldValue }));
      console.log('已对比');
    }
  }

  // fieldType===folder 的情况下：使用fields寻找visit,再查看该visit下是否存在subs里面的form们
  // fieldType===form 的情况下：使用最外层给出的visit寻找visit,再查看该visit下是否存在fields里面的form们
  if (['folder', 'form'].includes(fieldType)) {
    let visitName = '';
    let formNames = [];
    if (fieldType === 'folder') {
      visitName = target.fields[0].trim();
      formNames = target.subs;
    } else if (fieldType === 'form') {
      visitName = visit;
      formNames = target.fields;
    }
    console.log('执行判断visit当中是否存在指定form的动作');
    doStatus = await sendJavaScriptToPage(doVisitFormAction, Object.assign({}, commonParams, { visitName, formNames }));
    console.log('已判断');
  }

  // fieldType===item 的情况下：使用最外层给出的visit、form进入页面,找fields对应的列是否存在该页面当中
  if (['item'].includes(fieldType)) {
    const fieldNames = target.fields;
    console.log('跳转页面');
    const goToPageSuccess = await sendJavaScriptToPage(goToPage, Object.assign({}, commonParams, { visit, form }));
    console.log(goToPageSuccess ? '已跳转页面' : '跳转页面失败');
    let goToTableSuccess;
    console.log('跳转table详情页（会刷新页面）');
    goToPageSuccess && (goToTableSuccess = await sendJavaScriptToPage(goToTablePage, Object.assign({}, commonParams, { field: fieldNames[0] })));
    console.log(goToTableSuccess ? '已跳转table详情页' : '跳转table详情页失败');
    if (goToPageSuccess && goToTableSuccess) {
      console.log('执行判断是否存在该列的动作');
      doStatus = await sendJavaScriptToPage(doTableColumnAction, Object.assign({}, commonParams, { fields: fieldNames }));
    }
  }

  return doStatus;
}

/* 通用 */
export async function doTest(obj) {
  let status = true;
  const conditions = obj.desc.conditions.conditions || [];
  const logic = obj.desc.conditions.logic;
  for (let j = 0; j < conditions.length; j++) {
    const condition = conditions[j];
    const { field, fieldValue, fieldAction, locations } = condition;
    if (fieldAction === 'click' && field === 'Save') continue; //防止后端没删掉这种条件，因为现在是默认每条都会保存，所以不需要再依赖后端的配置
    const p = {
      field: field.trim(),
      fieldValue: fieldValue,
      fieldAction: fieldAction,
      shouldSave: true,
      visit: locations.find(i => i.locateField === 'visit')?.locateName?.trim(),
      form: locations.find(i => i.locateField === 'form')?.locateName?.trim(),
      line: locations.find(i => i.locateField === 'line')?.locateName,
    };
    console.log('%c---前置条件开始执行ing---', 'color:blue;');
    const isConditionMet = await doConditions(p);
    console.log('%c---前置条件执行结束end---', 'color:blue;');
    if (logic === 'and' && !isConditionMet) {
      status = false;
      break;
    }
    if (logic === 'or') {
      if (isConditionMet) {
        break;
      } else {
        //如果是最后一个条件，且前面的条件都不满足，则status为false
        if (j === conditions.length - 1) status = false;
      }
    }
  }
  if (status) {
    const targets = obj.desc.targets || [];
    for (const i of targets) {
      const p = {
        target: i,
        visit: obj.visit?.trim(),
        form: obj.form?.trim(),
      };
      console.log('%c---目标条件开始执行---', 'color:green;');
      const isTargetMet = await doTargets(p);
      console.log('%c---目标条件执行结束---', 'color:green;');
      if (!isTargetMet) {
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
