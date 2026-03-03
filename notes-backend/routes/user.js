// routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { registerValidator, loginValidator } = require('../validators/userValidator');

router.post('/register', registerValidator, userController.register);
router.post('/login', loginValidator, userController.login);

module.exports = router;