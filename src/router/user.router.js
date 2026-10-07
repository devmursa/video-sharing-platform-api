import { Router } from "express";
import { userRegister,userLogin,userLogout, changePassword,changeAvatar } from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import {verifyJWT} from "../middleware/auth.middleware.js"

const userRouter=Router()


userRouter.route('/register').post(upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'coverImg', maxCount: 1 }]),userRegister)
userRouter.route('/login').post(userLogin)
userRouter.route('/logout').post(verifyJWT,userLogout)
userRouter.route('/changepassword').post(verifyJWT,changePassword)
userRouter.route('/changeavatar').post(verifyJWT,upload.single('avatar'),changeAvatar)


export {userRouter}

