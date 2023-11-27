const angular = {};

/* 脚本内分离的通用函数 需要提前注入到相应的网页环境当中*/
// const getInputType = writeDom => {
//   let inputType = '';
//   if (writeDom?.classList.contains('radio-button-edit')) {
//     inputType = 'radio';
//   } else if (writeDom?.classList.contains('checkbox-container')) {
//     inputType = 'checkbox';
//   } else if (writeDom?.classList.contains('long-text')) {
//     inputType = 'textarea';
//   } else if (writeDom?.hasAttribute('crf-date-time-write')) {
//     inputType = 'date';
//   } else if (writeDom?.classList.contains('dynamic-search-list-edit')) {
//     inputType = 'dynamic-inputsearch';
//   } else if (writeDom?.hasAttribute('drop-down-list-write')) {
//     inputType = 'select';
//   }
//   return inputType;
// };
/* 脚本内分离的通用函数 */

/* conditions */
//去到页面
const goToPage = async ({ targetWinId, pluginWinId, visit, form } = {}) => {
  const eIpc = window.electronAPI.ipcRenderer;
  eIpc.sendSync('windowIpc', 'getMsg', { toBrowserWindowId: pluginWinId, data: { msg: '在这里可以发送注入脚本当中的信息给插件窗口展示' } });
  let status = true;
  const folderTree = angular.element('#mdsolGambitApp').injector().get('foldersTreeService')?.data?.folders || [];
  //判断visit、form是否存在
  const visitInfo = folderTree.find(i => i.name.startsWith(visit));
  const formInfo = visitInfo?.forms.find(i => i.name.trim() === form);
  if (formInfo) {
    const targetElement = document.querySelector('#mainContent');
    //找到targetElement下类名为form-name下的data-testid="formNameHeader"的innerText是否等于form
    const isFormHeaderName = targetElement => {
      return (
        targetElement.querySelector('.form-name')?.querySelector('[data-testid="formNameHeader"]')?.innerText?.trim() === form &&
        targetElement
          .querySelector('.subject-folder')
          ?.querySelector('[ng-repeat="breadcrumb in $ctrl.vm.datapage.foldersBreadCrumb"]')
          ?.innerText?.trim()
          ?.startsWith(visit)
      );
    };
    //如果不等于代表不在当前页面，需要点击左侧菜单栏
    if (!isFormHeaderName(targetElement)) {
      const visitDom = document.querySelector(`a[aria-controls="${visitInfo.id}"]`);
      visitDom.click();
      /* 进入页面接口等待 */
      await new Promise(resolve => {
        resolve(window.electronAPI.ipcRenderer.invoke('networkComplited', targetWinId));
        //不会刷新页面，所以不需要isReload模式来返回当前函数的结果，继续执行完成当前函数,返回结果
        visitDom.parentElement.querySelector(`li[id="${formInfo.id}"]`)?.firstElementChild?.click();
      });
      /* 进入页面接口等待 */
    }
    targetElement.click(); //点击页面空白处，隐藏下拉框
  } else {
    status = false;
    console.error('不存在该visit、form，请检查visit、form是否正确', 'visit=', visit, 'form=', form);
  }
  window.electronAPI.ipcRenderer.send('doExecuteJavaScriptSuccess', targetWinId, { jsRes: status });
  return status;
};

//去到table详情页面
const goToTablePage = async ({ targetWinId, field, line = 1 } = {}) => {
  let doStatus = true;
  //查找类名为landscapeLogTable的table
  const table = document.querySelector('.landscapeLogTable');
  //如果存在table，则进入table对应的详情页
  if (table) {
    const tableBody = table.querySelector('.data-grid-body');
    //查找tableBody当中的第line行
    const conditionsTR = tableBody.querySelectorAll('tr')[line - 1];
    if (conditionsTR) {
      /* 进入页面接口等待 */
      await new Promise(resolve => {
        resolve(window.electronAPI.ipcRenderer.invoke('networkComplited', targetWinId));
        conditionsTR.querySelector('.view-portrait-link-icon')?.click();
      });
      /* 进入页面接口等待 */
    } else {
      doStatus = false;
      window.electronAPI.ipcRenderer.send('sendMsg', targetWinId, { msg: '存在table，但table中不存在该行，无法进入详情页：line=' + line });
      console.error('存在table，但table中不存在该行，无法进入详情页：line=', line);
    }
  } else {
    //如果不存在table，则判断field是否存在
    if (!['save'].includes(field.toLowerCase())) {
      const targetFieldDom = Array.from(document.querySelectorAll('.question-title-wrapper')).find(i => i.innerText.trim() === field)?.parentElement;
      if (targetFieldDom) {
        console.log('此页面不存在table，但存在该field，可能直接进入了table详情页面或者当前页面已经是详情页了：field=', field);
      } else {
        doStatus = false;
        console.error('此页面不存在table，且不存在该field，无法进入详情页：field=', field);
      }
    }
  }
  window.electronAPI.ipcRenderer.send('doExecuteJavaScriptSuccess', targetWinId, { jsRes: doStatus });
};

