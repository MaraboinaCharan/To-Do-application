import mongoose from "mongoose";
import validator from "validator";
import captureIp from "../middlewares/captureIp.js";
import userMiddleware from "../middlewares/user-middleware.js";
import userService from "../services/user-service.js";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        // required:[true,'Please Enter your name']
    },
    email:{
        type:String,
        required:[true,'Please Enter your E-mail'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please Enter valid E-mail']
    },
    contactNumber:{
     type:String,
     required:[true,'Please Enter Contact Number'],
     unique:true,
     validate:[validator.isMobilePhone,'Please Enter Contact Number']
    },
    gender:{
        type:String,
        // required:[true,'Please Select Your Gender'],
    },
    password:{
        type:String,
        // required:[true,'Please Enter Password'],
        minlength:8
    },
    confirmPassword:{
        type:String,
        // required:[true,'Please Enter Confirm Password'],
        minlength:8,
        validate: {
            validator: function(pass) {
                return  pass===this.password;
            },
            "message":"Passwords didn't match"
    }
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    supabaseId: {  
        type: String,
        required: false
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetTokenExpires:Date,
})

userSchema.methods.comparePasswordInDb=userService.comparePasswordInDb;
userSchema.methods.isPasswordChanged=userService.isPasswordChanged;

userSchema.pre('save',async function(next){
    await userMiddleware.hashThePassword.call(this,next);
})
userSchema.pre('save',async function(next){
await captureIp();
});

const user=mongoose.model('user',userSchema);
export default user;