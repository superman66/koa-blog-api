import mongoose, { Schema } from 'mongoose'

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
}

CategorySchema.loadClass(CategoryClass)
export default mongoose.model('Category', CategorySchema)
