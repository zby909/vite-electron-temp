/*
 * @Description:生成方便别人查阅的中英文对照文件outPut.js，注意两个语言文件需要是commonjs导出的（因为是node脚本）
建议复制进来en、zh这两个语言文件用完再删
 * @Author: zby
 * @Date: 2022-12-27 16:36:26
 * @LastEditors: zby
 * @Reference:
 */
const enLocale = require('./en');
const zhLocale = require('./zh');
const fs = require('fs');

const getKeyValueByzh = (pageKey, valuekey) => {
  let v = '';
  for (const p in zhLocale) {
    for (const o in zhLocale[pageKey]) {
      if (pageKey === p && valuekey === o) {
        v = zhLocale[pageKey][valuekey];
      }
    }
  }
  return v;
};

const r = {};
for (const pageKey in enLocale) {
  r[pageKey] = {};
  for (const valuekey in enLocale[pageKey]) {
    r[pageKey][valuekey] = {
      en: enLocale[pageKey][valuekey],
      cn: getKeyValueByzh(pageKey, valuekey),
    };
  }
}

fs.writeFile('./outPut.js', `module.exports = ${JSON.stringify(r, '\n')}`, { flag: 'a' }, err => {
  console.log(err);
});
