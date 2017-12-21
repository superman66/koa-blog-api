import mongoose, {
  Schema
} from 'mongoose'

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
  children: [{
    type: Schema.Types.ObjectId,
    ref: 'Menu',
  }, ],
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

class MenuClass {

  static findMenusPagination(page, pageSize, params) {
    return this.find()
      .populate({
        path: 'children',
        select: 'name key link icon children order',
      })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .sort(params.sort)
      .select('name key link icon children order')
  }

  static findMenus(params) {
    return this.find()
      .sort(params.sort)
      .populate({
        path: 'children',
        select: ' name key link icon children order',
      })
      .select(' name key link icon children order')
  }
}

MenuSchema.loadClass(MenuClass)
export default mongoose.model('Menu', MenuSchema)
