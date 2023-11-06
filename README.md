<!--
 * @Description:
 * @Author: zby
 * @Date: 2023-11-06 16:15:33
 * @LastEditors: zby
 * @Reference:
-->

# vite-electron-temp

An Electron application with Vue and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
正式环境打包 For: master
# For windows
$ npm run build_prod:win

# For macOS（未测试兼容性）
$ npm run build_prod:mac

# For Linux（未测试兼容性）
$ npm run build_prod:linux
```

```bash
beta环境打包 For: pre-master
# For windows
$ npm run build_beta:win
```

```bash
测试环境打包 For: 任意分支
# For windows
$ npm run build_test:win
```

### Tips

若启动项目需要等待 5 次超时才能进入，请尝试打开项目前挂一次梯子即可（不用 vue 调试工具的话就去注释掉 main/index.ts 里面'installExtension'相关的 try catch 代码 就不用等了）。
