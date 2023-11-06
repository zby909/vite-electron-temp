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
const appStore = useAppStore();
const locale = computed(() => {
  return appStore.language === 'zh-cn' ? zhCn : en;
});
</script>

<style lang="scss"></style>
