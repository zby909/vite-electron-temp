<template>
  <div>
    <button @click="showTargetUrl">showTargetUrl</button>
    <button @click="search">使用简单注入js</button>
    <button @click="searchByCdp">使用cdp协议操作</button>
    <button @click="showPuppeteerWin">showPuppetWin</button>
  </div>
</template>

<script setup lang="ts">
import showTargetUrl from '@/hooks/openTargetWebSite';
import showPuppeteerWin from '@/hooks/openPuppeteerWebSite';
import { useWinStore } from '@/stores/modules/win';

const winStore = useWinStore();

/* 假设网页已成功加载，直接输入并搜索 */
const search = async () => {
  const res = await window.electronAPI.ipcRenderer.invoke('doExecuteJavaScript', {
    browserWindowId: winStore.targetWinId,
    script: `
    (function(){
      const input = document.querySelector('input[type="search"]');
      input.value = 'juejin';
      // 在操作一些使用框架的网站时，因为框架的事件监听机制，直接修改value不会触发事件，需要手动触发
      input.dispatchEvent(new Event('input'));
      const btn = document.querySelector('.seach-icon-container');
      btn.click();
    })()
  `,
  });
  console.log(res);
};

const searchByCdp = async () => {
  const res = await window.electronAPI.ipcRenderer.invoke('cdpTest', {
    browserWindowId: winStore.targetWinId,
  });
  console.log(res);
};
</script>
<style scoped lang="scss"></style>
