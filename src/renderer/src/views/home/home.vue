<!--
 * @Description:
 * @Author: zby
 * @Date: 2023-10-17 10:30:23
 * @LastEditors: zby
 * @Reference:
-->
<template>
  <div class="home_page">
    <button @click="tomypage">tomypage</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();

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
const tomypage = () => {
  router.push({ path: '/testrpa' });
};
</script>

<style scoped lang="scss"></style>

<style lang="scss"></style>