const save = async ({ targetWinId } = {}) => {
  await new Promise(resolve => {
    resolve(window.electronAPI.ipcRenderer.invoke('networkComplited', targetWinId, { isReload: true, jsRes: true }));
    document.querySelector('#save-button')?.click();
    setTimeout(() => {
      //假设保存成功后会刷新页面，会丢失当前页面的dom和注入的js，当前函数后续的代码也不会再执行,所以需要networkComplited的isReload模式来返回当前函数的结果
      location.reload();
    }, 5000);
  });
  window.electronAPI.ipcRenderer.send('doExecuteJavaScriptSuccess', targetWinId, { jsRes: true });
};

//执行给字段赋值的动作
function doInputValueAction({ targetWinId, field, fieldAction, fieldValue } = {}) {
  const targetFieldDom = Array.from(document.querySelectorAll('.question-title-wrapper')).find(i => i.innerText.trim() === field)?.parentElement;
  //点击类名为click-to-edit,进入编辑状态
  targetFieldDom.querySelector('.click-to-edit')?.click();
  // const ENUM_INPUTTYPE = ['radio', 'checkbox', 'textarea', 'date', 'inputsearch', 'dynamic-inputsearch', 'select']; // 普通的inputsearch尚未遇见
  const writeDom = targetFieldDom.querySelector('.write-control-slot')?.firstElementChild;
  let inputType = '';
  if (writeDom?.classList.contains('radio-button-edit')) {
    inputType = 'radio';
  } else if (writeDom?.classList.contains('checkbox-container')) {
    inputType = 'checkbox';
  } else if (writeDom?.classList.contains('long-text')) {
    inputType = 'textarea';
  } else if (writeDom?.hasAttribute('crf-date-time-write')) {
    inputType = 'date';
  } else if (writeDom?.classList.contains('dynamic-search-list-edit')) {
    inputType = 'dynamic-inputsearch';
  } else if (writeDom?.hasAttribute('drop-down-list-write')) {
    inputType = 'select';
  }

  // /* ---如果后面能通过某个字段来确定寻找的节点的类型的话就不需要根据字段名写死了--- */
  // const textareaAttr = ['Adverse Event Term', 'Medical Condition'];
  // const radioAttr = ['Criterion Type', 'Was the subject ENROLLED?', 'Sex'];
  // const dateAttr = ['Onset Date', 'Start Date', 'Visit Date'];
  // const checkboxAttr = ['Visit Not Done'];

  if (inputType === 'textarea') {
    //找到targetFieldDom下textarea,判断值是否等于fieldValue[0]
    const textarea = targetFieldDom.querySelector('textarea');
    const textareaTestValue = textarea.value.trim() === fieldValue[0];
    //如果textarea不等于fieldValue[0],则将textarea的值设置为fieldValue[0]
    if (!textareaTestValue) {
      console.log(`修改${field}`, fieldValue[0]);
      textarea.value = fieldValue[0];
      textarea.dispatchEvent(new Event('input'));
    }
  }
  if (inputType === 'radio') {
    //找到targetFieldDom下所有的type="radio"的input，并判断是否有被选中的且选中的那个input的父元素的innerText是否等于fieldValue[0]
    const allRadio = Array.from(targetFieldDom.querySelectorAll('input[type="radio"]'));
    const checkedTestValue = allRadio.find(i => i.checked)?.parentElement?.innerText.trim() === fieldValue[0];
    //如果没有被选中的或者选中的那个input的父元素的innerText不等于fieldValue[0]，则点击innerText等于fieldValue[0]的那个input
    if (!checkedTestValue) {
      allRadio.find(i => i.parentElement.innerText.trim() === fieldValue[0])?.click();
    }
  }
  if (inputType === 'checkbox') {
    const isChecked = fieldAction === 'checked' ? true : false;
    const checkBox = targetFieldDom.querySelector('input[type="checkbox"]');
    //设置checkbox的选中状态
    if (checkBox.checked !== isChecked) {
      console.log(`修改${field}`, isChecked);
      checkBox.checked = isChecked;
      checkBox.dispatchEvent(new Event('change'));
    }
  }
  if (inputType === 'date') {
    if (fieldValue[0] === 'present') {
      //转换成"24 May 2013"格式，月份为英文前三字母缩写
      const date = new Date().toLocaleDateString().split('/'); //2023 11 21
      date[2] = date[2].length === 1 ? '0' + date[2] : date[2];
      date[1] = new Date().toLocaleDateString('en', { month: 'short' });
      fieldValue[0] = `${date[2]} ${date[1]} ${date[0]}`;
    }
    const day = targetFieldDom.querySelector('input[placeholder="dd"]');
    const month = targetFieldDom.querySelector('select[ng-model="token.value"]');
    const year = targetFieldDom.querySelector('input[placeholder="yyyy"]');
    if (`${day.value} ${month.value?.replace('string:', '')} ${year.value}` !== fieldValue[0]) {
      console.log(`修改${field}`, fieldValue[0]);
      day.value = fieldValue[0].split(' ')[0];
      day.dispatchEvent(new Event('input'));
      month.value = 'string:' + fieldValue[0].split(' ')[1];
      month.dispatchEvent(new Event('change'));
      year.value = fieldValue[0].split(' ')[2];
      year.dispatchEvent(new Event('input'));
    }
  }
  window.electronAPI.ipcRenderer.send('doExecuteJavaScriptSuccess', targetWinId, { jsRes: true });
}

