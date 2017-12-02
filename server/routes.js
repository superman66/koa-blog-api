import Router from 'koa-router'
import login from './api/login'
import users from './api/users'
import category from './api/category'
import comment from './api/comments'
import { baseApi } from './config/index'

const router = new Router()


router.prefix(`/${baseApi}`)
export default function (app) {
  router.use('', login.routes(), login.allowedMethods())
  router.use('/users', users.routes(), users.allowedMethods())
  router.use('/category', category.routes(), users.allowedMethods())
  router.use('/comment', category.routers(), category.allowedMethods())
  app.use(router.routes())
}
