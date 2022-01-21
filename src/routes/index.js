import express from "express";
import { User } from "../controllers/User";
import { registerUserValidation, userLoginValidation } from "../middlewares/validation";

const router = express.Router()

router.post('/login', userLoginValidation, User.login)
router.post('/register', registerUserValidation, User.register)
router.post('/logout', User.logout)

export default router