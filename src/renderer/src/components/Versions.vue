<!--
 * @Description:
 * @Author: zby
 * @Date: 2023-10-16 16:28:19
 * @LastEditors: zby
 * @Reference:
-->

<template>
  <ul class="versions">
    <li class="electron-version">Electron v{{ versions.electron }}</li>
    <li class="chrome-version">Chromium v{{ versions.chrome }}</li>
    <li class="node-version">Node v{{ versions.node }}</li>
    <li class="v8-version">V8 v{{ versions.v8 }}</li>
  </ul>
</template>

<script setup lang="ts">
import getCurrentInstance from '@/hooks/useCurrentInstance';
const { globalProperties } = getCurrentInstance();
globalProperties.$g_message.success('Hi ~');
const versions = reactive({ ...window.electronAPI.process.versions });
</script>
