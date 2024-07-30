import mongoose from "mongoose";
import user from "./user.js";

const sessionSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    sessions:[
        {
            loginTime:{
                type:Date,
                default:Date.now()
            },
            logoutTime:Date,
            loginIpAddress:{
                type:String,
                required:[true,'login Ip Address is required']
            },
            logoutIpAddress:{
                type:String,
            }
        }
    ]
})

const session=mongoose.model('session',sessionSchema);

export default session;