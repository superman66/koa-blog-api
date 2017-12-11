import Router from 'koa-router'
import CommentController from './comment.controller'

const router = new Router()
router.get('/', CommentController.comments)
router.post('/', CommentController.add)
router.del('/:id', CommentController.remove)

export default router
