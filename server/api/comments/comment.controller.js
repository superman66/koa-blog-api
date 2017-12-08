import mongoose from 'mongoose'
import { isNullOrUndefined, isNumber } from 'util';
import CommentModel from '../../models/Comment.model'
import * as pagination from '../../constants/Pagination'
import formErrorMiddleware from '../../middlewares/formErrorMiddleware';

const Comment = mongoose.model('Comment')

class CommentController {

  /**
   * 评论分页列表
   * @param {*} ctx
   */
  async comments(ctx) {
    let { page, pageSize = pagination.PAGE_SIZE } = ctx.query
    const {
      filterColumn = pagination.FILTER_COLUMN,
      filterOrder = pagination.FILTER_ORDER,
      status,
     } = ctx.query
    const params = {
      sort: {},
      filter: {},
    }
    params.sort[filterColumn] = filterOrder
    if (status !== null || status !== undefined) {
      params.filter.status = status
    }

    try {
      // 使用分页
      if (!isNullOrUndefined(page) && isNumber(parseInt(page, 0))) {
        page = parseInt(page, 0)
        pageSize = parseInt(pageSize, 0)

        const total = await Comment.count()
        const comments = await Comment.find(params.filter)
          .populate({
            path: 'post',
            select: '_id title desc createTime',
          })
          .skip(pageSize * (page - 1))
          .limit(pageSize)
          .sort(params.sort)
          .select('_id article content name website status likes createTime')
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
        const comments = await Comment.find(params.filter)
          .populate({
            path: 'post',
            select: '_id title desc createTime',
          })
          .sort(params.sort)
          .select('_id article content name website status likes createTime')
        ctx.status = 200
        ctx.body = {
          data: {
            items: comments,
          },
        }
      }
    } catch (error) {
      formErrorMiddleware(ctx, error)
    }
  }
  /**
   * 添加评论
   * @param {*} ctx
   */
  async add(ctx) {
    const {
      article,
      content,
      name,
      website,
    } = ctx.request.body;
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
      formErrorMiddleware(ctx, error)
    }
  }

  /**
   * 删除评论
   * @param {*} ctx
   */
  async remove(ctx) {
    const { id } = ctx.body
    try {
      if (id) {
        await Comment.findByIdAndUpdate(id)
        ctx.status = 200
        ctx.body = {
          message: '操作成功',
        }
      }
    } catch (error) {
      formErrorMiddleware(ctx, error)
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
        return;
      }
      const comments = await Comment.find({ article })
      ctx.status = 200
      ctx.body = {
        results: comments,
      }
    } catch (error) {
      formErrorMiddleware(ctx, error)
    }
  }
}

export default new CommentController()
