import jwt from "jsonwebtoken"
import asyncHandler from "../utility/asyncHandler.js"
import APIError from "../utility/APIError.js"
import { User } from "../model/user.model.js"



export const verifyJWT=asyncHandler(async function(req,res,next){
    const token=req.cookies?.accessToken || req.header("Authorization")?.split(' ')?.[1];
    if(!token){
        throw new APIError(401,"Invalid token!")
    }

    const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN);

    const findUser=await User.findById(decodedToken._id).select("-password -refreshToken")

    if(!findUser){
        throw new APIError(404,"Invalid User")
    }

    req.user=findUser;
    
    next()

})