/* 执行添加受试者的动作 */
async function gotoSiteIndex({ targetWinId, pluginWinId } = {}) {
  const eIpc = window.electronAPI.ipcRenderer;
  const nav = document.querySelector('.nav-primary');
  const allExistedIdUl = nav.querySelector('#app_subjects .dropdown-options');
  //如果存在id列表,则代表已经在受试者页面
  if (allExistedIdUl) {
    const sitesChoosedEl = nav.querySelector('#study_environment_sites .dropdown-menu')?.querySelector('li.selected a');
    eIpc.sendSync('windowIpc', 'getMsg', { toBrowserWindowId: pluginWinId, data: { msg: '跳转到主页面，执行创建Subjects逻辑' } });
    await new Promise(resolve => {
      //点击后会刷新页面，会丢失当前页面的dom和注入的js，当前函数后续的代码也不会再执行,所以需要networkComplited的isReload模式来返回当前函数的结果
      resolve(window.electronAPI.ipcRenderer.invoke('networkComplited', targetWinId, { isReload: true, jsRes: true }));
      sitesChoosedEl?.click();
    });
  } else {
    eIpc.sendSync('windowIpc', 'getMsg', { toBrowserWindowId: pluginWinId, data: { msg: '当前已经在主页面，执行创建Subjects逻辑' } });
    window.electronAPI.ipcRenderer.send('doExecuteJavaScriptSuccess', targetWinId, { jsRes: true });
  }
}
async function doNewSubjectAction({ targetWinId, pluginWinId, allSubjectID } = {}) {
  const eIpc = window.electronAPI.ipcRenderer;
  console.log(allSubjectID);
  const addSubjectBtn = document.querySelector('a[data-testid="addSubjectLink"]');
  await new Promise(resolve => {
    resolve(window.electronAPI.ipcRenderer.invoke('networkComplited', targetWinId));
    addSubjectBtn?.click();
  });
  // const targetFieldDom = Array.from(document.querySelectorAll('.question-title-wrapper')).find(
  //   i => i.innerText.trim() === 'Screening Number',
  // )?.parentElement;
  // const inputEl = targetFieldDom.querySelector('.write-control-slot').querySelector('input[type="text"]');
  // inputEl.value = '999';
  // inputEl.dispatchEvent(new Event('input'));.
  eIpc.sendSync('windowIpc', 'getMsg', { toBrowserWindowId: pluginWinId, data: { msg: '保存受试者' } });
  await new Promise(resolve => {
    resolve(window.electronAPI.ipcRenderer.invoke('networkComplited', targetWinId));
    document.querySelector('#save-button')?.click();
  });
  eIpc.sendSync('windowIpc', 'getMsg', { toBrowserWindowId: pluginWinId, data: { msg: '保存受试者成功' } });
  window.electronAPI.ipcRenderer.send('doExecuteJavaScriptSuccess', targetWinId, { jsRes: true });
}
/* 执行添加受试者的动作end */
/* conditions */

