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
import { PUBLIC_PATH } from './constants/Conf'
import errorHandleMiddware from './middlewares/errorHandleMiddware'

mongoose.connect(connexionString)
// mongoose promise 风格 [mongoose.Promise = require('bluebird')]
mongoose.Promise = global.Promise

// create Koa application
const app = new Koa()

// 自定义设置 methods，支持 PATCH 方法，koa-cors 默认不支持
const options = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

// apply middlewares
app
  // cors middleware should be placed in the top
  .use(cors(options))
  .use(errorHandleMiddware)
  .use(jwt({
    secret,
  }).unless({
    path: PUBLIC_PATH,
  }))
  .use(serve('./public'))
  .use(logger())
  .use(bodyParser())
  .use(helmet())
router(app)
// Start application
app.listen(port, () => console.log(`✅  The server is running at http://localhost:${port}/`))

export default app
