/*
 * @Description:
 * @Author: zby
 * @Date: 2022-12-15 11:28:29
 * @LastEditors: zby
 * @Reference:
 */

const fs = require('fs');

function isDirEmpty(dirname) {
  const files = fs.readdirSync(dirname);
  return files.length === 0;
}

function isExistsFile(fileSrc) {
  return fs.existsSync(fileSrc);
}

function openDir(dirPath) {
  const { exec } = window.electronNodeAPI.require('child_process');
  const iconv = window.electronNodeAPI.require('iconv-lite');
  exec(`start "" "${dirPath}"`, { encoding: 'buffer' }, (err, stdout, stderr) => {
    const t = iconv.decode(stderr, 'cp936');
    return t;
  });
}

export { isDirEmpty, isExistsFile, openDir };
