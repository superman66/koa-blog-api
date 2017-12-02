import Router from 'koa-router'
import PostController from './post.controller'

const router = new Router()

router.post('/', PostController.add)
router.post('/changeStatus/:id', PostController.changeStatus)

export default router
