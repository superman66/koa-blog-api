import Router from 'koa-router'
import TagController from './tag.controller'

const router = new Router()

router.get('/', TagController.tags)
router.post('/', TagController.add)
router.del('/:id', TagController.remove)

export default router
