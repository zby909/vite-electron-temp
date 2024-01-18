<!--
 * @Description:
 * @Author: zby
 * @Date: 2024-01-15 15:53:30
 * @LastEditors: zby
 * @Reference:
-->
<template>
  <div>
    <button @click="showTargetUrl">showTargetUrl</button>
    <button @click="search">search</button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/modules/app';
import { useWinStore } from '@/stores/modules/win';

const appStore = useAppStore();
const winStore = useWinStore();
const { thisBrowserId } = storeToRefs(appStore);

const showTargetUrl = async () => {
  const winId = await window.electronAPI.ipcRenderer.invoke('createNewWindow', {
    browserWindowOpt: { parentWinId: thisBrowserId.value, minWidth: 0, minHeight: 0 },
    outUrl: 'https://baidu.com',
  });
  winStore.UPDATA_TARGETWINID(winId);
  console.log(winId);
};

const search = async () => {
  const res = await window.electronAPI.ipcRenderer.invoke('doExecuteJavaScript', {
    browserWindowId: winStore.targetWinId,
    script: `
    (function(){
      const input = document.querySelector('#kw');
      input.value = '掘金';
      input.dispatchEvent(new Event('input')); // maybe need
      const btn = document.querySelector('#su');
      btn.click();
    })()
  `,
  });
  console.log(res);
};
</script>
<style scoped lang="scss"></style>
