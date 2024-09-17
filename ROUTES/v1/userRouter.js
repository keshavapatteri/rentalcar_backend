import express from 'express'
import { cheackUser, UserCreate, UserLogin, UserLogout, UserProfile } from '../../CONTROLLER/userController.js';
import { authUser } from '../../MIDDLEWARE/authUser.js';
import { upload } from '../../MIDDLEWARE/uploadMiddleware.js';

const router = express.Router()

// router.post('/create',UserCreate);
router.post('/create', upload.single("image"), UserCreate);

router.post('/login',UserLogin);
//for seeing profile access
router.get('/profile',authUser,UserProfile);
//cheack user for frontent protection
router.get('/check-user',authUser,cheackUser)
router.post("/logout",UserLogout);
export default router;


//update user not found ?
