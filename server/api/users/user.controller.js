import mongoose from 'mongoose'
import * as pagination from '../../constants/Pagination'
import formErrorMiddleware from '../../middlewares/formErrorMiddleware';

const User = mongoose.model('User')

class UserController {

  /** 分页列表
   *  page：当前页数
   *  pagesize: 每页数量
   *  sortColunm 排序字段
   *  orderType desc asc default
   * you can get uers with it
   * curl -X GET http://localhost:3200/api/users -H 'authorization: Bearer token' -H 'cache-control: no-cache'
   */
  async users(ctx) {
    let { page, pagesize = pagination.PAGE_SIZE } = ctx.query
    const { sortColumn = pagination.SORT_COLUMN, orderType = pagination.ORDER_TYPE } = ctx.query

    const params = {
      sort: {},
      filter: {},
    }
    params.sort[sortColumn] = orderType
    try {
      // 使用分页
      if (page !== undefined) {
        page = parseInt(page, 0)
        pagesize = parseInt(pagesize, 0)

        const total = await User.count()
        const users = await User.find()
          .skip(pagesize * (page - 1))
          .limit(pagesize)
          .sort(params.sort)
          .select('_id username email gender createTime updateTime')
        ctx.status = 200
        ctx.body = {
          page: {
            page,
            pagesize,
            total,
          },
          data: {
            users,
          },
        }
      } else {
        const users = await User.find()
          .sort(params.sort)
          .select('_id username email gender createTime updateTime')
        ctx.status = 200
        ctx.body = {
          data: {
            users,
          },
        }
      }
    } catch (error) {
      formErrorMiddleware(ctx, error)
    }
  }

  /**
   * 编辑用户
   * @param {*} ctx
   */
  async update(ctx) {
    let { body } = ctx.request
    const { id } = ctx.params
    try {
      let user = await User.findOne({ username: body.username });
      if (!user) {
        /**
         * 关于update后 user 不是最新的的问题，添加 {new: true}
         * https://stackoverflow.com/questions/32811510/mongoose-findoneandupdate-doesnt-return-updated-document
         */
        body.updateTime = Date.now()
        user = await User.findByIdAndUpdate(id, body, { new: true })
        ctx.status = 200
        ctx.body = {
          message: '操作成功',
          user: user.userInfo,
        }
      } else {
        ctx.status = 400;
        ctx.body = {
          message: '用户名已经存在',
        }
      }
    } catch (error) {
      formErrorMiddleware(ctx, error)
    }
  }

  /**
   * 删除用户
   * @param {*} ctx
   */
  async remove(ctx) {
    const { id } = ctx.params
    try {
      await User.findByIdAndRemove(id)
      ctx.status = 200
      ctx.body = {
        message: '操作成功',
      }
    } catch (error) {
      formErrorMiddleware(ctx, error)
    }
  }
}

export default new UserController()
