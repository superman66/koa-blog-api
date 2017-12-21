import mongoose from 'mongoose'
import * as pagination from '../../constants/Pagination'
import formErrorMiddleware from '../../middlewares/formErrorMiddleware';
import {
  toRegexpQuery,
} from '../../utils/toRegexpQuery'

const User = mongoose.model('User')

class UserController {

  /** 分页列表
   *  page：当前页数
   *  pageSize: 每页数量
   *  sortColunm 排序字段
   *  orderType 排序方式 （desc asc default）
   *  filterColumn 搜索过滤字段
   * you can get uers with it
   * curl -X GET http://localhost:3200/api/users -H 'authorization: Bearer token' -H 'cache-control: no-cache'
   */
  async users(ctx) {
    let {
      page,
      pageSize = pagination.PAGE_SIZE,
    } = ctx.query
    const {
      orderColumn = pagination.ORDER_COLUMN,
        filterColumn,
        orderType = pagination.ORDER_TYPE,
        word,
    } = ctx.query

    const params = {
      sort: {},
      query: {},
    }
    params.sort[orderColumn] = orderType

    if (word !== undefined && word !== '' && word !== null) {
      if (filterColumn !== undefined) {
        params.query = toRegexpQuery(filterColumn, word)
      } else {
        params.query = toRegexpQuery(['username', 'email'], word)
      }
    }

    try {
      // 使用分页
      if (page !== undefined) {
        page = parseInt(page, 0)
        pageSize = parseInt(pageSize, 0)

        const total = await User.count()
        const users = await User
          .findUsersPagination(page, pageSize, params)
          .exec()

        ctx.status = 200
        ctx.body = {
          data: {
            page: {
              page,
              pageSize,
              total,
            },
            items: users,
          },
        }
      } else {
        const users = await User.findUsers(params).exec()

        ctx.status = 200
        ctx.body = {
          data: {
            items: users,
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
    let {
      body,
    } = ctx.request
    const {
      id,
    } = ctx.params
    try {
      let user = await User.findOne({
        username: body.username,
      });
      if (!user) {
        /**
         * 关于update后 user 不是最新的的问题，添加 {new: true}
         * https://stackoverflow.com/questions/32811510/mongoose-findoneandupdate-doesnt-return-updated-document
         */
        body.updateTime = Date.now()
        user = await User.findByIdAndUpdate(id, body, {
          new: true,
        })
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
    const {
      id,
    } = ctx.params
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
