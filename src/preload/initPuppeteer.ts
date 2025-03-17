import puppeteer from 'puppeteer';

let browser: puppeteer.Browser | null = null;

export default async function initPuppeteer() {
  console.log('puppeteer');
  browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9228',
    defaultViewport: null,
  });
  console.log('puppeteer connected', browser);
  // const targetPage = pages.find(page => page.url().includes('juejin'));
  // if (targetPage) {
  //   // targetPage.setViewport({ width: 1000, height: 1080 });
  //   // 进入页面
  //   await targetPage.goto('https://juejin.cn/', {
  //     waitUntil: ['networkidle0'], //等待网络空闲时，再执行下一步
  //   });
  //   await targetPage.waitForSelector('.seach-icon-container', {
  //     timeout: 3000,
  //   }); //等待搜索按钮加载完成
  //   await targetPage.type("input[type='search']", 'juejin', { delay: 0 }); //输入搜索内容
  //   await Promise.all([
  //     targetPage.waitForNavigation({ waitUntil: 'networkidle0' }),
  //     await targetPage.click('.seach-icon-container'), //点击搜索按钮
  //   ]); // 点击搜索按钮并等待页面加载完成
  //   console.log('搜索完成');
  // }
  return browser;
}
