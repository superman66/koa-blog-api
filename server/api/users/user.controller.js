import mongoose from 'mongoose'
import * as pagination from '../../constants/Pagination'
import objectToFormFieldArray from '../../utils/objectToArray';

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
    let {
      page,
      pagesize = pagination.PAGE_SIZE,
    } = ctx.query
    // 使用分页
    if (page !== undefined) {
      page = parseInt(page, 0)
      pagesize = parseInt(pagesize, 0)
      let sortConfig = {}
      if (ctx.query.sortColumn !== undefined && ctx.query.sortColumn !== '') {
        sortConfig[ctx.query.sortColumn] = ctx.orderType || pagination.ORDER_TYPE
      }

      const totalNumber = await User.count()
      const users = await User.find()
        .skip(pagesize * (page - 1))
        .limit(pagesize)
        .sort(sortConfig)
        .select('_id username email gender')
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

  /**
   * 编辑用户
   * @param {*} ctx
   */
  async update(ctx) {
    const { body } = ctx.request
    const { id } = ctx.params
    try {
      if (id !== undefined || id !== '') {
        let user = await User.find({ username: body.username });
        if (!user.length) {
          /**
           * 关于update后 user 不是最新的的问题，添加 {new: true}
           * https://stackoverflow.com/questions/32811510/mongoose-findoneandupdate-doesnt-return-updated-document
           */
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
      } else {
        ctx.status = 400;
        ctx.body = {
          message: '用户id不能为空',
        }
      }
    } catch (error) {
      if (error.errors) {
        ctx.status = 400
        ctx.body = {
          errors: objectToFormFieldArray(error.errors),
        }
        return;
      }
      ctx.throw(500)
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
      ctx.throw(500)
    }
  }
}

export default new UserController()
