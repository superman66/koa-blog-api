/**
 * 根据 errors 格式转换
 * 包含:
 * {字段名:错误信息}
 * @param {*} obj
 */
export default function formatErrors(obj) {
  const errors = {}
  Object.keys(obj).forEach((i) => {
    if (obj[i]) {
      errors[obj[i].path] = obj[i].message
    }
  })
  return errors
}
