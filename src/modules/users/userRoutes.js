const express = require('express');
const router = express.Router();
const userController = require('./userController');
const authMiddleware = require('../../middleware/authMiddleware');
// il faut le préfixe /users



router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);

router.post('/createUser', userController.createUser);

router.put('/updateUser/:id', userController.updateUser);
router.put('/edit-password', userController.editPassword);

router.delete('/deleteUser/:id', userController.deleteUser);


module.exports = router;
