import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const usersModel = new Schema({
  name: {
    type: String,
    required: true // Este campo es obligatorio
  },
  lastname: {
    type: String,
    required: true // Este campo es obligatorio
  },
  email: {
    type: String,
    required: true // Este campo es obligatorio
  },
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
}, {
  // Opción clave para deshabilitar el campo __v
  versionKey: false
});

const UsersModel = mongoose.model('users', usersModel);
export default UsersModel;