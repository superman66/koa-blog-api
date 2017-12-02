import mongoose from 'mongoose'
import PostModel from '../../models/Post.model'
import { PostStatus } from '../../constants/PostStatus';

const Post = mongoose.model('Post')

class PostController {
  /**
   * 新增文章
   * @param {*} ctx
   */
  async add(ctx) {
    const { body } = ctx.request
    try {
      await Post.create({ body })
      ctx.status = 200;
      ctx.body = {
        message: '操作成功',
      }
    } catch (error) {
      ctx.throw(500)
    }
  }

  /**
   * 发布文章
   * @param {*} ctx
   */
  async pulish(ctx) {
    const { id } = ctx.request.body
    try {
      if (id === undefined || id === '') {
        ctx.status = 400
        ctx.body = {
          message: '文章id不能为空',
        }
        return;
      }

      const post = await Post.findByIdAndUpdate(id, { status: PostStatus.publish })
      ctx.status = 200
      ctx.body = {
        message: '操作成功',
        data: {
          post,
        },
      }
    } catch (error) {
      ctx.throw(500)
    }
  }

    /**
   * 下架文章
   * @param {*} ctx
   */
  async unpulish(ctx) {
    const { id } = ctx.request.body
    try {
      if (id === undefined || id === '') {
        ctx.status = 400
        ctx.body = {
          message: '文章id不能为空',
        }
        return;
      }

      const post = await Post.findByIdAndUpdate(id, { status: PostStatus.unpublish })
      ctx.status = 200
      ctx.body = {
        message: '操作成功',
        data: {
          post,
        },
      }
    } catch (error) {
      ctx.throw(500)
    }
  }
}

export default new PostController()
