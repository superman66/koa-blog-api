import Router from 'koa-router'
import PostController from './post.controller'

const router = new Router()
router.get('/', PostController.posts)
router.get('/:id', PostController.detail)
router.post('/', PostController.add)
router.patch('/:id', PostController.update)
router.post('/changeStatus/:id', PostController.changeStatus)
router.del('/:id', PostController.remove)

export default router
