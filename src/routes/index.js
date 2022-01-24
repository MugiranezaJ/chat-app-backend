import express from "express";
import { User } from "../controllers/User";
import { registerUserValidation, userLoginValidation } from "../middlewares/validation";

const router = express.Router()

router.post('/login', userLoginValidation, User.login)
router.post('/register', registerUserValidation, User.register)
router.post('/logout', User.logout)
router.get('/user/byemail', User.getUserInfo)
router.get('/users', User.getAllUsersList)
router.post('/verify_token', User.verifyUserToken)

export default router