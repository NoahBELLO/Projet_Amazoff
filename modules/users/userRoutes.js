const express = require('express');
const router = express.Router();
const userController = require('../users/userController');
const authMiddleware = require('../../middleware/authMiddleware');
// il faut le préfixe /users

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.get('/:login', userController.getUser);
router.post('/createUser', userController.createUser);
router.put('/updateUser/:id', userController.updateUser);
router.delete('/deleteUser/:id', userController.deleteUser);
router.post('/login', userController.login);
router.get('/bonjour', authMiddleware.authMiddleware, (req, res) => { res.send('bonjour'); });


module.exports = router;
