import { hashearPassword } from "../middlewares/hash.js";
import { equality, validatePassword } from "../middlewares/validations.js";
import UsersModel from "../models/users.models.js";

class usersControllers {
    all(){
        return new Promise(async(resolve, reject) => {
            try {
                // Buscamos todos los datos del fichero usuarios
                let allUsers = await UsersModel.find()
                if (allUsers.length === 0) {
                   return reject({
                    status: 400,
                    message: "No tenemos usuarios registrados todavía"
                   }) 
                }
                return resolve({
                    status: 200,
                    message: "Se han extraido todos los usuarios",
                    data: allUsers
                })
            } catch (error) {
                reject({
                    status: 500,
                    message: "Error interno del servidor: " + error
                })
            }
        })
    }

    create(user) {
        return new Promise(async (resolve, reject) => {
            const {username, password, passwordConfirm, role = "user"} = user
            if (!username || !password || !passwordConfirm) {
                return reject({
                    status: 400,
                    message: "Faltan propiedades indispensables"
                })
            }
            if (!equality(password, passwordConfirm)) {
                return reject({
                    status: 400,
                    message: "Las contraseñas no coinciden"
                })
            }
            if (!validatePassword(password)) {
                return reject({
                    status: 400,
                    message: "La contraseña no cumple con el formato solicitado"
                })
            }
            try {
                const passwordHashed = await hashearPassword(password);
                const newUser = {
                    username,
                    password: passwordHashed,
                    role
                }
                const userCreate = await UsersModel.create(newUser);
                return resolve({
                    status: 201,
                    message: "El usuario: " + username + " se ha creado con éxito",
                    data: userCreate
                })
            } catch (error) {
                return reject({
                    status: 500,
                    message: "Error interno del servidor: " + error
                })
            }
        })
    }

    searchOne(username) {
        return new Promise(async (resolve, reject) => {
            try {
                const userSearch = await UsersModel.find({username: username})
                if (userSearch.length === 0) {
                    return reject({
                        status: 400,
                        message: "No se encontro el usuario " + username
                    })
                }
                return resolve({
                    status: 200,
                    message: "Se ha encontrado al usuario " + username,
                    data: userSearch
                })
            } catch (error) {
                return reject({
                    status: 500,
                    message: "Error interno del servidor: " + error
                })
            }
        })
    }

    updatePassword(username, body){
        const { password } = body
        return new Promise(async (resolve, reject) => {
            // Verificamos que envias la entidad para actualizar
            if (!password) {
                return reject({
                    status: 400,
                    message: "Debes enviar mínimo una entidad para editar"
                })
            }
            try {
                let passwordHashed = ""
                const userSearch = await UsersModel.find({username: username})
                if (userSearch.length === 0) {
                    return reject({
                        status: 400,
                        message: "No se encontro el usuario " + username
                    })
                }
                if (password){
                    if (!validatePassword(password)) {
                        return reject({
                            status: 400,
                            message: "La contraseña no cumple con el formato solicitado"
                        })
                    }
                    // Haseamos la contraseña
                    passwordHashed = await hashearPassword(password);
                }
                
                // Editamos el usuario que encontramos
                let userEdit = userSearch[0]
                userEdit.password = password ? passwordHashed : userEdit.password
                
                // Actualizamos en la base de datos
                const userEditBD = await UsersModel.updateOne({username: username}, userEdit);
                return resolve({
                    status: 201,
                    message: "Se ha actualiado la contraseña del usuario " + username,
                    data: {
                        username
                    }
                })
            } catch (error) {
                return reject({
                    status: 500,
                    message: "Error interno del servidor: " + error
                })
            }
        })
    }
}

export default new usersControllers;