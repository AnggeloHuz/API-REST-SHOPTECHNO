import express from 'express';
import usersController from '../controllers/users.controller.js';
const router = express.Router();

// Listar todos los usuarios
router.get('/all', function(req, res, next) {
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
router.get('/search/:username', function(req, res, next) {
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

export default router;
