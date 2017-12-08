import mongoose, { Schema } from 'mongoose'

const MenuSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  children: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Menu',
    },
  ],
  // 菜单排序的权重，数字越小越靠前
  order: {
    type: Number,
    default: 0,
  },
  createTime: {
    type: Date,
    default: Date.now(),
  },
})

export default mongoose.model('Menu', MenuSchema)

