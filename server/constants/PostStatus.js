/**
 * 文章的三种状态
 * 0-草稿状态
 * 1-发布状态
 * 2-下架状态
 */
export const PostStatus = {
  draft: 0,
  publish: 1,
  unpublish: 2,
}

/**
 * 评论审核状态
 * 0 审核失败
 * 1 审核中(尝试状态)
 * 2 审核通过
 */
export const CommentStatus = {
  failReview: 0,
  underReview: 1,
  passReview: 2,
}

export default PostStatus

