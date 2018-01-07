import Router from 'koa-router'
import MenuController from './menu.controller'

const adminPrefix = 'admin/menus'
const router = new Router()

router.get(`${adminPrefix}`, MenuController.menus)
router.post(`${adminPrefix}`, MenuController.add)
router.patch(`${adminPrefix}/:id`, MenuController.update)
router.del(`${adminPrefix}/:id`, MenuController.remove)

export default router
