import mongoose from 'mongoose'


const User = mongoose.model('User')

class UserController {

  /** 分页列表
   *  page：当前页数
   *  pagesize: 每页数量
   * you can get uers with it
   * curl -X GET http://localhost:3200/api/user -H 'authorization: Bearer token' -H 'cache-control: no-cache'
   */
  async getUsers(ctx) {
    const { page, pagesize } = ctx.query
    // 使用分页
    if (page !== undefined || pagesize !== undefined) {
      const totalNumber = await User.count()
      const users = await User.find()
        .skip(pagesize * (page - 1))
        .limit(Number(pagesize))
        .select('_id username')
      ctx.status = 200
      ctx.body = {
        page: {
          page,
          pagesize,
          total: totalNumber,
        },
        data: {
          users,
        },
      }
    } else {
      const users = await User.find()
      ctx.status = 200
      ctx.body = {
        data: {
          users,
        },
      }
    }
  }

}

export default new UserController()
