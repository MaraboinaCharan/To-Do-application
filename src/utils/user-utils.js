import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import user from '../models/user.js';
dotenv.config({path:'./config.env'});

const signToken=(id,secret,expiresIn)=>{
    return jwt.sign({id},secret,{
        expiresIn
    })
    
}
export const sendResponse=(res,statusCode,status,message,data) => {
    return res.status(statusCode).json({
        status,
        message,
        data
    });
};

export const createSendResponse=(user,statusCode,res,secret,expiresIn,cookieExpires,cookieName)=>{

    const token=signToken(user._id,secret,expiresIn);
    const options={
        maxAge:cookieExpires,
        httpOnly:true,
        sameSite:'None',
        secure:true,
        path: cookieName === 'userJwt' ? '/userJwt' : '/userJwt'
    }
    res.cookie(cookieName,token,options);
    user.password=undefined,
    user.confirmPassword=undefined;
    console.log(res.path,cookieName);
    sendResponse(res,statusCode,'success','',{user,token});
}

export const validateObjectId=(id,res) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        sendResponse(res,400,'Failed','Invalid ID',null);
        return false;
    }
    return true;
};





  export const getSecretStringandExpiresIn=(path)=>{
    if(path.startsWith('/'))
    {
       return {
       secret:process.env.SECRET_STR,
       expiresIn:process.env.LOGIN_EXPIRES,
       cookieExpires:parseInt(process.env.COOKIE_EXPIRES),
       cookieName:'userJwt'
    }

    }
}
  