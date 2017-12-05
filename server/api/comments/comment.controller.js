import mongoose from 'mongoose'
import CommentModel from '../../models/Comment.model'

const Comment = mongoose.model('Comment')

class CommentController {
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
      ctx.throw(500)
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
      ctx.throw(500)
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
      ctx.throw(500)
    }
  }
}

export default new CommentController()
