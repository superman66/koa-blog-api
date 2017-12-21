import mongoose, {
  Schema,
} from 'mongoose'

const TagShema = new Schema({
  name: {
    type: String,
    required: true,
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
  updateTime: {
    type: Date,
    default: Date.now,
  },
})

class TagClass {
  static findTagsPagination(page, pageSize, params) {
    return this.find()
      .or(params.query)
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .sort(params.sort)
      .select('name createTime updateTime')
  }

  static findTags(params) {
    return this.find()
      .or(params.query)
      .sort(params.sort)
      .select('name createTime updateTime')
  }
}

TagShema.loadClass(TagClass)
export default mongoose.model('Tag', TagShema)
