import mongoose, { Schema } from 'mongoose'

const CategorySchema = new Schema({
  name: String,
  createTime: {
    type: Date,
    default: Date.now(),
  },
  updateTime: Date,
})

export default mongoose.model('Category', CategorySchema)
