import mongoose from 'mongoose'
import {
  isNullOrUndefined,
  isNumber,
} from 'util';
import CategoryModel from './../../models/Category.model'
import PostModel from '../../models/Post.model'
import * as pagination from '../../constants/Pagination'
import errorHanle from '../../utils/errorHandle';
import {
  toRegexpQuery,
} from '../../utils/toRegexpQuery';

const Category = mongoose.model('Category')
const Post = mongoose.model('Post')

class CategoryController {
  /** 分页列表
   *  page：当前页数
   *  pageSize: 每页数量
   *  orderColumn 排序字段
   *  orderType desc asc (default)
   *  filterColumn 过滤字段
   */
  async categories(ctx) {
    let {
      page,
      pageSize = pagination.PAGE_SIZE,
    } = ctx.query
    const {
      orderColumn = pagination.ORDER_COLUMN,
        filterColumn,
        orderType = pagination.ORDER_TYPE,
        word,
    } = ctx.query

    const params = {
      sort: {},
      query: {},
    }
    params.sort[orderColumn] = orderType

    if (word !== undefined && word !== '' && word !== null) {
      if (filterColumn !== undefined) {
        params.query = toRegexpQuery(filterColumn, word)
      } else {
        params.query = toRegexpQuery(['name'], word)
      }
    }

    try {
      // 使用分页
      if (!isNullOrUndefined(page) && isNumber(parseInt(page, 0))) {
        page = parseInt(page, 0)
        pageSize = parseInt(pageSize, 0)

        const total = await Category.count()
        const categories = await Category.findCategoriesPagination(page, pageSize, params).exec()

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
        const categories = await Category.findCategories(params).exec()

        ctx.status = 200
        ctx.body = {
          data: {
            items: categories,
          },
        }
      }
    } catch (error) {
      errorHanle(ctx, error)
    }
  }

  /**
   * 新增分类
   * @param {*} ctx
   */
  async add(ctx) {
    const {
      body,
    } = ctx.request
    try {
      if (!body.name) {
        ctx.status = 400;
        ctx.body = {
          errors: {
            name: '分类名称不能为空',
          },
        }
        return;
      }
      const category = await Category.findOne({
        name: body.name,
      });
      if (category) {
        ctx.status = 400;
        ctx.body = {
          errors: {
            name: '分类已存在',
          },
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
      errorHanle(ctx, error)
    }
  }

  /**
   * 更新分类
   * @param {*} ctx
   */
  async update(ctx) {
    const {
      body,
    } = ctx.request
    const {
      id,
    } = ctx.params
    try {
      let category = await Category.findOne({
        name: body.name,
      });
      if (!category) {
        category = await Category.findByIdAndUpdate(id, {
          name: body.name,
          updateTime: Date.now(),
        }, {
          new: true,
        })
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
      errorHanle(ctx, error)
    }
  }
  /**
   * 删除分类
   * @param {*} ctx
   */
  async remove(ctx) {
    try {
      const {
        id,
      } = ctx.params
      if (id) {
        const posts = await Post.findPostsByCategoryId(id).exec()
        if (posts.length === 0) {
          await Category.findByIdAndRemove(id)
          ctx.status = 200
          ctx.body = {
            message: '操作成功',
          }
        } else {
          ctx.status = 400
          ctx.body = {
            message: '该分类下还有文章，无法删除',
          }
        }
      }
    } catch (error) {
      errorHanle(ctx, error)
    }
  }

}

export default new CategoryController()
