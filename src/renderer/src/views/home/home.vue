<!--
 * @Description:
 * @Author: zby
 * @Date: 2023-10-17 10:30:23
 * @LastEditors: zby
 * @Reference:
-->
<template>
  <div class="home_page">
    <button @click="showT">show target win</button>
    <button @click="startReleaseTask">startReleaseTask</button>
    <button @click="startCheckTask">startCheckTask</button>
    <button @click="login">login</button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/modules/app';
import { useWinStore } from '@/stores/modules/win';
import homeApi from '@/api/modules/home.api';
import { task1, task2, tasks } from './release/task';
import * as script from './release/script';

homeApi.ping();
const appStore = useAppStore();
const winStore = useWinStore();
const { thisBrowserId } = storeToRefs(appStore);
onBeforeMount(() => {
  console.log('home.vue onBeforeMount');
});
onMounted(() => {
  console.log('home.vue onMounted');
  window.electronAPI.ipcRenderer.on('getMsg', (event, v) => {
    console.log('子窗口x信息:', v.msg);
  });
});
onBeforeUnmount(() => {
  window.electronAPI.ipcRenderer.removeAllListeners('getMsg');
  console.log('home.vue onBeforeUnmount');
});
// const showC = async () => {
//   const winId = await window.electronAPI.ipcRenderer.invoke('createNewWindow', {
//     browserWindowOpt: {
//       parentWinId: thisBrowserId.value,
//     },
//     hashRoute: '#/control',
//   });
//   console.log(winId);
// };
const showT = async () => {
  const winId = await window.electronAPI.ipcRenderer.invoke('createNewWindow', {
    browserWindowOpt: {
      parentWinId: thisBrowserId.value,
    },
    outUrl: 'https://login-innovate.imedidata.com/login',
  });
  winStore.UPDATA_TARGETWINID(winId);
  console.log(winId);
};

const startReleaseTask = async () => {
  console.log('startReleaseTask', winStore, script);
  // script.doTest(task1);
  for (const task of tasks) {
    console.log(`%c start task ${task.lineNum}，uuid: ${task.uuid}`, 'color:red;');
    await script.doTest(task);
  }
};

const startCheckTask = async () => {
  console.log('startCheckTask', winStore, script);
  script.doTest(task1);
  // for (const task of tasks) {
  //   console.log(`start task ${task.lineNum}，uuid: ${task.uuid}`);
  //   await script.doTest(task);
  // }
};

const login = async () => {
  const res = await window.electronAPI.ipcRenderer.invoke('doExecuteJavaScript', {
    browserWindowId: winStore.targetWinId,
    script: `
    (function(){
      console.log('login');
      const u=document.querySelector('[data-testid="username"]')
      u.value = 'baoyi';
      const p=document.querySelector('[data-testid="password"]')
      p.value = 'Da909908..';
      window.electronAPI.ipcRenderer.send('doExecuteJavaScriptSuccess', ${winStore.targetWinId},'loginsuccess');
    })()
  `,
  });
  console.log(res);
};
</script>

<style scoped lang="scss"></style>

<style lang="scss"></style>
