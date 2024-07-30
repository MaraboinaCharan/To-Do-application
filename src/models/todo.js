import mongoose from "mongoose";
import user from "./user.js";

const todoSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    title:{
        type:String,
        required:[true,'Please Enter title']
    },
    description:{
        type:String,
        required:[true,'Please write description for your task']
    },
    status:{
        type:String,
        enum:['pending','in-progess','completed'],
        default:'pending'
    },
    priority:{
        type:String,
        enum:['less','normal','high','very high'],
        default:'normal'
    },
    dueDate:{
        type:Date,
        required:[true,'Due Date is required']
    },
     createdAt:{
        type:Date,
        default:Date.now()

     },
     updatedAt:{
        type:Date,
        default:Date.now()
     }}
     ,{
        timestamps:true
     }
)

const todo=mongoose.model('todo',todoSchema);

export default todo;