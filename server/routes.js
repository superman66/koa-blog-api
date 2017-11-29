import Router from 'koa-router'
import login from './api/login'
import users from './api/users'
import category from './api/category'
import { baseApi } from './config/index'

const router = new Router()


router.prefix(`/${baseApi}`)
export default function (app) {
  router.use('', login.routes(), login.allowedMethods())
  router.use('/users', users.routes(), users.allowedMethods())
  router.use('/categorys', category.routes(), users.allowedMethods())
  app.use(router.routes())
}
