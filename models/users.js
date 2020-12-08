import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
  account: {
    type: String,
    minlength: [4, '帳號必須四個字以上'],
    maxlength: [20, '帳號必須二詞個字以下'],
    unique: true,
    required: '帳號必填'
  },
  password: {
    type: String,
    required: [true, '請輸入密碼']
  }
})

const users = mongoose.model('users', userSchema)
export default users
