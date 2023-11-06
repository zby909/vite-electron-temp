/*
 * @Description:根据outPut.js还原回en.js和zh.js
 * @Author: zby
 * @Date: 2022-12-27 17:09:12
 * @LastEditors: zby
 * @Reference:
 */
const outData = require('./outPut');
const fs = require('fs');

const cn = {};
const en = {};
for (const pageKey in outData) {
  cn[pageKey] = {};
  en[pageKey] = {};
  for (const valuekey in outData[pageKey]) {
    cn[pageKey][valuekey] = outData[pageKey][valuekey].cn;
    en[pageKey][valuekey] = outData[pageKey][valuekey].en;
  }
}

fs.writeFile('./zh2.js', `export default ${JSON.stringify(cn, '\n')}`, { flag: 'a' }, err => {
  console.log(err);
});

fs.writeFile('./en2.js', `export default ${JSON.stringify(en, '\n')}`, { flag: 'a' }, err => {
  console.log(err);
});
