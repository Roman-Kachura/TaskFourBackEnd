const express = require('express');
const router = express.Router();
const usersController = require('./usersController');
const authMiddleWares = require('../auth/auth-middlewares');


router.get('/', authMiddleWares, usersController.getAllUsers);
router.get('/:id', authMiddleWares, usersController.getUser);
router.put('/', authMiddleWares, usersController.updateUsers);
router.post('/', authMiddleWares, usersController.deleteUsers);

module.exports = router;