import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
// ensure import UserModel before use model('user')
import UserModel from '../../models/User.model'
import { secret } from '../../config/index';
import formErrorMiddleware from '../../middlewares/formErrorMiddleware';


const User = mongoose.model('User');

class LoginController {

  /** you can login with
   * curl -X POST http://localhost:3200/api/login/ -H 'cache-control: no-cache' -H 'content-type: application/x-www-form-urlencoded' -d 'username=superman2&password=123456'
   */
  async login(ctx) {
    const { body } = ctx.request
    try {
      const user = await User.findOne({ username: body.username });
      if (!user) {
        ctx.status = 400
        ctx.body = {
          errors: {
            username: '用户名错误',
          },
        }
        return;
      }
      // 匹配密码是否相等
      if (await bcrypt.compare(body.password, user.password)) {
        ctx.status = 200
        ctx.body = {
          message: '登录成功',
          data: {
            user: user.userInfo,
            // 生成 token 返回给客户端
            token: jsonwebtoken.sign({
              data: user,
              // 设置 token 过期时间
              exp: Math.floor(Date.now() / 1000) + (60 * 60), // 60 seconds * 60 minutes = 1 hour
            }, secret),
          },
        }
      } else {
        ctx.status = 400
        ctx.body = {
          errors: {
            password: '密码错误',
          },
        }
      }
    } catch (error) {
      formErrorMiddleware(ctx, error)
    }
  }

  /**
   * you can register with
   * curl -X POST http://localhost:3200/api/register  -H 'cache-control: no-cache' -H 'content-type: application/x-www-form-urlencoded'  -d 'username=superman2&password=123456'
   */
  async register(ctx) {
    const { body } = ctx.request;
    try {
      if (!body.password) {
        ctx.status = 400;
        ctx.body = {
          errors: [
            { password: '密码不能为空' },
          ],
        }
        return;
      }
      body.password = await bcrypt.hash(body.password, 5)
      let user = await User.find({ username: body.username });
      if (!user.length) {
        const newUser = new User(body);
        user = await newUser.save();
        ctx.status = 200;
        ctx.body = {
          message: '注册成功',
          data: {
            user: user.userInfo,
          },
        }
      } else {
        ctx.status = 400;
        ctx.body = {
          errors: {
            username: '用户名已经存在',
          },
        }
      }
    } catch (error) {
      formErrorMiddleware(ctx, error)
    }
  }

}

export default new LoginController();
