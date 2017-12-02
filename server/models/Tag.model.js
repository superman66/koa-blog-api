import mongoose, { Schema } from 'mongoose'

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

export default mongoose.model('Tag', TagShema)

