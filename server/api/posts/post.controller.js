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
   * 更改文章状态：发布、下架，上架
   * @param {*} ctx
   */
  async changeStatus(ctx) {
    const { id, status } = ctx.request.body
    try {
      if (id === undefined || id === '') {
        ctx.status = 400
        ctx.body = {
          message: '文章id不能为空',
        }
        return;
      }

      const post = await Post.findByIdAndUpdate(id, { status })
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
