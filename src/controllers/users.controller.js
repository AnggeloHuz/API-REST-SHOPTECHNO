import { hashearPassword } from "../middlewares/hash.js";
import { equality, validatePassword, validateEmail } from "../middlewares/validations.js";
import UsersModel from "../models/users.models.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class usersControllers {
  all() {
    return new Promise(async (resolve, reject) => {
      try {
        // Buscamos todos los datos del fichero usuarios
        let allUsers = await UsersModel.find();
        if (allUsers.length === 0) {
          return reject({
            status: 400,
            message: "No tenemos usuarios registrados todavía",
          });
        }
        return resolve({
          status: 200,
          message: "Se han extraido todos los usuarios",
          data: allUsers,
        });
      } catch (error) {
        reject({
          status: 500,
          message: "Error interno del servidor: " + error,
        });
      }
    });
  }

  create(user) {
    return new Promise(async (resolve, reject) => {
      const {
        username,
        password,
        passwordConfirm,
        role = "user",
        name,
        lastname,
        email,
      } = user;
      if (
        !username ||
        !password ||
        !passwordConfirm ||
        !name ||
        !lastname ||
        !email
      ) {
        return reject({
          status: 400,
          message: "Faltan propiedades indispensables",
        });
      }
      if (!equality(password, passwordConfirm)) {
        return reject({
          status: 400,
          message: "Las contraseñas no coinciden",
        });
      }
      if (!validateEmail(email)) {
        return reject({
          status: 400,
          message: "El email no es válido",
        });
      }
      if (!validatePassword(password)) {
        return reject({
          status: 400,
          message: "La contraseña no cumple con el formato solicitado",
        });
      }
      try {
        const passwordHashed = await hashearPassword(password);
        const newUser = {
          username,
          password: passwordHashed,
          role,
          email,
          name,
          lastname,
        };
        const userCreate = await UsersModel.create(newUser);
        return resolve({
          status: 201,
          message: "El usuario: " + username + " se ha creado con éxito",
          data: userCreate,
        });
      } catch (error) {
        return reject({
          status: 500,
          message: "Error interno del servidor: " + error,
        });
      }
    });
  }

  searchOne(username) {
    return new Promise(async (resolve, reject) => {
      try {
        const userSearch = await UsersModel.find({ username: username });
        if (userSearch.length === 0) {
          return reject({
            status: 400,
            message: "No se encontro el usuario " + username,
          });
        }
        return resolve({
          status: 200,
          message: "Se ha encontrado al usuario " + username,
          data: userSearch,
        });
      } catch (error) {
        return reject({
          status: 500,
          message: "Error interno del servidor: " + error,
        });
      }
    });
  }

  updatePassword(username, body) {
    const { password } = body;
    return new Promise(async (resolve, reject) => {
      // Verificamos que envias la entidad para actualizar
      if (!password) {
        return reject({
          status: 400,
          message: "Debes enviar mínimo una entidad para editar",
        });
      }
      try {
        let passwordHashed = "";
        const userSearch = await UsersModel.find({ username: username });
        if (userSearch.length === 0) {
          return reject({
            status: 400,
            message: "No se encontro el usuario " + username,
          });
        }
        if (password) {
          if (!validatePassword(password)) {
            return reject({
              status: 400,
              message: "La contraseña no cumple con el formato solicitado",
            });
          }
          // Haseamos la contraseña
          passwordHashed = await hashearPassword(password);
        }

        // Editamos el usuario que encontramos
        let userEdit = userSearch[0];
        userEdit.password = password ? passwordHashed : userEdit.password;

        // Actualizamos en la base de datos
        const userEditBD = await UsersModel.updateOne(
          { username: username },
          userEdit
        );
        return resolve({
          status: 201,
          message: "Se ha actualiado la contraseña del usuario " + username,
          data: username,
        });
      } catch (error) {
        return reject({
          status: 500,
          message: "Error interno del servidor: " + error,
        });
      }
    });
  }

  delete(username) {
    return new Promise(async (resolve, reject) => {
      try {
        const userSearch = await UsersModel.find({ username: username });
        if (userSearch.length === 0) {
          return reject({
            status: 400,
            message: "No se encontro el usuario " + username,
          });
        }

        const deleteUser = await UsersModel.deleteOne({ username: username });
        return resolve({
          status: 201,
          message: "Se ha eliminado al usuario: " + username,
          data: username,
        });
      } catch (error) {
        return reject({
          status: 500,
          message: "Error interno del servidor: " + error,
        });
      }
    });
  }

  login(userLogin, res) {
    return new Promise(async (resolve, reject) => {
      try {
        // 1. Obtenemos username y password
        const { username, password } = userLogin;

        if (!username || !password) {
            return reject({
                status: 400,
                message: "Faltan propiedades escensiales"
            })
        }

        // 2. Buscar al usuario por username
        const user = await UsersModel.find({username: username}); // <-- Cambio aquí
        if (user.length === 0) {
          return reject({
            status: 401,
            message: "Usuario o contraseña incorrectos"
          })
        }

        console.log(user)
        // 3. Comparar contraseñas
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
          return reject({
            status: 401,
            message: "Usuario o contraseña incorrectos"
          })
        }

        // 4. Crear el Payload (AHORA CON USERNAME)
        const payload = {
          id: user[0].id,
          username: user[0].username, // <-- Cambio aquí
          role: user[0].role,
        };

        // 5. Firmar el Token
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        // 6. Guardar el Token en la Cookie segura
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 3600000,
        });

        return resolve({
            status: 200,
            message: `Login exitoso. Bienvenido ${user[0].username} (Rol: ${user[0].role})`,
            data: user[0].username
        })
      } catch (error) {
        return reject({
          status: 500,
          message: "Error interno del servidor: " + error,
        });
      }
    });
  };

  logout(res) {
    return new Promise(async (resolve, reject) => {
        try {
           res.cookie("token", "", {
             httpOnly: true,
             expires: new Date(0),
           });
           return resolve({
            status: 200,
            message: "Se ha cerrado la sesión exitosamente",
            data: []
           })
        } catch (error) {
            return reject({
              status: 500,
              message: "Error interno del servidor: " + error,
            });
        }
    })
  }
}

export default new usersControllers;