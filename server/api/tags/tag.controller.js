import mongoose from 'mongoose'
import TagModel from '../../models/Tag.model'

const Tag = mongoose.model('Tag')

class TagController {

  /**
   * 获取tag列表
   * 没有带pagesize参数则获取全部
   * @param {*} ctx
   */
  async tags(ctx) {
    try {
      const tags = await Tag.find()
      ctx.status = 200
      ctx.body = {
        message: '操作成功',
        data: {
          tags,
        },
      }
    } catch (error) {
      ctx.throw(500)
    }
  }

  /**
   * 新增tag
   * @param {*} ctx
   */
  async add(ctx) {
    const { body } = ctx.request
    try {
      await Tag.create(body)
      ctx.status = 200
      ctx.body = {
        message: '操作成功',
      }
    } catch (error) {
      ctx.throw(500)
    }
  }

  /**
   * 删除tag
   * @param {*} ctx
   */
  async remove(ctx) {
    const { id } = ctx.request.body
    try {
      if (id === undefined || id === '') {
        ctx.status = 400
        ctx.body = {
          message: 'id不能为空',
        }
        return;
      }
      await Tag.findByIdAndRemove(id)
      ctx.status = 200
      ctx.body = {
        message: '操作成功',
      }
    } catch (error) {
      ctx.throw(500)
    }
  }
}

export default new TagController()
