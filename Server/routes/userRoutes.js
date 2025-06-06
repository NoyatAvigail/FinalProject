import express from 'express';
import userController from '../controller/userController.js';
const router = express.Router();

router.route('/login')
    .post(userController.login);
router.route('/signup')
    .post(userController.signup);

export default router;