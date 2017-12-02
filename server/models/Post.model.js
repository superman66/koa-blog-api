import mongoose, { Schema } from 'mongoose'
import { PostStatus } from '../constants/PostStatus'

/*
 * 文章Model
 */
const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  desc: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  content: String,
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag',
  }],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  // 文章状态, 默认为草稿
  status: {
    type: Number,
    default: PostStatus.draft,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  visitCount: {
    type: Number,
    default: 1,
  },
  createTime: {
    type: Date,
    default: Date.now(),
  },
  updateTime: {
    type: Date,
    default: Date.now(),
  },
})

const Post = mongoose.model('Post', PostSchema)

export default Post
