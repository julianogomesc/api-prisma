// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware')

router.post('/create', auth(1), (req, res) => userController.Create(req, res));
router.get('/', auth(1), (req, res) => userController.FindAll(req, res));
router.get('/:id', auth(1), (req, res) => userController.FindById(req, res));
router.put('/update/:id', auth(1), (req, res) => userController.Update(req, res));
router.delete('/delete/:id', auth(1), (req, res) => userController.Delete(req, res));

module.exports = router;
