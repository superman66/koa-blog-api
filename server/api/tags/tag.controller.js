import mongoose from 'mongoose'
import {
  isNumber,
  isNullOrUndefined,
} from 'util';
import TagModel from '../../models/Tag.model'
import PostModel from '../../models/Post.model'
import * as pagination from '../../constants/Pagination'
import errorHanle from '../../utils/errorHandle';
import {
  toRegexpQuery,
} from '../../utils/toRegexpQuery';


const Tag = mongoose.model('Tag')
const Post = mongoose.model('Post')

class TagController {

  /**
   * 获取tag分页列表
   *  没有page 参数则默认显示全部
   *  page：当前页数
   *  pageSize: 每页数量
   *  orderColumn 排序字段
   *  orderType 排序方式
   *  filterColumn 搜索过滤的字段
   *  word 搜索关键词
   * @param {*} ctx
   */
  async tags(ctx) {
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
      if (!isNullOrUndefined(page) && isNumber(parseInt(page, 0))) {
        page = parseInt(page, 0)
        pageSize = parseInt(pageSize, 0)

        const total = await Tag.count()
        const tags = await Tag
          .findTagsPagination(page, pageSize, params)
          .exec()

        ctx.status = 200
        ctx.body = {
          data: {
            page: {
              page,
              pageSize,
              total,
            },
            items: tags,
          },
        }
      } else {
        const tags = await Tag.findTags(params).exec()
        ctx.status = 200
        ctx.body = {
          data: {
            items: tags,
          },
        }
      }
    } catch (error) {
      errorHanle(ctx, error)
    }
  }

  /**
   * 新增tag
   * @param {*} ctx
   */
  async add(ctx) {
    const {
      body,
    } = ctx.request
    try {
      let tag = await Tag.findOne({
        name: body.name,
      })
      if (!tag) {
        tag = await Tag.create(body)
        ctx.status = 200
        ctx.body = {
          message: '操作成功',
          data: {
            tag,
          },
        }
      } else {
        ctx.status = 400
        ctx.body = {
          errors: {
            name: '标签名称已存在',
          },
        }
      }
    } catch (error) {
      errorHanle(ctx, error)
    }
  }

  /**
   * 删除tag
   * @param {*} ctx
   */
  async remove(ctx) {
    const {
      id,
    } = ctx.params
    try {
      if (isNullOrUndefined(id) || id === '') {
        ctx.status = 400
        ctx.body = {
          errors: {
            id: 'id不能为空',
          },
        }
        return;
      }

      const posts = await Post.findPostsByTagId(id).exec()
      if (posts.length === 0) {
        await Tag.findByIdAndRemove(id)
        ctx.status = 200
        ctx.body = {
          message: '操作成功',
        }
      } else {
        ctx.status = 400
        ctx.body = {
          message: '该标签下还有文章，无法删除',
        }
      }
    } catch (error) {
      errorHanle(ctx, error)
    }
  }

  /**
   * 更新tag
   * @param {*} ctx
   */
  async update(ctx) {
    const {
      name,
    } = ctx.request.body
    const {
      id,
    } = ctx.params
    try {
      let tag = await Tag.findOne({
        name,
      })
      if (!tag) {
        tag = await Tag.findByIdAndUpdate(id, ctx.request.body, {
          new: true,
        })
        ctx.status = 200
        ctx.body = {
          message: '操作成功',
          data: {
            tag,
          },
        }
      } else {
        ctx.status = 400
        ctx.body = {
          errors: {
            name: '标签名称已存在',
          },
        }
      }
    } catch (error) {
      errorHanle(ctx, error)
    }
  }
}

export default new TagController()
