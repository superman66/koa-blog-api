import mongoose, {
  Schema,
} from 'mongoose'

const AboutSchema = new Schema({
  content: String,
  createAt: {
    type: Date,
    default: Date.now(),
  },
})

export default mongoose.model('About', AboutSchema)
