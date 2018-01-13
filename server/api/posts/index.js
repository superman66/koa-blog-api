import Router from 'koa-router'
import PostController from './post.controller'

const adminPrefix = '/admin/posts'
const router = new Router()
// admin api
router.get(`${adminPrefix}`, PostController.posts)
router.get(`${adminPrefix}/:id`, PostController.detail)
router.post(`${adminPrefix}`, PostController.add)
router.patch(`${adminPrefix}/:id`, PostController.update)
router.post(`${adminPrefix}/changeStatus/:id`, PostController.changeStatus)
router.del(`${adminPrefix}/:id`, PostController.remove)

// front api
router.get('posts', PostController.posts)
router.get('posts/:id', PostController.detail)
router.patch('posts/:id', PostController.addVisitCount)
router.get('posts/list/last', PostController.findLastPosts)
export default router
