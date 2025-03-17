<!--
 * @Description:
 * @Author: zby
 * @Date: 2024-01-15 15:53:30
 * @LastEditors: zby
 * @Reference:
-->
<template>
  <div>
    <button @click="searchPuppeteer">search by puppeteer</button>
  </div>
</template>

<script setup lang="ts">
const fs = require('fs');
const puppeteer = require('puppeteer');

const searchPuppeteer = async () => {
  fs.readFile('package.json', (err, data) => {
    if (err) throw err;
    console.log(data.toString());
  });
  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9228',
    defaultViewport: null,
  });
  const pages = await browser.pages();
  const targetPage = pages.find(page => page.url().includes('juejin'));
  if (targetPage) {
    await targetPage.goto('https://juejin.cn/', { waitUntil: ['networkidle0'] }); //等待网络空闲时，再执行下一步
    const searchInput = await targetPage.waitForSelector("input[type='search']", { timeout: 3000 });
    await searchInput.type('juejin');
    await Promise.all([targetPage.waitForNavigation({ waitUntil: 'networkidle0' }), searchInput.press('Enter')]); // 搜索并等待页面加载完成
    console.log('搜索完成');
  }
};
</script>
<style scoped lang="scss"></style>
