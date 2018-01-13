import mongoose, {
  Schema
} from 'mongoose'
import {
  PostStatus
} from '../constants/PostStatus'

/*
 * 文章Model
 */
const PostSchema = new Schema({
  title: String,
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
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
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

class PostClass {
  /**
   * 获取列表总长度
   * @param {*} param
   */
  static getCount(param) {
    const {
      or = {},
        find = {},
    } = param
    return this
      .find(find)
      .or(or)
      .count()
  }
  /**
   * 获取 post 分页列表
   * @param {*} page 当前页码
   * @param {*} pageSize 每页数量
   * @param {*} params 查询参数
   */
  static findPostsPagination(page, pageSize, params) {
    const {
      sort,
      query
    } = params
    return this
      .find(query.find)
      .or(query.or)
      .populate('author')
      .populate('comments')
      .populate('category')
      .populate({
        path: 'tags',
        select: '_id name createTime',
      })
      .sort(sort)
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .select('title desc author tags content commments status category visitCount createTime updateTime')
  }

  /**
   * 获取 post 列表
   * @param {*} params
   */
  static findPosts(params) {
    const {
      sort,
      query
    } = params
    return this
      .find(query.find)
      .populate('authors')
      .populate('comments')
      .populate('category')
      .populate({
        path: 'tags',
        select: '_id name createTime',
      })
      .or(query.or)
      .sort(sort)
      .select('title desc author tags content commments status category visitCount createTime updateTime')
  }

  /**
   * 获取最近 limit 条数据
   */
  static findLastPosts(limit) {
    return this
      .find()
      .sort({
        createTime: -1,
      })
      .limit(limit)
      .select('title')
  }
  /**
   *  根据 post id 获取文章详情
   * @param {*} id post id
   */
  static findPostById(id) {
    return this.findById(id)
      .populate({
        path: 'author',
        select: 'username email createTime',
      })
      .populate('comments')
      .populate('category')
      .populate({
        path: 'tags',
        select: ' name createTime',
      })
      .select('title desc author content tags commments status category visitCount createTime updateTime')
  }

  /**
   * 根据 tag id 查找文章
   * @param {*} id tag id
   */
  static findPostsByTagId(id) {
    return this
      .find({
        tags: {
          $in: [id],
        },
      })
      .populate({
        path: 'author',
        select: 'username email createTime',
      })
      .populate('comments')
      .populate('category')
      .populate({
        path: 'tags',
        select: ' name createTime',
      })
      .select('title desc author content tags commments status category visitCount createTime updateTime')
  }

  /**
   * 根据 分类 id 查找文章
   * @param {*} id tag id
   */
  static findPostsByCategoryId(id) {
    return this
      .find({
        category: {
          $in: [id],
        },
      })
      .populate({
        path: 'author',
        select: 'username email createTime',
      })
      .populate('comments')
      .populate({
        path: 'category',
      })
      .populate({
        path: 'tags',
        select: ' name createTime',
      })
      .select('title desc author content tags commments status category visitCount createTime updateTime')
  }
}

PostSchema.loadClass(PostClass)
const Post = mongoose.model('Post', PostSchema)

export default Post
