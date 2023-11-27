<!--
 * @Description:
 * @Author: zby
 * @Date: 2023-11-22 15:31:41
 * @LastEditors: zby
 * @Reference:
-->
<template>
  <div>
    <button @click="startTask">startTask</button>
  </div>
</template>

<script setup lang="ts">
import { useWinStore } from '@/stores/modules/win';
const winStore = useWinStore();

const startTask = () => {
  console.log('startTask', winStore);
  window.electronAPI.ipcRenderer.send('doExecuteJavaScript', {
    browserWindowId: winStore.targetWinId,
    script: `
    (function(){
      console.log('doExecuteJavaScript');
    })()
  `,
  });
};
</script>
<style scoped lang="scss"></style>
