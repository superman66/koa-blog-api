import mongoose from 'mongoose'

const Comment = mongoose.model('Comment')

export default class CommentService {
  /**
   * 查找单篇文章
   * @param {*} id Postid
   */
  static async findCommentsByPostId(id) {
    const comment = await Comment.find({ post: id })
    return comment
  }
}
