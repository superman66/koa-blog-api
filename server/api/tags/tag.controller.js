import mongoose from 'mongoose'
import { isNumber, isNullOrUndefined } from 'util';
import TagModel from '../../models/Tag.model'
import * as pagination from '../../constants/Pagination'
import formErrorMiddleware from '../../middlewares/formErrorMiddleware';


const Tag = mongoose.model('Tag')

class TagController {

  /**
   * 获取tag分页列表
   *  没有page 参数则默认显示全部
   *  page：当前页数
   *  pagesize: 每页数量
   *  sortColunm 排序字段
   *  orderType desc asc default
   * @param {*} ctx
   */
  async tags(ctx) {
    let {
      page,
      pagesize = pagination.PAGE_SIZE,
    } = ctx.query
    try {
      if (!isNullOrUndefined(page) && isNumber(page)) {
        page = parseInt(page, 0)
        pagesize = parseInt(pagesize, 0)
        let sortConfig = {}
        if (ctx.query.sortColumn !== undefined && ctx.query.sortColumn !== '') {
          sortConfig[ctx.query.sortColumn] = ctx.orderType || pagination.ORDER_TYPE
        }
        const total = await Tag.count()
        const tags = await Tag.find()
          .skip(pagesize * (page - 1))
          .limit(pagesize)
          .sort(sortConfig)
          .select('_id name createTime updateTime')
        ctx.status = 200
        ctx.body = {
          page: {
            page,
            pagesize,
            total,
          },
          data: {
            tags,
          },
        }
      } else {
        const tags = await Tag.find()
          .select('_id name createTime updateTime')
        ctx.status = 200
        ctx.body = {
          data: {
            tags,
          },
        }
      }
    } catch (error) {
      formErrorMiddleware(ctx, error)
    }
  }

  /**
   * 新增tag
   * @param {*} ctx
   */
  async add(ctx) {
    const { body } = ctx.request
    try {
      let tag = await Tag.findOne({ name: body.name })
      if (!tag) {
        tag = await Tag.create(body)
        ctx.status = 200
        ctx.body = {
          message: '操作成功',
          data: {
            tag,
          },
        }
      } else {
        ctx.status = 400
        ctx.body = {
          message: '标签名称已存在',
        }
      }
    } catch (error) {
      formErrorMiddleware(ctx, error)
    }
  }

  /**
   * 删除tag
   * @param {*} ctx
   */
  async remove(ctx) {
    const { id } = ctx.request.params
    try {
      if (isNullOrUndefined(id) || id === '') {
        ctx.status = 400
        ctx.body = {
          message: 'id不能为空',
        }
        return;
      }
      await Tag.findByIdAndRemove(id)
      ctx.status = 200
      ctx.body = {
        message: '操作成功',
      }
    } catch (error) {
      formErrorMiddleware(ctx, error)
    }
  }

  /**
   * 更新tag
   * @param {*} ctx
   */
  async update(ctx) {
    const { name } = ctx.request.body
    const { id } = ctx.request.params
    try {
      let tag = await Tag.findOne({ name })
      if (tag) {
        tag = await Tag.findByIdAndUpdate(id, ctx.request.body, { new: true })
        ctx.status = 200
        ctx.body = {
          message: '操作成功',
          data: {
            tag,
          },
        }
      } else {
        ctx.status = 400
        ctx.body = {
          message: '标签名称已存在',
        }
      }
    } catch (error) {
      formErrorMiddleware(ctx, error)
    }
  }
}

export default new TagController()
