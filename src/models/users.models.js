import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const usersModel = new Schema({
  username: {
    type: String,
    unique: true,
    index: true,
    required: true // Este campo es obligatorio
  },
  password: {
    type: String,
    required: true // Este campo es obligatorio
  },
  role: {
    type: String,
    required: true // Este campo es obligatorio
  }
});

const UsersModel = mongoose.model('users', usersModel);
export default UsersModel;