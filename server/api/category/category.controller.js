import mongoose from 'mongoose'
import { isNullOrUndefined, isNumber } from 'util';
import CategoryModel from './../../models/Category.model'
import * as pagination from '../../constants/Pagination'
import formErrorMiddleware from '../../middlewares/formErrorMiddleware';

const Category = mongoose.model('Category')

class CategoryController {
  /** 分页列表
   *  page：当前页数
   *  pagesize: 每页数量
   *  sortColunm 排序字段
   *  orderType desc asc default
   * you can get uers with it
   */
  async categories(ctx) {
    let { page, pagesize = pagination.PAGE_SIZE } = ctx.query
    const { sortColumn = pagination.SORT_COLUMN, orderType = pagination.ORDER_TYPE } = ctx.query

    const params = {
      sort: {},
      filter: {},
    }
    params.sort[sortColumn] = orderType

    try {
      // 使用分页
      if (!isNullOrUndefined(page) && isNumber(parseInt(page, 0))) {
        page = parseInt(page, 0)
        pagesize = parseInt(pagesize, 0)

        const total = await Category.count()
        const categories = await Category.find()
          .skip(pagesize * (page - 1))
          .limit(pagesize)
          .sort(params.sort)
          .select('_id name createTime updateTime')
        ctx.status = 200
        ctx.body = {
          data: {
            page: {
              page,
              pagesize,
              total,
            },
            items: categories,
          },
        }
      } else {
        const categories = await Category.find()
          .sort(params.sort)
          .select('_id name createTime updateTime')
        ctx.status = 200
        ctx.body = {
          data: {
            items: categories,
          },
        }
      }
    } catch (error) {
      formErrorMiddleware(ctx, error)
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
          errors: [
            { name: '分类名称不能为空' },
          ],
        }
        return;
      }
      const category = await Category.findOne({ name: body.name });
      if (category) {
        ctx.status = 400;
        ctx.body = {
          errors: [
            { name: '分类已存在' },
          ],
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
      formErrorMiddleware(ctx, error)
    }
  }

  /**
   * 更新分类
   * @param {*} ctx
   */
  async update(ctx) {
    const { body } = ctx.request
    const { id } = ctx.params
    try {
      let category = await Category.findOne({ name: body.name });
      if (!category) {
        category = await Category.findByIdAndUpdate(id, {
          name: body.name,
          updateTime: Date.now(),
        }, { new: true })
        ctx.status = 200;
        ctx.body = {
          message: '操作成功',
          category,
        }
      } else {
        ctx.status = 400;
        ctx.body = {
          errors: [
            { name: '分类名称已存在' },
          ],
        }
      }
    } catch (error) {
      formErrorMiddleware(ctx, error)
    }
  }
  /**
   * 删除分类
   * @param {*} ctx
   */
  async remove(ctx) {
    try {
      const { id } = ctx.params
      if (id) {
        await Category.findByIdAndRemove(id)
        ctx.status = 200
        ctx.body = {
          message: '操作成功',
        }
      }
    } catch (error) {
      formErrorMiddleware(ctx, error)
    }
  }

}

export default new CategoryController()
