import mongoose, {
  Schema
} from 'mongoose'
import {
  CommentStatus
} from '../constants/PostStatus';

const CommentSchema = new Schema({
  // 文章id
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
  },
  // 评论内容
  content: String,
  // 名称
  name: String,
  // 个人主页
  website: String,
  // 评论的状态
  status: {
    type: Number,
    // 默认评论无需审核
    default: CommentStatus.passReview,
  },
  likes: {
    type: Number,
    default: 0,
  },
  createTime: Date,
})

class CommentClass {
  static findCommentsPagination(page, pageSize, params) {
    return this.find(params.filter)
      .or(params.query)
      .populate({
        path: 'post',
        select: 'title desc createTime',
      })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .sort(params.sort)
      .select('article content name website status likes createTime')
  }

  static findComments(params) {
    return this.find(params.filter)
      .or(params.query)
      .populate({
        path: 'post',
        select: 'title desc createTime',
      })
      .sort(params.sort)
      .select('article content name website status likes createTime')
  }
}

CommentSchema.loadClass(CommentClass)
export default mongoose.model('Comment', CommentSchema)
