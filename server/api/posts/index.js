import Router from 'koa-router'
import PostController from './post.controller'

const adminPrefix = '/admin/post'
const router = new Router()
// admin api
router.get(`${adminPrefix}/posts`, PostController.posts)
router.get(`${adminPrefix}/posts/:id`, PostController.detail)
router.post(`${adminPrefix}/posts`, PostController.add)
router.patch(`${adminPrefix}/posts/:id`, PostController.update)
router.post(`${adminPrefix}/posts/changeStatus/:id`, PostController.changeStatus)
router.del(`${adminPrefix}/posts/:id`, PostController.remove)

// front api
router.get('posts', PostController.posts)
export default router