/* target */
//执行字段值对比的动作
async function doCompareValueAction({ targetWinId, field, fieldValue } = {}) {
  let doStatus = false;
  //查找title为field的dom
  const fieldName = field.endsWith('#') ? field + '1' : field;
  const targetFieldDom = Array.from(document.querySelectorAll('.question-title-wrapper')).find(i => i.innerText.trim() === fieldName)?.parentElement;
  //点击类名为click-to-edit,进入编辑状态
  targetFieldDom.querySelector('.click-to-edit')?.click();
  // const ENUM_INPUTTYPE = ['radio', 'checkbox', 'textarea', 'date', 'inputsearch', 'dynamic-inputsearch', 'select']; // 普通的inputsearch尚未遇见
  const writeDom = targetFieldDom.querySelector('.write-control-slot')?.firstElementChild;
  let inputType = '';
  if (writeDom?.classList.contains('radio-button-edit')) {
    inputType = 'radio';
  } else if (writeDom?.classList.contains('checkbox-container')) {
    inputType = 'checkbox';
  } else if (writeDom?.classList.contains('long-text')) {
    inputType = 'textarea';
  } else if (writeDom?.hasAttribute('crf-date-time-write')) {
    inputType = 'date';
  } else if (writeDom?.classList.contains('dynamic-search-list-edit')) {
    inputType = 'dynamic-inputsearch';
  } else if (writeDom?.hasAttribute('drop-down-list-write')) {
    inputType = 'select';
  }
  if (inputType === 'dynamic-inputsearch') {
    //点击targetFieldDom下类名为ui-select-toggle的span
    await new Promise(resolve => {
      resolve(window.electronAPI.ipcRenderer.invoke('networkComplited', targetWinId));
      targetFieldDom.querySelector('.ui-select-toggle').click();
    });
    const ulList = document.querySelector('body>.ui-select-container');
    if (ulList) {
      //找到类名为ui-select-choices-row的节点，保存其innerText在数组中，去除空值
      const ulListText = Array.from(ulList.querySelectorAll('.ui-select-choices-row'))
        .map(i => i.innerText.trim())
        .filter(i => i);
      if (ulListText.join(',') === fieldValue.join(',')) {
        doStatus = true;
      }
    }
  }
  window.electronAPI.ipcRenderer.send('doExecuteJavaScriptSuccess', targetWinId, { jsRes: doStatus });
  return doStatus;
}

//执行判断visit当中是否存在指定form的动作
function doVisitFormAction({ targetWinId, visitName, formNames } = {}) {
  let doStatus = false;
  const folderTree = angular.element('#mdsolGambitApp').injector().get('foldersTreeService')?.data?.folders || [];
  const visitInfo = folderTree.find(i => i.name.trim().startsWith(visitName));
  if (visitInfo) {
    for (const formName of formNames) {
      const formInfo = visitInfo?.forms.find(i => i.name.trim() === formName.trim());
      doStatus = !!formInfo;
      if (!doStatus) {
        console.error('targets任务: 不存在该visit下的form', 'visit=', visitName, 'form=', formName);
        break;
      }
    }
    doStatus && console.log('targets任务: 该visit下的form都存在', 'visit=', visitName, 'form=', formNames.join(','));
  } else {
    console.error('targets任务: 不存在该visit', 'visit=', visitName);
  }
  window.electronAPI.ipcRenderer.send('doExecuteJavaScriptSuccess', targetWinId, { jsRes: doStatus });
  return doStatus;
}

//执行判断是否存在该列的动作
function doTableColumnAction({ targetWinId, fields } = {}) {
  let status = true; //fields是否都存在当前页面
  const questionTitleWrapper = Array.from(document.querySelectorAll('.question-title-wrapper'));
  for (const field of fields) {
    const targetFieldDom = questionTitleWrapper.find(i => i.innerText.trim() === field)?.parentElement;
    if (!targetFieldDom) {
      status = false;
      console.error('targets任务: 不存在该列', 'field=', field);
      break;
    }
  }
  window.electronAPI.ipcRenderer.send('doExecuteJavaScriptSuccess', targetWinId, { jsRes: status });
  return status;
}
/* target */

export {
  goToPage,
  goToTablePage,
  save,
  doInputValueAction,
  gotoSiteIndex,
  doNewSubjectAction,
  doCompareValueAction,
  doVisitFormAction,
  doTableColumnAction,
};
