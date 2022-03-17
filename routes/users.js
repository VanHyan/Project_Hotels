import express from 'express';
import UsersController from '../controllers/UsersController';

const router = express.Router();

router.post('/register', UsersController.register);
router.post('/login', UsersController.logIn);
router.get('/get/data', UsersController.userData);
router.get('/google', UsersController.oauthGoogle);
router.post('/facebook', UsersController.oauthFacebook);
router.delete('/delete/:userId', UsersController.deleteUser);
router.put('/update', UsersController.update);

export default router;
