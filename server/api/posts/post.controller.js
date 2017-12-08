import mongoose from 'mongoose'
import { isNumber, isNullOrUndefined } from 'util';
import PostModel from '../../models/Post.model'
import formErrorMiddleware from '../../middlewares/formErrorMiddleware';
import * as pagination from '../../constants/Pagination'

const Post = mongoose.model('Post')

class PostController {
  /**
   * 获取post分页列表
   *  没有page 参数则默认显示全部
   *  page：当前页数
   *  pagesize: 每页数量
   *  sortColunm 排序字段
   *  orderType desc asc default
   * @param {*} ctx
   */
  async posts(ctx) {
    const {
      sortColumn = pagination.SORT_COLUMN,
      orderType = pagination.ORDER_TYPE,
      status,
    } = ctx.query
    let {
      page,
      pagesize = pagination.PAGE_SIZE,
    } = ctx.query
    const params = {
      sort: {},
      filter: {},
    }
    params.sort[sortColumn] = orderType
    if (status !== null && status !== undefined) {
      params.filter.status = status
    }
    try {
      if (!isNullOrUndefined(page) && isNumber(parseInt(page, 0))) {
        page = parseInt(page, 0)
        pagesize = parseInt(pagesize, 0)


        const total = await Post.count()
        const posts = await Post.find(params.filter)
          .populate('author')
          .populate('comments')
          .populate('category')
          .populate({
            path: 'tags',
            select: '_id name createTime',
          })
          .skip(pagesize * (page - 1))
          .limit(pagesize)
          .sort(params.sort)
          .select('_id title desc author tags commments status category visitCount createTime updateTime')
        ctx.status = 200
        ctx.body = {
          page: {
            page,
            pagesize,
            total,
          },
          data: {
            posts,
          },
        }
      } else {
        const posts = await Post.find(params.filter)
          .sort(params.sort)
          .populate('author')
          .populate('comments')
          .populate('category')
          .populate({
            path: 'tags',
            select: '_id name createTime',
          })
          .select('_id title desc author tags commments status category visitCount createTime updateTime')
        ctx.status = 200
        ctx.body = {
          data: {
            posts,
          },
        }
      }
    } catch (error) {
      formErrorMiddleware(ctx, error)
    }
  }

  /**
   * 新增文章
   * @param {*} ctx
   */
  async add(ctx) {
    const { body } = ctx.request
    try {
      const post = new Post(body)
      await post.save()
      ctx.status = 200;
      ctx.body = {
        message: '操作成功',
      }
    } catch (error) {
      formErrorMiddleware(ctx, error)
    }
  }

  /**
   * 更新文章
   * @param {*} ctx
   */
  async update(ctx) {
    const { body } = ctx.request
    const { id } = ctx.params
    try {
      await Post.findByIdAndUpdate(id, body)
      ctx.status = 200
      ctx.body = {
        message: '操作成功',
      }
    } catch (error) {
      formErrorMiddleware(ctx, error)
    }
  }

  /**
   * 更改文章状态：发布、下架，上架
   * @param {*} ctx
   */
  async changeStatus(ctx) {
    const { status } = ctx.request.body
    const { id } = ctx.params
    try {
      const post = await Post.findByIdAndUpdate(id, { status })
      ctx.status = 200
      ctx.body = {
        message: '操作成功',
        data: {
          post,
        },
      }
    } catch (error) {
      formErrorMiddleware(ctx, error)
    }
  }

  /**
   * 删除文章
   * @param {*} ctx
   */
  async remove(ctx) {
    const { id } = ctx.params
    try {
      await Post.findByIdAndRemove(id)
      ctx.status = 200
      ctx.body = {
        message: '操作成功',
      }
    } catch (error) {
      formErrorMiddleware(ctx, error)
    }
  }

  /**
   * 根据id获取文章详情
   * @param {*} ctx
   */
  async detail(ctx) {
    const { id } = ctx.params
    try {
      const post = await Post.findById(id)
        .populate('author')
        .populate('comments')
        .populate('category')
        .populate({
          path: 'tags',
          select: '_id name createTime',
        })
        .select('_id title desc author tags commments status category visitCount createTime updateTime')
      ctx.status = 200
      ctx.body = {
        data: {
          post,
        },
      }
    } catch (error) {
      formErrorMiddleware(error)
    }
  }
}

export default new PostController()
