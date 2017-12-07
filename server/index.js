import bodyParser from 'koa-bodyparser'
import Koa from 'koa'
import logger from 'koa-logger'
import mongoose from 'mongoose'
import helmet from 'koa-helmet'
import cors from 'koa-cors'
import jwt from 'koa-jwt'
import serve from 'koa-static'
import router from './routes'
import { port, connexionString, secret } from './config/index'
import errorHandle from './middlewares/errorHandle'

mongoose.connect(connexionString)
// mongoose promise 风格 [mongoose.Promise = require('bluebird')]
mongoose.Promise = global.Promise

// create Koa application
const app = new Koa();
// apply middlewares

app
  // cors middleware should be placed in the top
  .use(cors())
  .use(errorHandle)
  .use(jwt({
    secret,
  }).unless({
    path: [/\/register/, /\/login/],
  }))
  .use(serve('./public'))
  .use(logger())
  .use(bodyParser())
  .use(helmet())
router(app)
// Start application
app.listen(port, () => console.log(`✅  The server is running at http://localhost:${port}/`))

export default app
