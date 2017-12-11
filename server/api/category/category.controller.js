import mongoose from 'mongoose'
import { isNullOrUndefined, isNumber } from 'util';
import CategoryModel from './../../models/Category.model'
import * as pagination from '../../constants/Pagination'
import formErrorMiddleware from '../../middlewares/formErrorMiddleware';

const Category = mongoose.model('Category')

class CategoryController {
  /** 分页列表
   *  page：当前页数
   *  pageSize: 每页数量
   *  filterColumn 排序字段
   *  filterOrder desc asc (default)
   */
  async categories(ctx) {
    let { page, pageSize = pagination.PAGE_SIZE } = ctx.query
    const {
      filterColumn = pagination.FILTER_COLUMN,
      filterOrder = pagination.FILTER_ORDER,
     } = ctx.query

    const params = {
      sort: {},
      filter: {},
    }
    params.sort[filterColumn] = filterOrder

    try {
      // 使用分页
      if (!isNullOrUndefined(page) && isNumber(parseInt(page, 0))) {
        page = parseInt(page, 0)
        pageSize = parseInt(pageSize, 0)

        const total = await Category.count()
        const categories = await Category.find()
          .skip(pageSize * (page - 1))
          .limit(pageSize)
          .sort(params.sort)
          .select('_id name createTime updateTime')
        ctx.status = 200
        ctx.body = {
          data: {
            page: {
              page,
              pageSize,
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
          errors: {
            name: '分类名称已存在',
          },
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
