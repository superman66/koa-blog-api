import mongoose from 'mongoose'
import { isNullOrUndefined, isNumber } from 'util';
import MenuModel from '../../models/Menu.model'
import * as pagination from '../../constants/Pagination'
import formErrorMiddleware from '../../middlewares/formErrorMiddleware'

const Menu = mongoose.model('Menu')

class MenuController {
  /**
 * 菜单分页列表
 * @param {*} ctx
 */
  async menus(ctx) {
    let { page, pagesize = pagination.PAGE_SIZE } = ctx.query
    const {
      sortColumn = pagination.SORT_COLUMN,
      orderType = pagination.ORDER_TYPE,
     } = ctx.query
    const params = {
      sort: {
        order: 'asc',
      },
      filter: {},
    }
    params.sort[sortColumn] = orderType

    try {
      // 使用分页
      if (!isNullOrUndefined(page) && isNumber(parseInt(page, 0))) {
        page = parseInt(page, 0)
        pagesize = parseInt(pagesize, 0)

        const total = await Menu.count()
        const menus = await Menu.find()
          .populate({
            path: 'children',
            select: '_id name key link icon children order',
          })
          .skip(pagesize * (page - 1))
          .limit(pagesize)
          .sort(params.sort)
          .select('_id name key link icon children order')
        ctx.status = 200
        ctx.body = {
          page: {
            page,
            pagesize,
            total,
          },
          data: {
            menus,
          },
        }
      } else {
        const menus = await Menu.find()
          .sort(params.sort)
          .populate({
            path: 'children',
            select: '_id name key link icon children order',
          })
          .select('_id name key link icon children order')
        ctx.status = 200
        ctx.body = {
          data: {
            menus,
          },
        }
      }
    } catch (error) {
      formErrorMiddleware(ctx, error)
    }
  }

  /**
   * 新增菜单
   * @param {*} ctx
   */
  async add(ctx) {
    const { body } = ctx.request
    try {
      const menu = new Menu(body)
      await menu.save()

      ctx.status = 200
      ctx.body = {
        message: '操作成功',
      }
    } catch (error) {
      formErrorMiddleware(ctx, error)
    }
  }

  /**
   * 编辑菜单
   * @param {*} ctx
   */
  async update(ctx) {
    const { body } = ctx.request
    const { id } = ctx.params
    try {
      console.log(body);
      await Menu.findByIdAndUpdate(id, body)
      ctx.status = 200
      ctx.body = {
        message: '操作成功',
      }
    } catch (error) {
      formErrorMiddleware(ctx, error)
    }
  }

  async remove(ctx) {
    const { id } = ctx.params
    try {
      await Menu.findByIdAndRemove(id)
      ctx.status = 200
      ctx.body = {
        message: '操作成功',
      }
    } catch (error) {
      formErrorMiddleware(ctx, error)
    }
  }
}

export default new MenuController()
