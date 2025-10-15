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
                return response({
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
}

export default new usersControllers;