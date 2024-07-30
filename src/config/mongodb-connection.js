import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config({path:'./config.env'});

const connectDb=async ()=>{
    try{
      await mongoose.connect(process.env.MONGODB_URI,{});
      console.log('MongoDB DataBase Connected !')
    }
    catch(err){
   console.error('Connection failed',err.message);
   process.exit(1);
    }
}

export default connectDb;