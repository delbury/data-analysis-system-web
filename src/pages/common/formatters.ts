/**
 * 格式化函数
 */

// 时刻转换 xx:yy:zz --> xx:yy
export const timeHms2Hm = (time: string) => time.replace(/:\d{2}/, '');
