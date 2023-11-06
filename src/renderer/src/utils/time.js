/*
 * @Description:
 * @Author: zby
 * @Date: 2023-04-20 10:42:35
 * @LastEditors: zby
 * @Reference:
 */
import dayjs from 'dayjs';
// console.log(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'));

/* 格式化时间 */
//params: 时间戳/new Date(?)
const dayFormat = (timeval = new Date(), format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(timeval).format(format);
};

export { dayjs, dayFormat };
