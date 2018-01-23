import mongoose from 'mongoose'
import { isNullOrUndefined, isNumber } from 'util'
import CommentModel from '../../models/Comment.model'
import * as pagination from '../../constants/Pagination'
import errorHanle from '../../utils/errorHandle'
import { toRegexpQuery } from '../../utils/toRegexpQuery'

const Comment = mongoose.model('Comment')

class CommentController {
  /**
   * 评论分页列表
   * @param {*} ctx
   */
  async comments(ctx) {
    let { page, pageSize = pagination.PAGE_SIZE } = ctx.query
    const {
      orderColumn = pagination.ORDER_COLUMN,
      filterColumn,
      orderType = pagination.ORDER_TYPE,
      status,
      word,
    } = ctx.query
    const params = {
      sort: {},
      filter: {},
      query: {},
    }
    params.sort[orderColumn] = orderType

    if (status !== null && status !== undefined) {
      params.filter.status = status
    }

    if (word !== undefined && word !== '' && word !== null) {
      if (filterColumn !== undefined) {
        params.query = toRegexpQuery(filterColumn, word)
      } else {
        params.query = toRegexpQuery(['content', 'name', 'website'], word)
      }
    }

    try {
      // 使用分页
      if (!isNullOrUndefined(page) && isNumber(parseInt(page, 0))) {
        page = parseInt(page, 0)
        pageSize = parseInt(pageSize, 0)

        const total = await Comment.count()
        const comments = await Comment.findCommentsPagination(
          page,
          pageSize,
          params,
        ).exec()

        ctx.status = 200
        ctx.body = {
          data: {
            page: {
              page,
              pageSize,
              total,
            },
            items: comments,
          },
        }
      } else {
        const comments = await Comment.findComments(params).exec()

        ctx.status = 200
        ctx.body = {
          data: {
            items: comments,
          },
        }
      }
    } catch (error) {
      errorHanle(ctx, error)
    }
  }
  /**
   * 添加评论
   * @param {*} ctx
   */
  async add(ctx) {
    const { article, content, name, website } = ctx.request.body
    try {
      if (article === undefined || article === '') {
        ctx.status = 400
        ctx.body = {
          message: '文章id不能为空',
        }
      } else if (content === undefined || content === '') {
        ctx.status = 200
        ctx.body = {
          message: '评论内容不能为空',
        }
      } else {
        await Comment.create({
          article,
          content,
          name,
          website,
          createTime: Date.now(),
        })
        ctx.status = 200
        ctx.body = {
          message: '操作成功',
        }
      }
    } catch (error) {
      errorHanle(ctx, error)
    }
  }

  /**
   * 审核评论
   * 0-审核失败
   * 2-审核通过
   * @param {*} ctx
   */
  async review(ctx) {
    const { id, status } = ctx.query
    try {
      if (id) {
        await Comment.findByIdAndUpdate(id, {
          status,
        })
        ctx.status = 200
        ctx.body = {
          message: '操作成功',
        }
      }
    } catch (error) {
      errorHanle(ctx, error)
    }
  }

  /**
   * 删除评论
   * @param {*} ctx
   */
  async remove(ctx) {
    const { id } = ctx.query
    try {
      if (id) {
        await Comment.findByIdAndUpdate(id)
        ctx.status = 200
        ctx.body = {
          message: '操作成功',
        }
      }
    } catch (error) {
      errorHanle(ctx, error)
    }
  }

  async getCommentsById(ctx) {
    const { article } = ctx.request.body

    try {
      if (article === undefined || article === '') {
        ctx.status = 400
        ctx.body = {
          message: '文章id不能为空',
        }
        return
      }
      const comments = await Comment.find({
        article,
      })
      ctx.status = 200
      ctx.body = {
        results: comments,
      }
    } catch (error) {
      errorHanle(ctx, error)
    }
  }
}

export default new CommentController()
