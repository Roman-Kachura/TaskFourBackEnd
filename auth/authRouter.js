const express = require('express');
const router = express.Router();
const authController = require('./authController');


router.post('/login', authController.login);
router.post('/registration', authController.registration);
router.delete('/logout/:id', authController.logout);

module.exports = router;