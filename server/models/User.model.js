import mongoose, {
  Schema
} from 'mongoose'

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    validate: {
      validator(v) {
        // 6-20位大小写字母、数字、中文字符及下划线。且下划线不能在开头结尾
        return /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]{6,30}$/.test(v)
      },
      message: '用户名必须只含有汉字、数字、字母、下划线不能以下划线开头和结尾',
    },
    required: [true, '用户名不能为空'],
  },
  password: {
    type: String,
    validate: {
      validator(v) {
        return /([a-zA-Z0-9]){3,20}/.test(v)
      },
      message: '密码必须为',
    },
    required: [true, '密码不能为空'],
  },
  email: {
    type: String,
    validate: {
      validator(v) {
        return /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/.test(v)
      },
      message: '请输入正确的邮箱',
    },
  },
  gender: Number,
  createTime: {
    type: Date,
    default: Date.now(),
  },
  updateTime: {
    type: Date,
    default: Date.now(),
  },
})

UserSchema
  .virtual('userInfo')
  .get(function () {
    return {
      _id: this._id,
      username: this.username,
      email: this.email,
      gender: this.gender,
    }
  })

class UserClass {
  static findUsersPagination(page, pageSize, params) {
    return this.find()
      .or(params.query)
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .sort(params.sort)
      .select('username email gender createTime updateTime')
  }

  static findUsers(params) {
    return this.find()
      .or(params.query)
      .sort(params.sort)
      .select('username email gender createTime updateTime')
  }
}

UserSchema.loadClass(UserClass)
export default mongoose.model('User', UserSchema)
