import mongoose from 'mongoose'
import errorHanle from '../../utils/errorHandle'
import AboutModel from '../../models/About.model'

const About = mongoose.model('About')

class AboutController {

  async detail(ctx) {
    try {
      const abouts = await About.find().limit(1)
      ctx.status = 200
      ctx.body = {
        data: {
          about: abouts.length > 0 ? abouts[0] : {},
        },
      }
    } catch (error) {
      errorHanle(ctx, error)
    }
  }

  async addOrUpdate(ctx) {
    const {
      body,
    } = ctx.request
    const {
      id,
    } = ctx.params
    try {
      if (id) {
        await About.findByIdAndUpdate(id, body, {
          new: true,
        })
      } else {
        await About.create(body)
      }
      ctx.status = 200
      ctx.body = {
        message: '操作成功',
      }
    } catch (error) {
      errorHanle(ctx, error)
    }
  }
}

export default new AboutController()
