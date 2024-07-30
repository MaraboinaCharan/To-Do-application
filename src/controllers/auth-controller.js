import Session from '../models/session.js';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import { createSendResponse, getSecretStringandExpiresIn, sendResponse } from '../utils/user-utils.js';
import supabase from '../config/supabase.js';
import captureIp from '../middlewares/captureIp.js';

const register=async (req,res,next)=>{
    try{
    const {email,password}=req.body;
    let existingUser=await User.findOne({email});
    if(existingUser)
    {
     return sendResponse(res,400,'Error','User already exists',null);
    }
    console.log(await supabase.auth.signUp({email,password}))
    // const {data,error}=await supabase.auth.signUp({email,password});
    const response = await supabase.auth.signUp({
        email,
        password
    });
    console.log("Supabase Response:", response);

    const { data, error } = response;
    console.log("data",data);
    if(error){
   return sendResponse(res,404,'Error',error.message,null);
    }
    if (!data.user || !data.user.id) {
        return sendResponse(res, 500, 'Error', 'Failed to get user ID from Supabase', null);
    }
    const user=new User({
        email,
        password,
        supabaseId:data.user.id
    })
    const loginResponse = await supabase.auth.signInWithPassword({ email, password });

        if (loginResponse.error) {
            return sendResponse(res, 400, 'Error', 'login error', null);
        }

        const newSession = new Session({
            userId: user._id,
            // sessions: [{ loginIpAddress: req.clientIp }]
        });
        await newSession.save();


    await user.save();

    return sendResponse(res,201,'Success','User registered succesfully',{userId:user._id});
}
catch(err)
{
    sendResponse(res,500,'Error',err.message,null);
}
}

const login=async (req,res,next)=>{
    try{
    
       const {email,password}=req.body;
     
       const user=await User.findOne({email}).select('+password');
    //    console.log(user._id.toString())
    //    const isPasswordCorrect=await user.comparePasswordInDb(password,user.password);
     
    //    if(!user||!isPasswordCorrect)
    //    {
    //      return sendResponse(res,401,'Error','Invalied email or passowrd',null);
    //    }
       const {secret,expiresIn,cookieExpires,cookieName}=getSecretStringandExpiresIn(req.path)

       const session=await Session.findOne({userId:user._id.toString()});
    //    console.log(await Session.findOne({userId:user._id}))
    //    console.log( req.clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress)
    req.clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress
       if(session)
       {
        session.sessions.push({loginIpAddress:req.clientIp});
        await session.save();
       }
       else{
        const newSession=new Session({
            userId:user._id,
            sessions:[{loginIpAddress:req.clientIp}]
        });
        await newSession.save();
       }
       // console.log(req.path,cookieName)
     createSendResponse(user,200,res,secret,expiresIn,cookieExpires,cookieName);
    // sendResponse(res,201,'Success',user,session)
     
      }
      catch(err)
      {
        sendResponse(res,500,'Error',err.message,null);
      }
}

const logout=async (req,res,next)=>{
try{
    const {cookieName}=getSecretStringandExpiresIn(req.path)
 res.clearCookie(cookieName,{
    httpOnly:true,
    sameSite:'None',
    secure:true
 });
 req.clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress
 const {userId}=req.body;
 const session=await Session.findOne({userId});
 if(!session)
 {
    return 
 }
 const lastSession=session.sessions[session.sessions.length-1];
 lastSession.logoutTime=Date.now();
 lastSession.loginIpAddress=req.clientIp;
await session.save();

 return sendResponse(res,200,'Success','Logged out ')
}
catch(err)
{
    sendResponse(res,500,'Error',err.message,null);
}
}

const getSessions=async (req,res,next)=>{
    try{
const sessions=await Session.find().populate('userId','email',)
 if(!sessions.length){
    return sendResponse(res,404,'Error','There is no activity',null);
 }
 const sessionData=sessions.map(session=>({
    userId:session.userId._id,
    email:session.userId.email,
    sessions:session.sessions
 })
 )
 sendResponse(res,200,'Success','All user sessions fetched',sessionData)
    }
    catch(err)
    {
        sendResponse(res,500,'Error',err.message,null);
    }
}

const authController={register,login,logout,getSessions};

export default authController;