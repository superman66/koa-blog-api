import Router from 'koa-router'
import CommentController from './comment.controller'

const router = new Router()
router.post('/', CommentController.add)
router.post('/:id', CommentController.remove)

export default router
