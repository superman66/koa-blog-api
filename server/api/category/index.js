import Router from 'koa-router'
import CategoryController from './category.controller'

const router = new Router();

router.get('/', CategoryController.categories)
router.post('/', CategoryController.add)
router.patch('/:id', CategoryController.update)
router.delete('/:id', CategoryController.remove)

export default router
