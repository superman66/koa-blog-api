/**
 * 根据 object 转换为 表单错误数组
 * 包含:
 * field 字段名
 * message: 错误信息
 * @param {*} obj
 */
export default function objectToFormFieldArray(obj) {
  const list = []
  Object.keys(obj).forEach((i) => {
    if (obj[i]) {
      list.push({
        field: obj[i].path,
        message: obj[i].message,
      })
    }
  })
  return list
}
