/*
 * @Description:
 * @Author: zby
 * @Date: 2022-03-10 17:57:35
 * @FilePath: \tfl-client\src\lang\index.js
 * @LastEditors: zby
 * @Reference:
 */
import { createI18n } from 'vue-i18n';
// // 引入vxe-table的组件国际化
// import { VXETable } from 'vxe-table';
// import vxeTableZh from 'vxe-table/lib/locale/lang/zh-CN';
// import vxeTableEn from 'vxe-table/lib/locale/lang/en-US';
// 引入本地自定义的国际化字典
import enLocale from './en';
import zhLocale from './zh';

const messages = {
  en: {
    ...enLocale,
    // ...elementEnLocale,
    // ...vxeTableEn,
  },
  zh: {
    ...zhLocale,
    // ...elementZhLocale,
    // ...vxeTableZh,
  },
};

export function getLanguage() {
  const chooseLanguage = localStorage.getItem('language');
  if (chooseLanguage) return chooseLanguage;

  // if has not choose language
  const language = navigator.language.toLowerCase();
  const locales = Object.keys(messages);
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale;
    }
  }
  return 'en';
}

const i18n = createI18n({
  globalInjection: true,
  locale: getLanguage(),
  messages,
});

// ElementLocale.i18n((key, value) => i18n.t(key, value));
// VXETable.setup({
//   // 对组件内置的提示语进行国际化翻译
//   i18n: (key, value) => i18n.global.t(key, value),
// });

export default i18n;
