const angular = {};

//去到页面
const goToPage = async ({ targetWinId, pluginWinId, visit, form } = {}) => {
  const eIpc = window.electronAPI.ipcRenderer;
  eIpc.send('windowIpc', 'getMsg', { toBrowserWindowId: pluginWinId, data: { msg: '在这里可以发送注入脚本当中的信息给插件窗口展示' } });
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
        resolve(window.electronAPI.ipcRenderer.invoke('networkComplited', targetWinId, { isReload: true, jsRes: doStatus }));
        conditionsTR.querySelector('.view-portrait-link-icon')?.click();
        location.reload(); //假设点击后会刷新页面，会丢失当前页面的dom和注入的js, 所以如果此脚本到此结束，则需要isReload模式来返回当前函数的结果
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
    resolve(window.electronAPI.ipcRenderer.invoke('networkComplited', targetWinId));
    document.querySelector('#save-button')?.click();
  });
  window.electronAPI.ipcRenderer.send('doExecuteJavaScriptSuccess', targetWinId, { jsRes: true });
};

//执行给字段赋值的动作
async function doInputValueAction({ targetWinId, field, fieldAction, fieldValue } = {}) {
  let status = true;
  const targetFieldDom = Array.from(document.querySelectorAll('.question-title-wrapper')).find(i => i.innerText.trim() === field)?.parentElement;
  //点击类名为click-to-edit,进入编辑状态
  targetFieldDom.querySelector('.click-to-edit')?.click();
  // const ENUM_INPUTTYPE = ['radio', 'checkbox', 'textarea', 'date', 'inputsearch', 'dynamic-inputsearch', 'select']; // 普通的inputsearch尚未遇见
  const writeDom = targetFieldDom.querySelector('.question-content-wrapper .write-control-slot')?.firstElementChild;
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
  if (inputType === 'dynamic-inputsearch') {
    const clearSelect = writeDom.querySelector('a[aria-label="Select box clear"]');
    if (fieldValue === 'Empty') {
      clearSelect?.click();
    } else {
      await new Promise(resolve => {
        resolve(window.electronAPI.ipcRenderer.invoke('networkComplited', targetWinId));
        targetFieldDom.querySelector('.ui-select-toggle').click();
      });
      const ulList = document.querySelector('body>.ui-select-container') || [];
      //找到对应的.ui-select-choices-row 点击
      const li = Array.from(ulList.querySelectorAll('.ui-select-choices-row')).find(i => i.innerText.trim() === fieldValue);
      if (li) {
        li.click();
      } else {
        status = false;
        console.error('没有找到对应的li', fieldValue);
      }
    }
  }
  if (inputType === 'textarea') {
    //找到targetFieldDom下textarea,判断值是否等于fieldValue[0]
    const textarea = targetFieldDom.querySelector('textarea');
    const textareaTestValue = textarea.value.trim() === fieldValue;
    //如果textarea不等于fieldValue[0],则将textarea的值设置为fieldValue[0]
    if (!textareaTestValue) {
      console.log(`修改${field}`, fieldValue);
      textarea.value = fieldValue;
      textarea.dispatchEvent(new Event('input'));
    }
  }
  if (inputType === 'radio') {
    //找到targetFieldDom下所有的type="radio"的input，并判断是否有被选中的且选中的那个input的父元素的innerText是否等于fieldValue[0]
    const allRadio = Array.from(targetFieldDom.querySelectorAll('input[type="radio"]'));
    if (fieldValue === 'Empty') {
      allRadio.find(i => i.checked)?.click();
    } else {
      allRadio.find(i => i.parentElement.innerText.trim() === fieldValue)?.click();
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
    if (fieldValue === 'present') {
      //转换成"24 May 2013"格式，月份为英文前三字母缩写
      const date = new Date().toLocaleDateString().split('/'); //2023 11 21
      date[2] = date[2].length === 1 ? '0' + date[2] : date[2];
      date[1] = new Date().toLocaleDateString('en', { month: 'short' });
      fieldValue = `${date[2]} ${date[1]} ${date[0]}`;
    }
    const day = targetFieldDom.querySelector('input[placeholder="dd"]');
    const month = targetFieldDom.querySelector('select[ng-model="token.value"]');
    const year = targetFieldDom.querySelector('input[placeholder="yyyy"]');
    if (`${day.value} ${month.value?.replace('string:', '')} ${year.value}` !== fieldValue) {
      console.log(`修改${field}`, fieldValue);
      day.value = fieldValue.split(' ')[0];
      day.dispatchEvent(new Event('input'));
      month.value = 'string:' + fieldValue.split(' ')[1];
      month.dispatchEvent(new Event('change'));
      year.value = fieldValue.split(' ')[2];
      year.dispatchEvent(new Event('input'));
    }
  }
  window.electronAPI.ipcRenderer.send('doExecuteJavaScriptSuccess', targetWinId, { jsRes: status });
}

//执行queryMessage对比的动作
async function doCompareQueryMessageAction({ targetWinId, field, queryMessage } = {}) {
  let doStatus = false;
  //查找title为field的dom
  const targetFieldDom = Array.from(document.querySelectorAll('.question-title-wrapper')).find(i => i.innerText.trim() === field)?.parentElement;
  const queryMessageDom = targetFieldDom.querySelector('.question-status-markings');
  const text = queryMessageDom?.querySelector('.mcc-row .content')?.innerText;
  if (text?.trim() === queryMessage) {
    doStatus = true;
  }
  window.electronAPI.ipcRenderer.send('doExecuteJavaScriptSuccess', targetWinId, { jsRes: doStatus });
}

export { goToPage, goToTablePage, save, doInputValueAction, doCompareQueryMessageAction };
