import Router from 'koa-router'
import CategoryController from './category.controller'

const adminPrefix = '/admin/categories'
const router = new Router();

// admin api
router.get(`${adminPrefix}`, CategoryController.categories)
router.post(`${adminPrefix}`, CategoryController.add)
router.patch(`${adminPrefix}/:id`, CategoryController.update)
router.delete(`${adminPrefix}/:id`, CategoryController.remove)

// front api
router.get('/categories', CategoryController.categories)
export default router
