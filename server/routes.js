import Router from 'koa-router'
import login from './api/login'
import users from './api/users'
import category from './api/category'
import comment from './api/comments'
import tag from './api/tags'
import post from './api/posts'
import { baseApi } from './config/index'

const router = new Router()


router.prefix(`/${baseApi}`)
export default function (app) {
  router.use('', login.routes(), login.allowedMethods())
  router.use('/users', users.routes(), users.allowedMethods())
  router.use('/category', category.routes(), category.allowedMethods())
  router.use('/comment', comment.routes(), comment.allowedMethods())
  router.use('/post', post.routes(), post.allowedMethods())
  router.use('/tags', tag.routes(), tag.allowedMethods())
  app.use(router.routes())
}
