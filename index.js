import app from "./app.js";
import dotenv from 'dotenv'

dotenv.config('./config.env');
const port=process.env.PORT||5600;
app.listen(port,()=>{
    console.log(`App is running on Port ${port}`);
})