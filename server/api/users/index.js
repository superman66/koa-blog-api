import Router from 'koa-router'
import UserController from './user.controller'

const adminPrefix = 'admin/users'
const router = new Router();

router.get(`${adminPrefix}`, UserController.users)
router.get(`${adminPrefix}/:id`, UserController.detail)
router.patch(`${adminPrefix}/:id`, UserController.update)
router.del(`${adminPrefix}/:id`, UserController.remove)


export default router
