import mongoose, { Schema } from 'mongoose'

const TagShema = new Schema({
  name: String,
  createTime: {
    type: Date,
    default: Date.now,
  },
  updateTime: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model('Tag', TagShema)

