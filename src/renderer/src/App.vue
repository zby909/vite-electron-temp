<!--
 * @Description:
 * @Author: zby
 * @Date: 2023-10-16 16:28:19
 * @LastEditors: zby
 * @Reference:
-->

<template>
  <el-config-provider :locale="locale">
    <div spellcheck="false">
      <router-view />
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
console.log('app.vue');
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import en from 'element-plus/dist/locale/en.mjs';
import { useAppStore } from '@/stores/modules/app';
const appStore = useAppStore();

const IS_PROD = ['production'].includes(import.meta.env.MODE);
const IS_BETA = ['beta'].includes(import.meta.env.MODE);
const locale = computed(() => {
  return appStore.language === 'zh-cn' ? zhCn : en;
});

onBeforeMount(async () => {
  console.log('app.vue onMounted');
  document.title = `${IS_PROD ? 'Electron' : IS_BETA ? 'Electron_BETA' : 'Electron_TEST'} v${appStore.appVersion}`;
});
</script>

<style></style>
