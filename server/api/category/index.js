import Router from 'koa-router'
import CategoryController from './category.controller'

const router = new Router();

router.get('/check', CategoryController.check)
router.post('/category', CategoryController.add)
router.patch('/category/:id', CategoryController.update)
router.get('/categoyr/:id', CategoryController.findCategoryById)
router.del('category/:id', CategoryController.remove)

export default router
