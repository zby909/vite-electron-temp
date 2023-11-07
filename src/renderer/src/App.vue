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
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import en from 'element-plus/dist/locale/en.mjs';
import { useAppStore } from '@/stores/modules/app';
console.log('app.vue');

let homeApi;
const IS_PROD = ['production'].includes(import.meta.env.MODE);
const IS_BETA = ['beta'].includes(import.meta.env.MODE);
const appStore = useAppStore();
const locale = computed(() => {
  return appStore.language === 'zh-cn' ? zhCn : en;
});

onBeforeMount(async () => {
  console.log('app.vue onMounted');
  const api = await import('@/api/modules/home.api'); //app.vue先于main.ts执行，此时pinia还未初始化，如果直接在setup中引用api会报错，因为request.ts中引用了pinia
  homeApi = api.default;

  document.title = `${IS_PROD ? 'Electron' : IS_BETA ? 'Electron_BETA' : 'Electron_TEST'} v${appStore.appVersion}`;
  homeApi.ping();
});
</script>

<style lang="scss"></style>
