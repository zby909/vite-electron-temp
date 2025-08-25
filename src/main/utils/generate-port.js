/*
 * @Description: 生成一个本机可用的端口号
 * @Author: zby
 * @Date: 2022-05-16 16:37:23
 * @LastEditors: zby
 * @Reference: 使用时间戳作为seed基数 生成指定范围内的随机端口号并递归判断该生成的端口号是否可用
 */

import { exec } from 'child_process';

//getRandomNum: https://www.cnblogs.com/lhj2015/p/5122970.html
function getRandomNum(Min = 4000, Max = 65535, seed = +new Date()) {
  seed = (seed * 9301 + 49297) % 233280;
  const rnd = seed / 233280;
  return Math.round(Min + rnd * (Max - Min));
}

const tryUsePort = async function (port = getRandomNum()) {
  function portUsed(port) {
    return new Promise(resolve => {
      exec(`netstat -aon|findstr ${port}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          resolve(port); //有错误信息就代表这个端口未存在 就可以用
        }
        if (stdout) {
          console.log(`stdout: ${stdout}`);
          resolve(new Error()); //有输出信息就代表这个端口已经被别人使用了
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }
      });
    });
  }
  const res = await portUsed(port);
  if (res instanceof Error) {
    console.log(`端口：${port}被占用\n`);
    return tryUsePort(getRandomNum());
  } else {
    return port;
  }
};

// const op = [];
// const test = async () => {
//   for (let i = 0; i < 5000; i++) {
//     const a = +new Date();
//     const p = await tryUsePort(getRandomNum(4000, 65535, a));
//     if (op.includes(p)) {
//       console.log(op.filter(i => i.port === p));
//       console.log(new Error('重复的端口' + p + ' ' + a));
//       return;
//     }
//     op.push({ port: p, data: a });
//   }
//   console.log(op);
// };
// test();

// tryUsePort(4000).then(p => {
//   console.log(p);
// });

export { tryUsePort, getRandomNum };
