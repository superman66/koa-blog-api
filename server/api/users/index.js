import Router from 'koa-router'
import UserController from './user.controller'

const router = new Router();

router.get('/', UserController.users)
router.patch('/:id', UserController.update)
router.del('/:id', UserController.remove)

export default router
