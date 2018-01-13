import Router from 'koa-router'
import AboutController from './about.controller'

const adminPrefix = '/admin/about'
const router = new Router();

// admin api
router.get(`${adminPrefix}`, AboutController.detail)
router.post(`${adminPrefix}`, AboutController.addOrUpdate)
router.patch(`${adminPrefix}/:id`, AboutController.addOrUpdate)

// front api
router.get('/about', AboutController.detail)
export default router
