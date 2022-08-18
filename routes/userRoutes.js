import express from 'express';


const router = express.Router();
import userController from '../controllers/userController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';


router.use('/changepassword', checkUserAuth )

router.use('/loggedUser', checkUserAuth )

//public route

router.post('/register', userController.userRegisteration)

router.post('/login', userController.userLogin)

router.post('/sendUserPasswordResetEmail', userController.sendUserPasswordResetEmail)

router.post('/userPasswordReset/:id/:token', userController.userPasswordReset)





//protected route
router.post('/changepassword', userController.changeUserPassword)

router.get('/loggedUser', userController.loggedUser)
export default router;