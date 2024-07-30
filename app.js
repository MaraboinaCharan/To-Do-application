
import express  from "express";
// import Express  from "express";
import cookieParser from "cookie-parser";
import connectDb from "./src/config/mongodb-connection.js";
import authRouter from "./src/routes/auth-router.js";
import todoRouter from "./src/routes/todo-router.js";

const app=express();
connectDb();
app.use(express.json());
app.use(cookieParser());
app.use('/',authRouter);
app.use('/',todoRouter);


export default app;