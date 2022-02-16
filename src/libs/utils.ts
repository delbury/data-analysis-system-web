// 判断值是否为空
export const isEmpty = (val: unknown) => {
  if(val == void 0 || val === '') return true;
  if(Array.isArray(val)) return !val.length;
  return false;
};
