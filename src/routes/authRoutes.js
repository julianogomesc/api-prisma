// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/authController');

router.post('/login', (req, res) => userController.Login(req, res));

module.exports = router;
