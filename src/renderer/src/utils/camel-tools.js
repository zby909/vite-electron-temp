//驼峰转为指定符号分割 globalSetting/GlobalSetting => global-setting
function camelTolineSplit(camelStr, type = '-') {
  return camelStr
    .replace(/[A-Z]/g, s => {
      return ' ' + s.toLowerCase();
    })
    .trim()
    .replaceAll(' ', type);
}

//指定符号分割转为驼峰 global-setting => globalSetting or GlobalSetting
function lineSplitToCamel(str, type = '-', firstCode = false) {
  let camelVal = str.toLowerCase().replace(new RegExp(`${type}([a-z])`, 'g'), s => {
    return s.charAt(1).toUpperCase();
  });
  firstCode && (camelVal = camelVal.charAt(0).toUpperCase() + camelVal.slice(1));
  return camelVal;
}

export { camelTolineSplit, lineSplitToCamel };
