import express from 'express';
import usersController from '../controllers/users.controller.js';
import { checkRole, protectRoute } from '../middlewares/auth.middleware.js';
const router = express.Router();

// Listar todos los usuarios
router.get('/all', protectRoute, checkRole(['admin']),  function(req, res, next) {
  usersController.all()
  .then((response) => {
    res.status(response.status).json({
      "message": response.message,
      "data": response.data
    })
  })
  .catch((error) => {
    res.status(error.status).json({
      "message": error.message
    })
  })
});

// Crear un usuario
router.post('/create', function(req, res, next) {
  usersController.create(req.body)
  .then((response) => {
    res.status(response.status).json({
      "message": response.message,
      "data": response.data
    })
  })
  .catch((error) => {
    res.status(error.status).json({
      "message": error.message
    })
  })
})

// Buscar un usuario
router.get('/search/:username', protectRoute, checkRole(['admin']), function(req, res, next) {
  usersController.searchOne(req.params.username)
  .then((response) => {
    res.status(response.status).json({
      "message": response.message,
      "data": response.data
    })
  })
  .catch((error) => {
    res.status(error.status).json({
      "message": error.message
    })
  })
})

// Actualizar Contraseña
router.put('/change-password/:username', protectRoute, function(req, res, next) {
  usersController.updatePassword(req.params.username, req.body)
  .then((response) => {
    res.status(response.status).json({
      "message": response.message,
      "data": response.data
    })
  })
  .catch((error) => {
    res.status(error.status).json({
      "message": error.message
    })
  })
})

// Eliminar Usuario
router.delete('/delete/:username', protectRoute, checkRole(['admin']), function(req, res, next) {
  usersController.delete(req.params.username)
  .then((response) => {
    res.status(response.status).json({
      "message": response.message,
      "data": response.data
    })
  })
  .catch((error) => {
    res.status(error.status).json({
      "message": error.message
    })
  })
})

// Iniciar Sesión
router.get('/login', function(req, res, next) {
  usersController.login(req.body, res)
  .then((response) => {
    res.status(response.status).json({
      "message": response.message,
      "data": response.data
    })
  })
  .catch((error) => {
    res.status(error.status).json({
      "message": error.message
    })
  })
})

router.get('/logout', function(req, res, next) {
  usersController.logout(res)
  .then((response) => {
    res.status(response.status).json({
      "message": response.message,
      "data": response.data
    })
  })
  .catch((error) => {
    res.status(error.status).json({
      message: error.message,
    });
  })
})

export default router;
