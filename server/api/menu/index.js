import Router from 'koa-router'
import MenuController from './menu.controller'

const router = new Router()

router.get('/', MenuController.menus)
router.post('/', MenuController.add)
router.patch('/:id', MenuController.update)
router.del('/:id', MenuController.remove)

export default router
