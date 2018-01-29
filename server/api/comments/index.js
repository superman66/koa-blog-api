import Router from 'koa-router'
import CommentController from './comment.controller'

const adminPrefix = 'admin/comments'

const router = new Router()
// admin api
router.get(`${adminPrefix}`, CommentController.comments)
router.post(`${adminPrefix}`, CommentController.add)
router.del(`${adminPrefix}/:id`, CommentController.remove)

// front api
router.post('comments', CommentController.add)
router.get('comments/post/:id', CommentController.findCommentsById)
export default router
