import mongoose from 'mongoose'
import CategoryModel from './../../models/Category.model'

const Category = mongoose.model('Category')

class CategoryController {

  /**
   * 检查分类是否存在
   * @param {*} ctx
   */
  async check(ctx) {
    const { body } = ctx.request;
    try {
      const category = await Category.findOne({ name: body.name });
      if (category) {
        ctx.status = 400;
        ctx.body = {
          message: '分类已存在',
        }
        return;
      }
      ctx.status = 200;
      ctx.body = {
        message: '分类可以使用',
      }
    } catch (error) {
      ctx.throw(5000)
    }
  }

  /**
   * 新增分类
   * @param {*} ctx
   */
  async add(ctx) {
    const { body } = ctx.request
    try {
      if (!body.name) {
        ctx.status = 400;
        ctx.body = {
          message: '分类名称不能为空',
        }
        return;
      }
      await Category.create({
        name: body.name,
        createTime: Date.now(),
        updateTime: Date.now(),
      })

      ctx.status = 200;
      ctx.body = {
        message: '操作成功',
      }
    } catch (error) {
      ctx.throw(500)
    }
  }

  /**
   * 更新分类
   * @param {*} ctx
   */
  async update(ctx) {
    const { body } = ctx.request
    try {
      if (!body.name) {
        ctx.status = 400;
        ctx.body = {
          message: '分类名称不能为空',
        }
        return;
      }
      const category = await Category.findByIdAndUpdate(body.id, {
        name: body.name,
        updateTime: Date.now(),
      })
      ctx.status = 200;
      ctx.body = {
        message: '操作成功',
        category,
      }
    } catch (error) {
      ctx.throw(500)
    }
  }
  /**
   * 删除分类
   * @param {*} ctx
   */
  async remove(ctx) {
    try {
      const { body } = ctx.request
      if (body.id) {
        await Category.findByIdAndRemove(body.id)
        ctx.status = 200
        ctx.body = {
          message: '操作成功',
        }
      }
    } catch (error) {
      ctx.throw(500)
    }
  }

  async findCategoryById(ctx) {
    try {
      const { body } = ctx.request
      if (body.id) {
        const category = await Category.findById(body.id)
        ctx.status = 200
        ctx.body = {
          category,
        }
        return;
      }
      ctx.status = 400
      ctx.body = {
        message: 'id不能为空',
      }
    } catch (error) {
      ctx.throw(500)
    }
  }
}

export default new CategoryController()
