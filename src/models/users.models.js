import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const usersModel = new Schema({
  id: ObjectId,
  username: String,
  password: String,
  role: String
});

const UsersModel = mongoose.model('users', usersModel);
export default UsersModel;