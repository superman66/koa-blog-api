import Router from 'koa-router'
import TagController from './tag.controller'

const adminPrefix = 'admin/tags'
const router = new Router()

// admin api
router.get(`${adminPrefix}`, TagController.tags)
router.post(`${adminPrefix}`, TagController.add)
router.del(`${adminPrefix}/:id`, TagController.remove)
router.patch(`${adminPrefix}/:id`, TagController.update)

// front api
router.get('tags', TagController.tags)
export default router
