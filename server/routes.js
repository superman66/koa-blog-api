import Router from 'koa-router'
import login from './api/login'
import users from './api/users'
import category from './api/category'
import comment from './api/comments'
import tag from './api/tags'
import post from './api/posts'
import menu from './api/menu'
import about from './api/about'
import { baseApi } from './config/index'

const router = new Router()


router.prefix(`/${baseApi}`)
export default function (app) {
  router.use(login.routes(), login.allowedMethods())
  router.use(users.routes(), users.allowedMethods())
  router.use(category.routes(), category.allowedMethods())
  router.use(comment.routes(), comment.allowedMethods())
  router.use(post.routes(), post.allowedMethods())
  router.use(tag.routes(), tag.allowedMethods())
  router.use(menu.routes(), menu.allowedMethods())
  router.use(about.routes(), about.allowedMethods())
  app.use(router.routes())
}
