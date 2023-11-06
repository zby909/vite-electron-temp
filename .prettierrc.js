module.exports = {
  endOfLine: 'lf',
  tabWidth: 2, // tab缩进大小,默认为2
  semi: true, // 使用分号, 默认true
  singleQuote: true, // 使用单引号, 默认false(在jsx中配置无效, 默认都是双引号)
  trailingComma: 'all', // 行尾逗号,默认none,可选 none|es5|all
  bracketSpacing: true, // 对象中的左右空格 默认true
  jsxBracketSameLine: false, // JSX标签闭合位置 默认false 跨行
  arrowParens: 'avoid', // 箭头函数参数括号 默认avoid 可选  avoid 能省略括号的时候就省略 例如x => x always 总是有括号
  printWidth: 150, //最大行数
};
