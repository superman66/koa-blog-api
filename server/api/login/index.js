import Router from 'koa-router'
import LoginController from './login.controller'

const router = new Router();

router.post('admin/login', LoginController.login)
router.post('admin/register', LoginController.register)

export default router
