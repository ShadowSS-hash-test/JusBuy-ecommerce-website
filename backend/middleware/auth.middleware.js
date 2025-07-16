import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import User from "../models/user.model.js"

dotenv.config()

export const protectRoute = async(req,res,next) =>{
    try {
        const accessToken = req.cookies.accessToken;
        if(!accessToken)
        {
            return res.status(401).json({
                message:"Unauthorized access - access token not found"
            })
        }


            try {

                const decode = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
                
                const user = await User.findById(decode.userId).select("-password")


                if(!user)
                {
                    return res.status(401).json({
                        message:"User not found"
                    })
                }

                req.user = user;
                next()


                
            } catch (error) {
                if(error.name === "TokenExpiredError")
                {
                    return res.status(401).json({
                        message:"Unauthorized - Access token expired"
                    })
                }

                throw error;
            }
        


    } catch (error) {
        console.log("Error in protectRoute middleware: " + error.message)
        return res.status(401).json({
            message:"Unauthorized - Invalid access token"
        })
    }
}

export const adminRoute = async(req,res,next)=>{
      if(req.user && req.user.role === "admin"){
        next();
      }

      else{
                 return res.status(401).json({
                message:"Access denied. Only admins are allowed"
                })
      }

}

 