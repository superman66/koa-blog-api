import mongoose, { Schema } from 'mongoose'
import { CommentStatus } from '../constants/PostStatus';

const CommentSchema = new Schema({
  // 文章id
  article: {
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

export default mongoose.model('Comment', CommentSchema)
