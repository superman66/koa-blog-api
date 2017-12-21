import mongoose, {
  Schema,
} from 'mongoose'

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  createTime: {
    type: Date,
    default: Date.now(),
  },
  updateTime: {
    type: Date,
    default: Date.now(),
  },
})

class CategoryClass {

  /**
   * 获取 Category 分页列表
   * @param {*} page
   * @param {*} pageSize
   * @param {*} params
   */
  static findCategoriesPagination(page, pageSize, params) {
    return this.find()
      .or(params.query)
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .sort(params.sort)
      .select('name createTime updateTime')
  }

  /**
   * 获取 Category 列表
   * @param {*} page
   * @param {*} pageSize
   * @param {*} params
   */
  static findCategories(params) {
    return this.find()
      .or(params.query)
      .sort(params.sort)
      .select('name createTime updateTime')
  }
}

CategorySchema.loadClass(CategoryClass)
export default mongoose.model('Category', CategorySchema)
