import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
  username: String,
  password: String,
})

UserSchema
  .virtual('userInfo')
  .get(function () {
    return {
      username: this.username,
    }
  })

export default mongoose.model('User', UserSchema)
