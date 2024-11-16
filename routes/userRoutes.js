const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', userController.getAllUsers);
router.get('/:login', userController.getUser);
router.post('/createUser', userController.createUser);
router.put('/updateUser/:id', userController.updateUser);
router.delete('/deleteUser/:id', userController.deleteUser);
router.post('/login', userController.login);
router.get('/bonjour', authMiddleware.authMiddleware, (req, res) => { res.send('bonjour'); });


module.exports = router;
