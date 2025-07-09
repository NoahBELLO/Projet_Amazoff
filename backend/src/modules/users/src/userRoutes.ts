import { Router } from 'express';
import UserController from "./userController";
const router: Router = Router();

const userController: UserController = new UserController();
// GET
router.get('/health', (req, res) => { res.status(200).send('OK'); });
router.get('/', userController.getAllUsers);
router.get('/id/:id', userController.getUserById);
router.get('/email/:email', userController.getUserByEmail);
router.get('/login/:login', userController.getUserByLogin);
router.get('/filtrer/email/:email', userController.getUserByEmailFiltrer);
router.get('/filtrer/login/:login', userController.getUserByLoginFiltrer);
router.get('/filtrer/id/:id', userController.getUserByIdFiltrer);
router.get('/avis_filtrer/id/:id', userController.getUserByIdFiltrerAvisPython);
router.get('/commandes_filtrer/id/:id', userController.getUserByIdFiltrerCommandesPython);
router.get('/info/:id', userController.getUserInfo);
router.get('/infos/:id', userController.getUserInfos);
router.get('/middleware/:id', userController.getUserByIdMiddleware);

// POST
router.post('/', userController.createUser);

// PUT
router.put('/', userController.updateUserRegister);
router.put('/id/:id', userController.updateUserById);
router.put('/email/:email', userController.updateUserByEmail);
router.put('/login/:login', userController.updateUserByLogin);

// PATCH
router.patch('/:id', userController.patchUserById);
router.patch('/role/:id', userController.patchUserRole);

//DELETE
router.delete('/id/:id', userController.deleteUserById);
router.delete('/email/:email', userController.deleteUserByEmail);
router.delete('/login/:login', userController.deleteUserByLogin);

export default router;