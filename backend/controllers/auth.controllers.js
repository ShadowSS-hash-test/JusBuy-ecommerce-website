import User from "../models/user.model.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
 import { redis } from "../config/redis.js";


dotenv.config()


function generateTokens(userId) {
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn:"15m"});
    const refreshToken = jwt.sign({userId},process.env.REFRESH_TOKEN_SECRET,{expiresIn:"7d"});

    return {accessToken,refreshToken}
}

const storeRefreshToken = async(userId,refreshToken)=>{
         await redis.set(`refresh_token:${userId}`,refreshToken,"EX",7*24*60*60) 
}

const setCookies = (res,accessToken,refreshToken)=>{
    res.cookie("accessToken",accessToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict",
        maxAge:15*60*1000 //15 mins

    })

       res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict",
        maxAge:7*24*60*60*1000 //7 days

    })
}



export const signup = async(req,res)=>{
    const {email,password,name,role} = req.body;

    if(!email || !password || !name)
    {
        return res.status(401).json({
            message:"make sure to fill all the fields"
        })
    }

    try{
        
        const userExistence = await User.findOne({email:email})

        if(userExistence)
        {
            return res.status(409).json({
                success:false,
                message:"A user already exists with this email"
            })
        }

        const createdUser = await User.create({email,password,name,role});


        //generate Tokens for authentication
        const {accessToken,refreshToken} = generateTokens(createdUser._id);

        //storing in redis
        await storeRefreshToken(createdUser._id,refreshToken) 

        setCookies(res,accessToken,refreshToken)

        res.status(201).json({
            success:true,
            message:"Successfully created a new user",
            data:{_id:createdUser._id,name:createdUser.name,email:createdUser.email,role:createdUser.role }
        })



    }
    catch(error)
    {
          console.log("Error in signup controller: " + error.message)
        return res.status(500).json({
            success:false,
            message:"Failed to create user",
            err:error
        })

    }

}

export const login = async(req,res)=>{
    try{
            const {email,password} = req.body;
            const user = await User.findOne({email:email})
            if(!user || ! (await user.comparePassword(password)))
            {
                return res.status(400).json({
                    message:"Incorrect email or password"
                })
            }

            
        //generate Tokens for authentication
        const {accessToken,refreshToken} = generateTokens(user._id);

        //storing in redis
        await storeRefreshToken(user._id,refreshToken) 

        setCookies(res,accessToken,refreshToken)

        res.status(201).json({
            success:true,
            message:"Successfully logged in",
            data:{_id:user._id,name:user.name,email:user.email,role:user.role }
        })



         
    }catch(error){
        console.log("Error in login controller: " + error)
          res.status(500).json({
            success:false,
            message:"Internal server Error"
          })
    }
 

}

export const logout = async(req,res)=>{
        try{
            
            const refreshToken = req.cookies.refreshToken
           
            if(refreshToken){
                const decode = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
               
                
                await redis.del(`refresh_token:${decode.userId}`)

            }

            res.clearCookie("refreshToken");
            res.clearCookie("accessToken")
            res.json({message:"Logged out successfully"})

        }catch(error)
        {
              console.log("Error in logout controller: " + error)
            res.status(500).json({
                success:false,
                message:"failed to logout, internal server error.",
                err:error.message
            })

        }
        
}

export const refreshToken = async(req,res)=>{
    try{
        const refreshTok = req.cookies.refreshToken;
        if(!refreshTok)
        {
            return res.status(401).json({
                message:"No refresh token found"
            })
        }

        const decode = jwt.verify(refreshTok,process.env.REFRESH_TOKEN_SECRET)
        const storedToken = await redis.get(`refresh_token:${decode.userId}`)

        if(refreshTok !== storedToken)
        {
            return res.status(401).json({
                message:"Invalid refresh token"
            })
        }

        const accessToken = jwt.sign({userId: decode.userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn:"15m"});

       res.cookie("accessToken",accessToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict",
        maxAge:15*60*1000 //15 mins

    })

    return res.status(200).json({
        message:"Successfully refreshed access token"
    })

    




    }catch(error)
    {
        console.log(`Error in refreshToken controller ${error}`)
        return res.status(500).json({
            success:false,
            message:error.message
        })

    }
}

export const getProfile = async(req,res)=>{
    try{
        res.json(req.user);

    }catch(error){
        res.status(500).json({
            message:"Server error",
            error: error.message
        })
    }
}




