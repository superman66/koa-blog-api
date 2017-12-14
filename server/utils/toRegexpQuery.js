
/**
 * 将搜索内容转换为mongoose的正则匹配数组
 * @param {string | Array} filterColumn 过滤字段
 * @param {*} word 搜索关键词
 */
export function toRegexpQuery(filterColumn, word) {
  let query = []
  if (Array.isArray(filterColumn)) {
    filterColumn.forEach((col) => {
      query.push({
        [col]: new RegExp(word),
      })
    })
  } else if (typeof filterColumn === 'string') {
    query.push({
      [filterColumn]: new RegExp(word),
    })
  } else {
    Error(500, 'filterColumn should be array or string')
  }
  return query
}

