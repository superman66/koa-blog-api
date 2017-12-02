import Router from 'koa-router'
import CategoryController from './category.controller'

const router = new Router();

router.get('/check', CategoryController.check)
router.post('/', CategoryController.add)
router.patch('/:id', CategoryController.update)
router.get('/:id', CategoryController.findCategoryById)
router.del('/:id', CategoryController.remove)

export default router
